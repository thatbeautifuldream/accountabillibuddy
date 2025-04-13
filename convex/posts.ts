import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPost = mutation({
  args: {
    text: v.string(),
    userId: v.string(),
    userName: v.string(),
    isPrivate: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert("posts", {
      text: args.text,
      userId: args.userId,
      userName: args.userName,
      createdAt: Date.now(),
      isPrivate: args.isPrivate ?? false,
    });
    return postId;
  },
});

export const listPosts = query({
  args: {
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Start with the base query with index
    let postsQuery = ctx.db.query("posts").withIndex("by_post_creation_time");

    // If user is logged in, show them all public posts plus their own private posts
    if (args.userId) {
      postsQuery = postsQuery.filter((q) =>
        q.or(
          // Public posts (including those where isPrivate is undefined)
          q.or(
            q.eq(q.field("isPrivate"), false),
            q.eq(q.field("isPrivate"), undefined),
          ),
          // User's own private posts
          q.and(
            q.eq(q.field("userId"), args.userId),
            q.eq(q.field("isPrivate"), true),
          ),
        ),
      );
    } else {
      // If no user is logged in, only return public posts
      postsQuery = postsQuery.filter((q) =>
        q.or(
          q.eq(q.field("isPrivate"), false),
          q.eq(q.field("isPrivate"), undefined),
        ),
      );
    }

    return await postsQuery.order("desc").collect();
  },
});

export const deletePost = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== args.userId) {
      throw new Error("Unauthorized: You can only delete your own posts");
    }

    // Delete all updates related to this post
    const updates = await ctx.db
      .query("updates")
      .withIndex("by_post_id", (q) => q.eq("postId", args.postId))
      .collect();

    for (const update of updates) {
      await ctx.db.delete(update._id);
    }

    // Delete all upvotes related to this post
    const upvotes = await ctx.db
      .query("postUpvotes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    for (const upvote of upvotes) {
      await ctx.db.delete(upvote._id);
    }

    // Finally, delete the post itself
    await ctx.db.delete(args.postId);
  },
});

export const editPost = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.string(),
    text: v.string(),
    isPrivate: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== args.userId) {
      throw new Error("Unauthorized: You can only edit your own posts");
    }

    const updateData: { text: string; isPrivate?: boolean } = {
      text: args.text,
    };

    // Only update isPrivate if it's provided
    if (args.isPrivate !== undefined) {
      updateData.isPrivate = args.isPrivate;
    }

    await ctx.db.patch(args.postId, updateData);

    return args.postId;
  },
});

export const togglePostPrivacy = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);

    if (!post) {
      throw new Error("Post not found");
    }

    if (post.userId !== args.userId) {
      throw new Error(
        "Unauthorized: You can only change privacy settings of your own posts",
      );
    }

    // Toggle the privacy setting
    const currentIsPrivate = post.isPrivate ?? false;
    await ctx.db.patch(args.postId, {
      isPrivate: !currentIsPrivate,
    });

    return args.postId;
  },
});

export const getUserPostsByUsername = query({
  args: {
    username: v.string(),
    currentUserId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Start with the base query with index
    let postsQuery = ctx.db
      .query("posts")
      .withIndex("by_username_and_creation_time", (q) =>
        q.eq("userName", args.username),
      );

    // If no user is logged in, only show public posts
    if (!args.currentUserId) {
      postsQuery = postsQuery.filter((q) =>
        q.or(
          q.eq(q.field("isPrivate"), false),
          q.eq(q.field("isPrivate"), undefined),
        ),
      );
    } else {
      // Check if the viewer is looking at their own profile
      const viewingOwnProfile = await ctx.db
        .query("posts")
        .filter((q) => q.eq(q.field("userId"), args.currentUserId))
        .filter((q) => q.eq(q.field("userName"), args.username))
        .first();

      // If not viewing own profile, filter out private posts
      if (!viewingOwnProfile) {
        postsQuery = postsQuery.filter((q) =>
          q.or(
            q.eq(q.field("isPrivate"), false),
            q.eq(q.field("isPrivate"), undefined),
          ),
        );
      }
      // If viewing own profile, show all posts (no filter needed)
    }

    return await postsQuery.order("desc").collect();
  },
});
