---
name: karpathy-guidelines
description: Apply when writing or refactoring ANY code in this repo — the engineering philosophy (KISS/YAGNI/DRY/SOLID, no premature abstraction, short named functions, delete > add) and the enforced architecture/security boundaries.
---

# Engineering philosophy

Write the simplest thing that works. These rules override any instinct to
generalize early. `docs/GUIDELINES.md` (§1, §2, §12) is the authoritative reference.

## Principles

- **KISS** — the most direct solution. No indirection without a measurable benefit.
- **YAGNI** — don't build for a hypothetical need. No "just in case" abstraction.
- **DRY (rule of three)** — mutualize only after three real usages, never before.
  A local duplication beats a wrong coupling between features. Shared code lives in
  `packages/shared` (logic/types) or `packages/ui` (generic primitives) only, and only
  if it is truly generic (non-business).
- **SOLID** — one responsibility per module; depend on interfaces where a swap is
  likely (auth lives behind `useAuth` / `requireUser`).
- **Short, intention-named functions.** Pure business logic in `model.ts` / `lib/`;
  thin handlers and components around it.
- **Deleting code is as valuable as adding it.** Prefer removing over accreting.
- Comments and docs in **English** (the app is English by default).

## Boundaries (enforced by ESLint — don't fight them)

- A feature imports another feature only through its public `index.ts`
  (`eslint-plugin-boundaries`). Never reach into another feature's internals.
- Routes are thin: they compose features and hold no business logic.
- The frontend touches Convex only via the generated API (`@convex-tanstack-starter/backend/api`),
  never backend internals (`model.ts`, helpers).
- Files stay under 500 lines (`max-lines`, hard), aim 200–250; functions ~80 lines.

## Security frontier (§12.1 — never trust the client)

- Authorize first in every Convex function with `requireUser(ctx)` and a per-resource
  check; Convex has no row-level security.
- Validate every arg with `v.*` and the shared Zod schemas before any logic.
- `VITE_`-prefixed env vars are PUBLIC; secrets live Convex-side. `dangerouslySetInnerHTML`
  is banned (`react/no-danger`).

## How to apply

Before adding an abstraction, ask: is there a third real usage yet? If not, inline it.
Before adding a file, ask: does an existing utility (`@convex-tanstack-starter/ui`, `@convex-tanstack-starter/shared`,
`requireUser`) already cover this? Reuse it. When the diff only needs to change what was
asked, don't refactor the surroundings.
