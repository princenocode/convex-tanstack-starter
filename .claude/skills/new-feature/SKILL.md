---
name: new-feature
description: Use when adding a new feature / vertical slice to the app (a new domain area like "orders", "projects"). Scaffolds the mirrored frontend + Convex backend structure with feature isolation, per CONVENTIONS §11.
---

# Add a new feature (vertical slice)

A feature is an autonomous vertical slice; front and back mirror each other. The
existing **`tasks`** feature is the canonical example — copy its shape:

- Frontend: `apps/web/src/features/tasks/*`
- Backend: `packages/backend/convex/tasks/*`
- Shared schema: `packages/shared/src/schemas/task.ts`

## Steps (CONVENTIONS §11)

1. **Define the shared schema** in `packages/shared/src/schemas/<feature>.ts` with Zod,
   infer the types (`z.infer`), and re-export from `packages/shared/src/index.ts`. This is
   the single source of truth reused by both form and backend (§6).

2. **Create the backend slice** `packages/backend/convex/<feature>/`:
   - `model.ts` — pure, testable business logic (no DB). **Write `model.test.ts` first (TDD)**.
   - `queries.ts` / `mutations.ts` — handlers that orchestrate. Authorize FIRST with
     `requireUser(ctx)` from `packages/backend/convex/auth.ts`, validate args with `v.*`
     plus the shared Zod schema, then call `model.ts`. Add a per-resource ownership check.
     (See the `convex-function` skill.)
   - Add the table(s) to `packages/backend/convex/schema.ts` with the indexes you query by.

3. **Create the frontend slice** `apps/web/src/features/<feature>/`:

   ```
   api/          typed Convex hooks (useQuery via convexQuery, useMutation)
   hooks/        orchestration hooks (logic lives here, not in JSX)
   components/   presentational components (props in → JSX out)
   lib/          feature-internal utilities
   types.ts      feature-local types
   index.ts      ★ PUBLIC API — the ONLY import surface from outside
   ```

   Reuse primitives from `@my-sample/ui` (`Button`, `Spinner`, `cn`). Import the backend
   API via `@my-sample/backend/api` and types via `@my-sample/backend/dataModel`.

4. **Export only through `index.ts`.** Other features/routes import from
   `#/features/<feature>` (the barrel), never an internal file — enforced by ESLint
   `boundaries`.

5. **Add a thin route** under `apps/web/src/routes/` that composes the feature's public
   components. No business logic in the route.

6. **Test**: `model.ts` (Vitest, required) + one component behavior test (RTL).

## Checklist before done

- No cross-feature internal imports (only via `index.ts`).
- No backend logic in the frontend; authorization is server-side.
- Files < 500 lines. Conventional Commit (`feat: add <feature> feature`).
