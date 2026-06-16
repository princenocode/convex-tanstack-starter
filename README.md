# my_sample

A feature-first monorepo template: **TanStack Start** (React) on **Convex**
(realtime backend/DB), authenticated with **Better Auth** (`@convex-dev/better-auth`),
with shadcn/ui, Zod, React Hook Form, and a full quality/CI guard-rail layer.

See [`docs/GUIDELINES.md`](./docs/GUIDELINES.md) for the authoritative architecture and
rules, and [`CLAUDE.md`](./CLAUDE.md) for the AI-agent summary.

> **Using this as a template?** Click **"Use this template"** on GitHub (or fork),
> then make it yours:
>
> 1. Rename the package scope `my-sample` / `@my-sample/*` (root `package.json`,
>    each workspace `package.json`, and the `#/` import alias references).
> 2. Edit or delete the author credit: the `author` block in
>    `apps/web/src/components/landing/data.ts` and the `<SiteFooter />` component
>    (`apps/web/src/components/landing/SiteFooter.tsx`) — both are isolated and
>    safe to remove.
> 3. Update `LICENSE`, `SECURITY.md`, and the `repository` URL in `package.json`.
> 4. Run `pnpm bootstrap` to provision your own Convex deployment.
>
> The default route `/` is the sign-in / sign-up page; the template showcase
> (stack, architecture, live demo) lives at `/docs`.

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
`boundaries` enforces the isolation rules (see GUIDELINES §2).

## Getting started

Requires Node 22+ and pnpm 10+.

```bash
pnpm bootstrap
```

That single command does everything interactively:

1. installs dependencies,
2. provisions a Convex deployment — asks for a project name for a **new** project,
   or **re-links** an existing one (login pull) / lets you **paste** its URL,
3. generates and pushes the Convex-side secrets (`BETTER_AUTH_SECRET`, `SITE_URL`),
4. writes the public Convex URLs into `apps/web/.env.local`.

It's idempotent — re-run it any time (it offers to reuse an already-linked
deployment). Then start the app:

```bash
pnpm dev          # starts apps/web on http://localhost:3000
```

Sign up / sign in, then add and toggle tasks — the example `tasks` feature
demonstrates the full stack (shared Zod schema → Convex function with
authorization → reactive query in the UI).

<details>
<summary>Manual setup (what <code>pnpm bootstrap</code> automates)</summary>

```bash
pnpm install

# 1. Link a Convex deployment (generates convex/_generated/, writes the URL)
cd packages/backend
npx convex dev        # log in, create/select a project

# 2. Set Convex-side secrets (never in .env, GUIDELINES §12.2)
npx convex env set BETTER_AUTH_SECRET "$(openssl rand -base64 32)"
npx convex env set SITE_URL http://localhost:3000

# 3. Copy .env.example to apps/web/.env.local and fill the public Convex URLs:
#    VITE_CONVEX_URL=https://<deployment>.convex.cloud
#    VITE_CONVEX_SITE_URL=https://<deployment>.convex.site
#    VITE_SITE_URL=http://localhost:3000
```

</details>

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

| Skill                 | When it applies                                                                 |
| --------------------- | ------------------------------------------------------------------------------- |
| `karpathy-guidelines` | writing/refactoring any code — KISS/YAGNI, boundaries, security                 |
| `new-feature`         | adding a new vertical-slice feature (front + Convex back) per GUIDELINES §11    |
| `convex-function`     | writing an authorization-first Convex query/mutation/action (GUIDELINES §5/§12) |
