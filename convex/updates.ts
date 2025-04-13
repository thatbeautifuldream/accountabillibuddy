import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createUpdate = mutation({
  args: {
    postId: v.id("posts"),
    text: v.string(),
    userId: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify the post exists
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Verify the user is the author of the post
    if (post.userId !== args.userId) {
      throw new Error("Unauthorized: Only the post author can add updates");
    }

    const updateId = await ctx.db.insert("updates", {
      postId: args.postId,
      text: args.text,
      userId: args.userId,
      userName: args.userName,
      createdAt: Date.now(),
    });

    return updateId;
  },
});

export const editUpdate = mutation({
  args: {
    updateId: v.id("updates"),
    text: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const update = await ctx.db.get(args.updateId);

    if (!update) {
      throw new Error("Update not found");
    }

    if (update.userId !== args.userId) {
      throw new Error("Unauthorized: You can only edit your own updates");
    }

    await ctx.db.patch(args.updateId, {
      text: args.text,
    });

    return args.updateId;
  },
});

export const deleteUpdate = mutation({
  args: {
    updateId: v.id("updates"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const update = await ctx.db.get(args.updateId);

    if (!update) {
      throw new Error("Update not found");
    }

    if (update.userId !== args.userId) {
      throw new Error("Unauthorized: You can only delete your own updates");
    }

    await ctx.db.delete(args.updateId);
  },
});

export const getUpdatesForPost = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("updates")
      .withIndex("by_post_id_and_creation_time", (q) =>
        q.eq("postId", args.postId),
      )
      .order("desc")
      .collect();
  },
});
