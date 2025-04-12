import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    text: v.string(),
    userId: v.string(),
    userName: v.string(),
    createdAt: v.number(),
  }).index("creation_time", ["createdAt"]),
});
