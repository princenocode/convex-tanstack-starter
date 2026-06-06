# my_sample

A feature-first monorepo template: **TanStack Start** (React) on **Convex**
(realtime backend/DB), authenticated with **Better Auth** (`@convex-dev/better-auth`),
with shadcn/ui, Zod, React Hook Form, and a full quality/CI guard-rail layer.

See [`CONVENTIONS.md`](./CONVENTIONS.md) for the authoritative architecture and
rules, and [`CLAUDE.md`](./CLAUDE.md) for the AI-agent summary.

## Stack

| Layer    | Tech                                                                                 |
| -------- | ------------------------------------------------------------------------------------ |
| Frontend | TanStack Start v1 · Vite · TanStack Query · shadcn/ui · Tailwind                     |
| Backend  | Convex (queries / mutations / actions)                                               |
| Auth     | Better Auth via `@convex-dev/better-auth` (alpha), isolated behind `features/auth`   |
| Shared   | Zod schemas + inferred types (`packages/shared`)                                     |
| Tooling  | pnpm workspaces · Turborepo · ESLint (flat) · Prettier · Vitest · husky · commitlint |

## Layout

```
apps/web/                  TanStack Start app (routes, features, lib)
packages/backend/          Convex backend (schema, tasks/, auth)
packages/shared/           Zod schemas + types shared front ↔ back
packages/ui/               generic UI primitives (cn, Button, Spinner)
packages/config/           eslint / tsconfig / prettier presets
```

Each feature is a vertical slice exposing a single public `index.ts`; ESLint
`boundaries` enforces the isolation rules (see CONVENTIONS §2).

## Getting started

Requires Node 22+ and pnpm 10+.

```bash
pnpm install
```

### 1. Link a Convex deployment (required before typecheck / build / dev)

The app and backend import Convex's generated API, which only exists after the
Convex CLI runs. From `packages/backend`:

```bash
cd packages/backend
npx convex dev        # log in, create/select a project; generates convex/_generated/
```

### 2. Set Convex-side secrets

Secrets live on Convex, never in `.env` (CONVENTIONS §12.2):

```bash
npx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
npx convex env set SITE_URL http://localhost:3000
```

### 3. Configure the web env

Copy `.env.example` to `apps/web/.env.local` and fill the **public** Convex URLs
printed by `npx convex dev`:

```
VITE_CONVEX_URL=https://<deployment>.convex.cloud
VITE_CONVEX_SITE_URL=https://<deployment>.convex.site
VITE_SITE_URL=http://localhost:3000
```

### 4. Run

Keep `npx convex dev` running in one terminal, then:

```bash
pnpm dev          # starts apps/web on http://localhost:3000
```

Sign up / sign in, then add and toggle tasks — the example `tasks` feature
demonstrates the full stack (shared Zod schema → Convex function with
authorization → reactive query in the UI).

## Scripts

| Command          | What                                              |
| ---------------- | ------------------------------------------------- |
| `pnpm dev`       | run the app (Turborepo)                           |
| `pnpm lint`      | ESLint across the monorepo (enforces conventions) |
| `pnpm typecheck` | per-package `tsc` (needs Convex `_generated/`)    |
| `pnpm test`      | Vitest (unit + component + Convex tests)          |
| `pnpm build`     | production build (needs Convex `_generated/`)     |
| `pnpm format`    | Prettier write                                    |

## Quality gates

- **pre-commit** (husky + lint-staged): Prettier + ESLint on staged files.
- **commit-msg**: Conventional Commits (commitlint).
- **pre-push**: `typecheck + test + build`.
- **CI** (GitHub Actions): lint · typecheck · test · build · gitleaks · `pnpm audit`.

> Note: CI typecheck/build require a Convex deployment. Provide a `CONVEX_DEPLOY_KEY`
> (and the `VITE_CONVEX_*` env) so the workflow can run `convex codegen`.

## AI agent guidance

`CLAUDE.md`, `AGENTS.md`, and `.cursor/rules/karpathy.mdc` encode the philosophy for
coding agents. The template also ships **Claude Code Agent Skills** in `.claude/skills/`:

| Skill                 | When it applies                                                      |
| --------------------- | -------------------------------------------------------------------- |
| `karpathy-guidelines` | writing/refactoring any code — KISS/YAGNI, boundaries, security      |
| `new-feature`         | adding a new vertical-slice feature (front + Convex back) per §11    |
| `convex-function`     | writing an authorization-first Convex query/mutation/action (§5/§12) |
