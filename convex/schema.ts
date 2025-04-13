import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    text: v.string(),
    userId: v.string(),
    userName: v.string(),
    createdAt: v.number(),
  })
    .index("by_post_creation_time", ["createdAt"])
    .index("by_username_and_creation_time", ["userName", "createdAt"]),

  updates: defineTable({
    postId: v.id("posts"),
    userId: v.string(),
    userName: v.string(),
    text: v.string(),
    createdAt: v.number(),
  })
    .index("by_post_id", ["postId"])
    .index("by_post_id_and_creation_time", ["postId", "createdAt"]),
});
