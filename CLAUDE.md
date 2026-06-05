# CLAUDE.md

Guidance for AI agents working in this repo. `CONVENTIONS.md` is the full,
authoritative reference — read it. This file is the fast summary.

## Philosophy (apply, don't decorate)

- **KISS / YAGNI / DRY / SOLID** — the most direct solution that works. No
  abstraction "just in case". Mutualize only after **three** real usages.
- **No premature abstraction.** Prefer a local duplication over a wrong coupling.
  Deleting code is as valuable as adding it.
- **Short, intention-named functions.** Business logic in pure, testable units
  (`model.ts`, `lib/`); handlers and components stay thin.
- Comments and docs are in **English** (the app is English by default).

## Architecture (feature-first, vertical slices)

```
apps/web/                    TanStack Start app (frontend + server fns)
packages/backend/            Convex (schema, queries, mutations, actions, auth)
packages/shared/             Zod schemas + inferred types (single source of truth)
packages/ui/                 generic, business-free shadcn-style primitives
packages/config/             eslint / tsconfig / prettier presets
```

A feature is autonomous. **Hard rules (enforced by ESLint `boundaries`):**

1. Import another feature only through its public `index.ts` — never an internal file.
2. Routes are thin: they compose features, they hold no business logic.
3. The frontend touches Convex only via the generated API (`@my-sample/backend/api`),
   never backend internals (`model.ts`, helpers).
4. No backend logic in the frontend: validation, authorization, writes → Convex functions.

## Security (never trust the client)

- **Authorize first** in every Convex function with `requireUser(ctx)` and a
  per-resource check — Convex has no row-level security.
- Anything not meant for the client is `internal*`. Validate every arg with `v.*`
  and the shared Zod schemas.
- `VITE_`-prefixed env vars are PUBLIC (bundled). Secrets live Convex-side
  (`npx convex env set`), never in `.env`.
- `dangerouslySetInnerHTML` is banned (ESLint `react/no-danger`); use DOMPurify if
  user HTML is unavoidable.

## Workflow

- Pure logic (`model.ts`, `lib/`, Convex functions) → **TDD** (red → green → refactor).
- UI → test behavior after, with RTL.
- Files < 500 lines (hard), aim 200–250. Conventional Commits.
- Auth is alpha (`@convex-dev/better-auth`) and isolated behind `features/auth`
  (`useAuth`, `AuthBoundary`) + backend `requireUser` — depend only on that interface.

## Running it

This needs a Convex deployment before it can typecheck/build/run:

```bash
pnpm install
cd packages/backend && npx convex dev      # links a deployment, generates _generated/
# set Convex-side secrets:
npx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
npx convex env set SITE_URL http://localhost:3000
# fill apps/web/.env.local from .env.example (VITE_CONVEX_URL, VITE_CONVEX_SITE_URL, VITE_SITE_URL)
pnpm dev
```
