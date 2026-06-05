import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

// Application tables. Better Auth manages its own auth tables inside its
// Convex component, so users are not modeled here — the owner of a row is the
// Better Auth user id (a string subject) obtained via `requireUser` (§7, §12.1).
export default defineSchema({
  tasks: defineTable({
    userId: v.string(),
    title: v.string(),
    isCompleted: v.boolean(),
  }).index('by_user', ['userId']),
});
