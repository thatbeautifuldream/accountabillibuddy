import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    text: v.string(),
    userId: v.string(),
    userName: v.string(),
    createdAt: v.number(),
    isPrivate: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
  })
    .index("by_post_creation_time", ["createdAt"])
    .index("by_username_and_creation_time", ["userName", "createdAt"]),

  postUpvotes: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
    createdAt: v.number(),
  })
    .index("by_post", ["postId"])
    .index("by_user", ["userId"])
    .index("by_post_and_user", ["postId", "userId"]),

  updates: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
    userName: v.string(),
    text: v.string(),
    createdAt: v.number(),
  })
    .index("by_post_id", ["postId"])
    .index("by_post_id_and_creation_time", ["postId", "createdAt"]),

  notifications: defineTable({
    userId: v.string(), // receiver
    actorId: v.string(), // who triggered the notification
    actorName: v.string(), // username of actor
    message: v.string(),
    postId: v.id("posts"),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_creation_time", ["userId", "createdAt"])
    .index("by_user_and_read_status", ["userId", "isRead"]),
});
