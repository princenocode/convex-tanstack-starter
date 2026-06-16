# GUIDELINES.md

> Engineering guidelines shipped with this template — and inherited by every
> project derived from it. This is the authoritative reference; `CLAUDE.md` is its
> fast summary for AI agents.
> Stack: TypeScript · React · **TanStack Start** (v1) · Vite · **Convex** (backend + real-time DB)
> Auth: **Better Auth** (`@convex-dev/better-auth`) — Convex Auth as a fallback/option.
> Tooling: pnpm workspaces + Turborepo · shadcn/ui · Zod · React Hook Form · Vitest · Playwright.

---

## 1. Founding principles (applied, not decorative)

| Principle | What it means HERE                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------ |
| **KISS**  | The most direct solution that works. No indirection without a measurable benefit.                            |
| **YAGNI** | We don't code for a hypothetical need. No "just in case" abstraction.                                        |
| **DRY**   | We factor out **after 3 real usages** (rule of three), never before.                                         |
| **SOLID** | Especially S (one responsibility per module) and D (depend on interfaces where a swap is likely: e.g. auth). |

### ⚠️ Tensions to arbitrate consciously

- **DRY vs feature independence**: NEVER factor code between two features just because they look alike. A local duplication is preferable to a coupling. Shared code only lives in `packages/shared` or `packages/ui`, and only if it is truly generic (non-business).
- **SOLID vs YAGNI**: the only abstraction imposed by default is the **feature's public API** (`index.ts`). Everything else stays concrete until a need is proven.

---

## 2. Architecture

### Monorepo (pnpm + Turborepo)

```
apps/web/                  → TanStack Start app (frontend + server functions)
packages/backend/          → Convex (schema, functions, auth)
packages/ui/               → shared shadcn primitives
packages/shared/           → Zod schemas + shared front ↔ back types (single source)
packages/config/           → eslint / tsconfig / prettier presets
```

### Feature-first (the heart of the architecture)

A _feature_ = a vertical, **autonomous** business slice. Front and back **mirror** each other:

```
apps/web/src/features/<feature>/
  components/      → feature-specific components
  hooks/           → React hooks (incl. Convex query wrappers)
  api/             → client-side Convex calls (typed useQuery/useMutation)
  lib/             → feature-internal utilities
  types.ts         → local types
  index.ts         → ★ PUBLIC API: the only import point allowed from the outside

packages/backend/convex/<feature>/
  queries.ts  mutations.ts  actions.ts  model.ts   → server-side business logic
```

### Isolation rules (enforced by ESLint `boundaries`)

1. A feature **can only import another feature via its `index.ts`** — never an internal file.
2. `routes/` are **thin**: they compose features, they hold no business logic.
3. The frontend **imports Convex only via the generated API** (`_generated/api`) — never the backend's internal helpers/`model.ts`.
4. **No backend logic in the frontend**: business validation, authority computations, writes → always in a Convex function.

---

## 3. Naming conventions

| Element               | Convention                   | Example                      |
| --------------------- | ---------------------------- | ---------------------------- |
| Folders               | `kebab-case`                 | `user-profile/`              |
| Component files       | `PascalCase.tsx`             | `UserCard.tsx`               |
| Hook files            | `camelCase.ts`, `use` prefix | `useUserSession.ts`          |
| Utils/lib files       | `kebab-case.ts`              | `format-date.ts`             |
| React components      | `PascalCase`                 | `function UserCard()`        |
| Hooks                 | `useXxx`                     | `useCart()`                  |
| Convex functions      | `camelCase`, intent verb     | `getUserById`, `createOrder` |
| Variables / functions | `camelCase`                  | `totalAmount`                |
| Types / interfaces    | `PascalCase` (no `I` prefix) | `Order`, `CartItem`          |
| Global constants      | `SCREAMING_SNAKE_CASE`       | `MAX_RETRIES`                |
| Zod schemas           | `xxxSchema`                  | `orderSchema`                |
| Booleans              | `is`/`has`/`can` prefix      | `isLoading`, `hasAccess`     |

---

## 4. Building components

- **One component per file**, named export (no `default` unless the framework forces it).
- **Presentation ≠ logic**: data and logic live in hooks (`useXxx`), the component renders JSX.
- **Explicitly typed props** via a `type XxxProps`. No `any`.
- **No Convex fetch/mutation directly in JSX**: go through an `api/` or `hooks/` hook.
- **Pure and predictable** component: same props → same render. Side effects only in `useEffect`/handlers.
- Accessibility by default (`eslint-plugin-jsx-a11y`).
- If a component exceeds ~150 lines or mixes several responsibilities → split it.

