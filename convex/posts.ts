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
