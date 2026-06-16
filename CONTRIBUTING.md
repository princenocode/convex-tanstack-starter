# Contributing

Thanks for your interest in improving this template. Contributions of all sizes
are welcome.

## Getting started

```bash
pnpm bootstrap   # install, link/create a Convex project, write apps/web/.env.local
pnpm dev
```

See the [README](./README.md) for the full setup and the
[engineering guidelines](./docs/GUIDELINES.md) for the conventions this codebase
follows — they are the authoritative reference for architecture, naming, and
testing.

## Ground rules

- **Read `docs/GUIDELINES.md` first.** Feature-first vertical slices, feature
  isolation through `index.ts`, authorize-first in every Convex function.
- **Keep the boundaries.** The frontend touches Convex only via the generated
  API; no business logic in routes or components.
- **Tests.** Pure logic (`model.ts`, `lib/`, Convex functions) is TDD; UI is
  tested for behavior with React Testing Library.
- **Small, focused changes.** Files under 500 lines; prefer deleting code to
  adding it.

## Before opening a PR

Make sure the quality gates pass locally:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Commits

This repo uses [Conventional Commits](https://www.conventionalcommits.org/)
(enforced by commitlint). Examples:

```
feat(auth): add password reset flow
fix(tasks): guard against empty title
docs: clarify bootstrap steps
```

## Reporting bugs / requesting features

Open an issue using the provided templates. For security issues, follow
[SECURITY.md](./SECURITY.md) instead of opening a public issue.
