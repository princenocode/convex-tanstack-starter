import { betterAuth } from 'better-auth/minimal';
import { createClient, type GenericCtx } from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { ConvexError } from 'convex/values';
import authConfig from './auth.config';
import { components } from './_generated/api';
import { query } from './_generated/server';
import type { QueryCtx, MutationCtx } from './_generated/server';
import type { DataModel } from './_generated/dataModel';

const siteUrl = process.env.SITE_URL!;

// The component client — the only object the rest of the backend touches.
export const authComponent = createClient<DataModel>(components.betterAuth);

// Builds the Better Auth instance bound to the current Convex context.
export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
    },
    plugins: [convex({ authConfig })],
  });

// Public query the client reads to know who is signed in. Returns `null` when
// unauthenticated (no throw) so the UI can branch on it.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => authComponent.safeGetAuthUser(ctx),
});

/**
 * Stable authorization primitive (§7, §12.1). Call this FIRST in every
 * protected query/mutation: it returns the current user or throws. The rest of
 * the backend depends only on this — never on Better Auth directly — so the
 * auth provider can be swapped without a refactor cascade.
 */
export async function requireUser(ctx: QueryCtx | MutationCtx) {
  const user = await authComponent.safeGetAuthUser(ctx);
  if (!user) {
    throw new ConvexError('Unauthorized: authentication required.');
  }
  return user;
}