```tsx
// api/useOrders.ts
export function useOrders() {
  return useQuery(api.orders.list, {});
}

// components/OrderList.tsx
type OrderListProps = { onSelect: (id: Id<'orders'>) => void };
export function OrderList({ onSelect }: OrderListProps) {
  const orders = useOrders();
  if (orders === undefined) return <Spinner />;
  return (
    <ul>
      {orders.map((o) => (
        <OrderRow key={o._id} order={o} onSelect={onSelect} />
      ))}
    </ul>
  );
}
```

---

## 5. Building Convex functions

- **Pick the right type**:
  - `query` → read-only, reactive.
  - `mutation` → transactional write.
  - `action` → external side effects (HTTP, emails, AI). An action does not access the DB directly: it calls `runQuery`/`runMutation`.
- **Always validate args with `v` (convex/values)** + reuse the Zod schemas from `packages/shared` for business validation.
- **Business logic in `model.ts`** (pure, testable functions), not in the handler. The handler orchestrates.
- **Explicit authorization** at the start of every function (who is allowed?). Never on the client side.
- Intent-based naming: `getOrderById`, `markOrderAsPaid`.

```ts
// convex/orders/mutations.ts
export const create = mutation({
  args: { items: v.array(v.object({ productId: v.id('products'), qty: v.number() })) },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx); // explicit authorization
    const order = buildOrder(user._id, args.items); // pure logic → model.ts
    return ctx.db.insert('orders', order);
  },
});
```

---

## 6. Validation, env, state, errors, forms

- **Zod = source of truth** for shared shapes (`packages/shared`). Infer types from Zod (`z.infer`), don't duplicate them.
- **Env variables validated at boot** via a Zod-typed `env.ts` + an up-to-date `.env.example`. Auth secrets (BETTER_AUTH_SECRET, OAuth) live on the **Convex** side (CLI/dashboard), not in `.env.local`.
- **Forms**: React Hook Form + `@hookform/resolvers/zod` + shadcn components. The form schema = the shared Zod schema.
- **State**: server data → Convex `useQuery` (reactive). Local UI state → `useState`. Global UI state → Zustand (only if truly necessary — YAGNI).
- **Errors**: Error Boundaries per route + a typed error-return pattern on the Convex side. No `try/catch` that silently swallows.

---

## 7. Auth (isolated and swappable feature)

- All auth lives in `features/auth/` (front) + `convex/auth.ts` (back), behind a **stable public API**: `useAuth()`, `requireUser(ctx)`, `<AuthBoundary>`.
- The rest of the code **depends only on this interface**, never on Better Auth directly.
- Rationale: the Convex + Better Auth component is in **alpha**. This isolation makes it possible to switch to Convex Auth without a cascading refactor.
- **Custom user fields** (e.g. `role`, §6) require a **local install** of the Better Auth component: it is vendored under `convex/betterAuth/` so its `user` table can declare the field. Adding/changing a custom field means editing **both** `convex/auth.options.ts` (`additionalFields`) **and** `convex/betterAuth/schema.ts`. After upgrading `@convex-dev/better-auth`, re-sync `convex/betterAuth/schema.ts` from the new published component schema and re-apply the custom fields.

---

## 8. File size limit

- **Hard ceiling: 500 lines / file** (ESLint `max-lines`).
- **Soft target: 200–250 lines.** Beyond that, it's a signal of multiple responsibilities → split.
- Functions: `max-lines-per-function` (~80) + reasonable `complexity`.
- _The goal is not the line count but the single responsibility; the limit is a guardrail, not an objective._

---

## 9. Tests

| Level     | Tool                           | What                                   |
| --------- | ------------------------------ | -------------------------------------- |
| Unit      | **Vitest**                     | pure logic (`model.ts`, `lib/`, hooks) |
| Component | Vitest + React Testing Library | UI behavior                            |
| Backend   | **convex-test**                | queries/mutations/actions              |
| E2E       | **Playwright**                 | critical flows (auth, checkout…)       |

- Every `model.ts` (pure business logic) **must** be tested.
- The test lives next to the file: `xxx.test.ts`.
- Coverage thresholds checked in CI (not locally, to stay fast).

### 9.1 TDD methodology (targeted, not dogmatic)

TDD is a **tool, not a religion** — applying it everywhere conflicts with YAGNI.

| Case                                                                 | Approach                                                              | Why                                                                 |
| -------------------------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Pure logic (`model.ts`, `lib/`, business rules, parsers, validators) | **TDD by default**: red → green → refactor                            | Behavior specifiable in advance; better design, regressions covered |
| Convex functions (mutations/queries with non-trivial logic)          | **TDD** via `convex-test`                                             | Authorization and invariants are specified up front                 |
| UI components                                                        | Test the **behavior after** (RTL)                                     | The render emerges from design; TDD is low-yield there              |
| Spikes / exploration                                                 | **No tests during**; consolidate into tests once the design is stable | Forcing tests on throwaway code = waste                             |
| Glue / config                                                        | No TDD                                                                | Little logic to specify                                             |

