import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createPost = mutation({
  args: {
    text: v.string(),
    userId: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    const postId = await ctx.db.insert("posts", {
      text: args.text,
      userId: args.userId,
      userName: args.userName,
      createdAt: Date.now(),
    });
    return postId;
  },
});

export const listPosts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_creation_time")
      .order("desc")
      .collect();
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

    await ctx.db.delete(args.postId);
  },
});

export const getUserPostsByUsername = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_username_and_creation_time", (q) =>
        q.eq("userName", args.username),
      )
      .order("desc")
      .collect();
  },
});
