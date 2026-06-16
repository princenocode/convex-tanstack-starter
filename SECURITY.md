# Security Policy

## Reporting a vulnerability

Please **do not** open a public issue for security vulnerabilities.

Instead, report it privately via
[GitHub's private vulnerability reporting](https://github.com/princenocode/my_sample/security/advisories/new)
(Security → Report a vulnerability). We aim to acknowledge reports within a few
days.

## Security model of this template

This is a starter template — when you build on it, keep these invariants:

- **Never trust the client.** Authorize first in every Convex function with
  `requireUser(ctx)` plus a per-resource check. Convex has no row-level security.
- **Secrets stay server-side.** Real secrets live in Convex
  (`npx convex env set`), never in a `.env` file. Only `VITE_`-prefixed vars are
  public and bundled into the client.
- **Validate every argument** with `v.*` validators and the shared Zod schemas.
- Anything not meant for the client must be an `internal*` function.

See [`docs/GUIDELINES.md`](./docs/GUIDELINES.md) and
[`CLAUDE.md`](./CLAUDE.md) for the full security guidance.