- **Cycle**: write a failing test (red) → minimal code that passes (green) → refactor while green.
- **With Claude Code**: writing the test first gives the agent an **executable spec** + a verification loop — it knows when it's done and doesn't drift. Prefer this for any pure logic handed to the AI.

---

## 10. Git & quality (what runs, and when)

**Conventional Commits** mandatory (`feat:`, `fix:`, `chore:`…) — checked by **commitlint**.

| Stage        | Tool                    | Action                                                      | Why there                |
| ------------ | ----------------------- | ----------------------------------------------------------- | ------------------------ |
| `pre-commit` | husky + **lint-staged** | prettier + eslint **on staged files**                       | fast, non-blocking       |
| `commit-msg` | commitlint              | message format                                              | history standard         |
| `pre-push`   | husky                   | `typecheck` + `test` + `build`                              | local net before sharing |
| CI (PR)      | GitHub Actions          | lint + typecheck + test + build + `gitleaks` + `pnpm audit` | **the real guardrail**   |

> Husky is **local** and bypassable (`--no-verify`). The GitHub Actions CI is the only real barrier: that's where `pnpm audit` and the secret scan live (too slow/critical for the commit).

---

## 11. Checklist for a new feature

1. Create `features/<feature>/` (front) **and** `convex/<feature>/` (back) as mirrors.
2. Define the Zod schemas in `packages/shared`.
3. Server business logic in `model.ts` (pure) + thin Convex handlers.
4. Expose a **public API** via `index.ts`.
5. Thin routes that compose the feature.
6. Tests: `model.ts` + critical flow.
7. Verify: no cross-feature import, no backend logic in the front, files < 500 lines.

---

## 12. Security

> Guiding principle: **never trust the client.** Validate at the boundary, encode at the output, never a query/command built by string concatenation. The front _protects_ nothing — it only calls.

### 12.1 Convex authorization model (the real boundary)

- A public `query`/`mutation`/`action` **is an endpoint callable by anyone** who knows the deployment URL, outside your front. Security plays out here, not in the UI.
- **Explicit authorization on the first line** of every function: who is the user, and do they have the right on _this_ specific resource (not just "is logged in").
- Convex has **no row-level security**: nothing technically prevents reading another user's table, except the check you write. Per-resource authz is non-negotiable.
- Anything that must not be called from the client → `internalQuery` / `internalMutation` / `internalAction`. Footgun #1: exposing as `public` what should have been `internal`. An action orchestrates _internal_ functions, never the reverse.

### 12.2 Env variables & secrets

- Any **`VITE_` prefix is bundled into the client = PUBLIC.** Never a secret in it.
- Secrets (`BETTER_AUTH_SECRET`, OAuth secrets, third-party API keys) → **Convex side** (CLI/dashboard), touched only in actions/server functions.
- `env.ts` validated by Zod at boot + an up-to-date `.env.example`. `gitleaks` in CI for accidental commits to the repo.

### 12.3 Anti-injection (by class)

- **SQL / NoSQL**: nonexistent on the Convex side (structured API `ctx.db.query(...).withIndex(...)`, no raw SQL). ⚠️ **Supabase/Postgres** (other projects): parameterized queries / query builder only, never concatenated SQL.
- **XSS (the real vector, front)**: React escapes by default. So:
  - `dangerouslySetInnerHTML` **forbidden by default**; if user HTML/markdown is needed → **DOMPurify** mandatory (ESLint `react/no-danger` rule).
  - **User URLs in `href`/`src`**: validate the scheme (allowlist `https`/`http`/`mailto`) — a `javascript:` stays executable otherwise.
  - **TanStack Start SSR**: any user content injected into the `<head>`/document server-side must be escaped.
- **Prompt injection (AI)**: treat any **LLM output as untrusted input**. Never a privileged action (mutation, email, API call) triggered by an LLM output without Zod re-validation in code.
- **Open redirect (Better Auth flow)**: the post-login/logout `redirect` coming from a parameter → checked against an **allowlist of internal paths**.
- **Command injection**: no shell spawn in actions; if an external call is built from input, validate the components, don't concatenate.

### 12.4 The cross-cutting link: validators

The `v.*` (Convex) + Zod schemas (`packages/shared`) are the **common entry barrier**, not typing convenience. Every function arg, form field, and server-function payload goes through them **before** any logic. That is what makes the defense systematic rather than case-by-case.

### 12.5 Alpha auth & supply-chain

- The Convex + Better Auth component is in **alpha**: follow advisories, don't disable default flows (email verification, session expiry), keep auth isolated behind its stable API (cf. §7) to patch/swap quickly.
- **Supply-chain** (the `@tanstack/*` ecosystem suffered an attack of 84 malicious versions in May 2026): committed lockfile + `--frozen-lockfile` in CI, `pnpm audit` in CI, caution with `postinstall` scripts, pinned versions on critical deps.
