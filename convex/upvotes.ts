import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Toggle an upvote for a post (add if not exists, remove if exists)
export const toggleUpvote = mutation({
  args: {
    postId: v.id("posts"),
    userId: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the post exists
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if the user has already upvoted this post
    const existingUpvote = await ctx.db
      .query("postUpvotes")
      .withIndex("by_post_and_user", (q) =>
        q.eq("postId", args.postId).eq("userId", args.userId),
      )
      .unique();

    // If upvote exists, remove it
    if (existingUpvote) {
      await ctx.db.delete(existingUpvote._id);
      return { action: "removed" };
    }

    // Otherwise, add a new upvote
    // First double-check that no upvote exists to enforce uniqueness
    const allExistingUpvotes = await ctx.db
      .query("postUpvotes")
      .withIndex("by_post_and_user", (q) =>
        q.eq("postId", args.postId).eq("userId", args.userId),
      )
      .collect();

    if (allExistingUpvotes.length > 0) {
      // In case there's a race condition, we'll just return the existing upvote
      return { action: "exists", id: allExistingUpvotes[0]._id };
    }

    const upvoteId = await ctx.db.insert("postUpvotes", {
      postId: args.postId,
      userId: args.userId,
      createdAt: Date.now(),
    });

    // Create a notification for the post author
    if (post.userId !== args.userId) {
      await ctx.runMutation(api.notifications.createNotification, {
        userId: post.userId,
        actorId: args.userId,
        actorName: args.userName,
        message: `@${args.userName} upvoted your post.`,
        postId: args.postId,
      });
    }

    return { action: "added", id: upvoteId };
  },
});

// Get the count of upvotes for a post
export const getUpvoteCount = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const upvotes = await ctx.db
      .query("postUpvotes")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .collect();

    return upvotes.length;
  },
});

// Check if a user has upvoted a specific post
export const hasUserUpvoted = query({
  args: {
    postId: v.id("posts"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const upvote = await ctx.db
      .query("postUpvotes")
      .withIndex("by_post_and_user", (q) =>
        q.eq("postId", args.postId).eq("userId", args.userId),
      )
      .unique();

    return !!upvote;
  },
});
