import { betterAuth } from 'better-auth/minimal';
import { createClient, type GenericCtx } from '@convex-dev/better-auth';
import { ConvexError } from 'convex/values';
import { createAuthOptions } from './auth.options';
import schema from './betterAuth/schema';
import { components } from './_generated/api';
import { query } from './_generated/server';
import type { QueryCtx, MutationCtx } from './_generated/server';
import type { DataModel } from './_generated/dataModel';

// The component client — the only object the rest of the backend touches. It is
// bound to the LOCAL (vendored) component schema so the user document it returns
// carries the app-level `role` field (§6, ./betterAuth/schema.ts).
export const authComponent = createClient<DataModel, typeof schema>(components.betterAuth, {
  local: { schema },
});

// Builds the Better Auth instance bound to the current Convex context. The
// static options (incl. the server-controlled `role` additionalField) live in
// ./auth.options.ts so the vendored component can reuse them; `database` is the
// only per-request piece layered on here.
export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth({
    ...createAuthOptions(),
    database: authComponent.adapter(ctx),
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
