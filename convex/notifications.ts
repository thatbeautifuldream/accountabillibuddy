import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get notifications for a user
export const getNotificationsForUser = query({
  args: {
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db
      .query("notifications")
      .withIndex("by_user_and_creation_time", (q) =>
        q.eq("userId", args.userId),
      )
      .order("desc")
      .take(limit);
  },
});

// Get unread notification count for a user
export const getUnreadNotificationCount = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const unreadNotifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read_status", (q) =>
        q.eq("userId", args.userId).eq("isRead", false),
      )
      .collect();

    return unreadNotifications.length;
  },
});

// Mark a notification as read
export const markNotificationAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.notificationId, {
      isRead: true,
    });
    return null;
  },
});

// Mark all notifications as read for a user
export const markAllNotificationsAsRead = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_user_and_read_status", (q) =>
        q.eq("userId", args.userId).eq("isRead", false),
      )
      .collect();

    for (const notification of notifications) {
      await ctx.db.patch(notification._id, {
        isRead: true,
      });
    }

    return null;
  },
});

// Create a notification (internal helper)
export const createNotification = mutation({
  args: {
    userId: v.string(),
    actorId: v.string(),
    actorName: v.string(),
    message: v.string(),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    // Verify the post exists
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Don't notify yourself
    if (args.userId === args.actorId) {
      return null;
    }

    return await ctx.db.insert("notifications", {
      userId: args.userId,
      actorId: args.actorId,
      actorName: args.actorName,
      message: args.message,
      postId: args.postId,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});
