import { v, ConvexError } from 'convex/values';
import { createTaskSchema } from '@convex-tanstack-starter/shared';
import { mutation } from '../_generated/server';
import type { MutationCtx } from '../_generated/server';
import type { Id } from '../_generated/dataModel';
import { requireUser } from '../auth';
import { buildTask } from './model';

// Create a task for the current user. `v.*` is the boundary validator; the Zod
// schema enforces the shared business rules (§6, §12.4).
export const create = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const parsed = createTaskSchema.safeParse(args);
    if (!parsed.success) {
      throw new ConvexError(parsed.error.issues[0]?.message ?? 'Invalid task');
    }
    return ctx.db.insert('tasks', buildTask(user._id, parsed.data));
  },
});

export const setCompleted = mutation({
  args: { taskId: v.id('tasks'), isCompleted: v.boolean() },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    await assertOwnedTask(ctx, args.taskId, user._id);
    await ctx.db.patch(args.taskId, { isCompleted: args.isCompleted });
  },
});

export const remove = mutation({
  args: { taskId: v.id('tasks') },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    await assertOwnedTask(ctx, args.taskId, user._id);
    await ctx.db.delete(args.taskId);
  },
});

// Per-resource authorization (§12.1): throw "not found" rather than "forbidden"
// so we don't leak the existence of another user's row.
async function assertOwnedTask(ctx: MutationCtx, taskId: Id<'tasks'>, userId: string) {
  const task = await ctx.db.get(taskId);
  if (!task || task.userId !== userId) {
    throw new ConvexError('Task not found');
  }
}
