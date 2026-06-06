import { query } from '../_generated/server';
import { requireUser } from '../auth';

// List the current user's tasks, newest first. Authorization is the first line
// (§12.1): Convex has no row-level security, so the `by_user` index scope is
// what keeps users from reading each other's rows.
export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    return ctx.db
      .query('tasks')
      .withIndex('by_user', (q) => q.eq('userId', user._id))
      .order('desc')
      .collect();
  },
});
