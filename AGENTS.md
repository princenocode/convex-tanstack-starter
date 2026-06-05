# AGENTS.md

This repo follows the conventions in `CONVENTIONS.md` (authoritative) and the
summary in `CLAUDE.md`. Any coding agent should read those first.

Key expectations:

- **Feature-first, isolated slices.** Cross-feature imports go through the
  feature's public `index.ts` only — enforced by ESLint `boundaries`.
- **Backend boundary is the frontier.** Authorize first (`requireUser`), validate
  with `v.*` + shared Zod schemas, keep secrets Convex-side. Never trust the client.
- **KISS / YAGNI / DRY / SOLID**, no premature abstraction, short named functions,
  delete over add. English comments/docs.
- **TDD** for pure logic and non-trivial Convex functions; behavior tests for UI.
- Files < 500 lines. Conventional Commits. Run `pnpm lint && pnpm typecheck && pnpm test`
  before proposing changes (typecheck/test need a linked Convex deployment).

See `CLAUDE.md` for the run/setup steps.
