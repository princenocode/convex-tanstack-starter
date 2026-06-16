---
name: convex-function
description: Use when writing a Convex query, mutation, or action in packages/backend. Enforces authorization-first, argument + business validation, and pure logic in model.ts, per GUIDELINES §5 / §12.
---

# Write a Convex function

The pattern lives in `packages/backend/convex/tasks/{queries,mutations,model}.ts` and
`packages/backend/convex/auth.ts` (`requireUser`). Mirror it.

## Pick the right type

- `query` — read-only, reactive.
- `mutation` — transactional write.
- `action` — external effects (HTTP, email, AI). An action has no DB access; it calls
  `runQuery` / `runMutation` on **internal** functions. Never the inverse.

## Required structure of every handler

1. **Authorize first (§12.1).** Call `const user = await requireUser(ctx)` as the first
   line. Convex has NO row-level security — the check you write is the only thing stopping
   one user from touching another's data.
2. **Validate args** with `v.*` (the boundary), then enforce business rules with the shared
   Zod schema from `@convex-tanstack-starter/shared` (`schema.safeParse(args)`), throwing `ConvexError`
   on failure (§6, §12.4).
3. **Per-resource ownership check** when touching a specific row: load it, and if it's
   missing or not owned by `user._id`, throw `ConvexError('… not found')` — "not found"
   rather than "forbidden" so you don't leak that the row exists.
4. **Delegate to `model.ts`** for pure logic (e.g. `buildX(...)`); the handler only
   orchestrates. Pure logic is unit-tested.
5. **Name by intent**: `getOrderById`, `markOrderAsPaid`, `create`, `setCompleted`.

## Internal vs public

Anything that must not be callable from the client → `internalQuery` / `internalMutation`
/ `internalAction`. A public function is an endpoint anyone with the deployment URL can
call. Footgun: exposing as `public` what should be `internal`.

## Reference

- Pattern: `packages/backend/convex/tasks/mutations.ts` (authz + Zod + ownership + model),
  `queries.ts` (index-scoped read), `model.ts` (pure builder + test).
- `requireUser`: `packages/backend/convex/auth.ts`.
- Rules: `docs/GUIDELINES.md` §5, §12.1, §12.4.
