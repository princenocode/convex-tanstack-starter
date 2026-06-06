# CONVENTIONS.md

> Référence unique pour tout projet basé sur ce template.
> Stack : TypeScript · React · **TanStack Start** (v1) · Vite · **Convex** (backend + DB temps réel)
> Auth : **Better Auth** (`@convex-dev/better-auth`) — Convex Auth en option/repli.
> Outils : pnpm workspaces + Turborepo · shadcn/ui · Zod · React Hook Form · Vitest · Playwright.

---

## 1. Principes fondateurs (appliqués, pas décoratifs)

| Principe  | Ce que ça veut dire ICI                                                                                         |
| --------- | --------------------------------------------------------------------------------------------------------------- |
| **KISS**  | La solution la plus directe qui marche. Pas d'indirection sans bénéfice mesurable.                              |
| **YAGNI** | On ne code pas pour un besoin hypothétique. Pas d'abstraction "au cas où".                                      |
| **DRY**   | On mutualise **après 3 usages réels** (règle de trois), jamais avant.                                           |
| **SOLID** | Surtout S (une responsabilité par module) et D (dépendre d'interfaces là où le swap est probable : ex. l'auth). |

### ⚠️ Tensions à arbitrer consciemment

- **DRY vs indépendance des features** : ne JAMAIS factoriser du code entre deux features juste parce qu'il se ressemble. Une duplication locale est préférable à un couplage. Le code partagé ne vit que dans `packages/shared` ou `packages/ui`, et seulement s'il est réellement générique (non métier).
- **SOLID vs YAGNI** : la seule abstraction imposée d'office est l'**API publique de feature** (`index.ts`). Tout le reste reste concret jusqu'à preuve d'un besoin.

---

## 2. Architecture

### Monorepo (pnpm + Turborepo)

```
apps/web/                  → app TanStack Start (frontend + server functions)
packages/backend/          → Convex (schema, functions, auth)
packages/ui/               → primitives shadcn partagées
packages/shared/           → schémas Zod + types partagés front ↔ back (source unique)
packages/config/           → presets eslint / tsconfig / prettier
```

### Feature-first (le cœur de l'architecture)

Une _feature_ = une tranche métier verticale et **autonome**. Front et back se **reflètent** :

```
apps/web/src/features/<feature>/
  components/      → composants spécifiques à la feature
  hooks/           → hooks React (incl. wrappers de queries Convex)
  api/             → appels Convex côté client (useQuery/useMutation typés)
  lib/             → utilitaires internes à la feature
  types.ts         → types locaux
  index.ts         → ★ API PUBLIQUE : seul point d'import autorisé depuis l'extérieur

packages/backend/convex/<feature>/
  queries.ts  mutations.ts  actions.ts  model.ts   → logique métier serveur
```

### Règles d'isolation (vérifiées par ESLint `boundaries`)

1. Une feature **ne peut importer une autre feature que via son `index.ts`** — jamais un fichier interne.
2. Les `routes/` sont **fines** : elles composent des features, ne contiennent aucune logique métier.
3. Le front **n'importe Convex que via l'API générée** (`_generated/api`) — jamais les helpers/`model.ts` internes du backend.
4. **Aucune logique backend dans le front** : validation métier, calculs d'autorité, écritures → toujours dans une function Convex.

---

## 3. Conventions de nommage

| Élément               | Convention                        | Exemple                      |
| --------------------- | --------------------------------- | ---------------------------- |
| Dossiers              | `kebab-case`                      | `user-profile/`              |
| Fichiers composant    | `PascalCase.tsx`                  | `UserCard.tsx`               |
| Fichiers hooks        | `camelCase.ts`, préfixe `use`     | `useUserSession.ts`          |
| Fichiers utils/lib    | `kebab-case.ts`                   | `format-date.ts`             |
| Composants React      | `PascalCase`                      | `function UserCard()`        |
| Hooks                 | `useXxx`                          | `useCart()`                  |
| Functions Convex      | `camelCase`, verbe d'intention    | `getUserById`, `createOrder` |
| Variables / fonctions | `camelCase`                       | `totalAmount`                |
| Types / interfaces    | `PascalCase` (pas de préfixe `I`) | `Order`, `CartItem`          |
| Constantes globales   | `SCREAMING_SNAKE_CASE`            | `MAX_RETRIES`                |
| Schémas Zod           | `xxxSchema`                       | `orderSchema`                |
| Booléens              | préfixe `is`/`has`/`can`          | `isLoading`, `hasAccess`     |

---

## 4. Construction des composants

- **Un composant par fichier**, exporté nommé (pas de `default` sauf contrainte du framework).
- **Présentation ≠ logique** : la donnée et la logique vivent dans des hooks (`useXxx`), le composant rend du JSX.
- **Props typées explicitement** via un `type XxxProps`. Pas de `any`.
- **Pas de fetch/mutation Convex directement dans le JSX** : passe par un hook de `api/` ou `hooks/`.
- Composant **pur et prévisible** : mêmes props → même rendu. Effets de bord dans `useEffect`/handlers uniquement.
- Accessibilité par défaut (`eslint-plugin-jsx-a11y`).
- Si un composant dépasse ~150 lignes ou mélange plusieurs responsabilités → le découper.

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

## 5. Construction des functions Convex

- **Choisir le bon type** :
  - `query` → lecture seule, réactive.
  - `mutation` → écriture transactionnelle.
  - `action` → effets externes (HTTP, emails, IA). Une action n'accède pas à la DB directement : elle appelle `runQuery`/`runMutation`.
- **Toujours valider les args avec `v` (convex/values)** + réutiliser les schémas Zod de `packages/shared` pour la validation métier.
- **Logique métier dans `model.ts`** (fonctions pures testables), pas dans le handler. Le handler orchestre.
- **Autorisation explicite** au début de chaque function (qui a le droit ?). Jamais côté client.
- Nommage par intention : `getOrderById`, `markOrderAsPaid`.

```ts
// convex/orders/mutations.ts
export const create = mutation({
  args: { items: v.array(v.object({ productId: v.id('products'), qty: v.number() })) },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx); // autorisation explicite
    const order = buildOrder(user._id, args.items); // logique pure → model.ts
    return ctx.db.insert('orders', order);
  },
});
```

---

## 6. Validation, env, état, erreurs, forms

- **Zod = source de vérité** des shapes partagés (`packages/shared`). Inférer les types depuis Zod (`z.infer`), ne pas les dupliquer.
- **Variables d'env validées au boot** via un `env.ts` typé Zod + `.env.example` tenu à jour. Les secrets de l'auth (BETTER_AUTH_SECRET, OAuth) vivent côté **Convex** (CLI/dashboard), pas dans `.env.local`.
- **Forms** : React Hook Form + `@hookform/resolvers/zod` + composants shadcn. Le schéma du form = le schéma Zod partagé.
- **État** : données serveur → `useQuery` Convex (réactif). État UI local → `useState`. État UI global → Zustand (seulement si réellement nécessaire — YAGNI).
- **Erreurs** : Error Boundaries par route + pattern de retour d'erreur typé côté Convex. Pas de `try/catch` qui avale silencieusement.

---

## 7. Auth (feature isolée et swappable)

- Toute l'auth vit dans `features/auth/` (front) + `convex/auth.ts` (back), derrière une **API publique stable** : `useAuth()`, `requireUser(ctx)`, `<AuthBoundary>`.
- Le reste du code **ne dépend que de cette interface**, jamais de Better Auth directement.
- Rationale : le composant Convex+Better Auth est en **alpha**. Cette isolation permet de basculer vers Convex Auth sans refactor en cascade.

---

## 8. Limite de taille des fichiers

- **Plafond strict : 500 lignes / fichier** (ESLint `max-lines`).
- **Cible souple : 200–250 lignes.** Au-delà, c'est un signal de responsabilité multiple → découper.
- Fonctions : `max-lines-per-function` (~80) + `complexity` raisonnable.
- _Le but n'est pas le compte de lignes mais la responsabilité unique ; la limite est un garde-fou, pas un objectif._

---

## 9. Tests

| Niveau    | Outil                          | Quoi                                     |
| --------- | ------------------------------ | ---------------------------------------- |
| Unitaire  | **Vitest**                     | logique pure (`model.ts`, `lib/`, hooks) |
| Composant | Vitest + React Testing Library | comportement UI                          |
| Backend   | **convex-test**                | queries/mutations/actions                |
| E2E       | **Playwright**                 | parcours critiques (auth, checkout…)     |

- Tout `model.ts` (logique métier pure) **doit** être testé.
- Le test vit à côté du fichier : `xxx.test.ts`.
- Seuils de coverage vérifiés en CI (pas en local pour rester rapide).

### 9.1 Méthodologie TDD (ciblée, pas dogmatique)

Le TDD est un **outil, pas une religion** — l'appliquer partout entre en tension avec YAGNI.

| Cas                                                                    | Approche                                                                | Pourquoi                                                                   |
| ---------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Logique pure (`model.ts`, `lib/`, règles métier, parsers, validateurs) | **TDD par défaut** : red → green → refactor                             | Comportement spécifiable d'avance ; meilleur design, régressions couvertes |
| Functions Convex (mutations/queries à logique non triviale)            | **TDD** via `convex-test`                                               | L'autorisation et les invariants se spécifient avant                       |
| Composants UI                                                          | Tester le **comportement après** (RTL)                                  | Le rendu émerge du design, le TDD y est peu rentable                       |
| Spikes / exploration                                                   | **Pas de test pendant** ; consolider en tests une fois le design stable | Forcer des tests sur du jetable = gaspillage                               |
| Glue / config                                                          | Pas de TDD                                                              | Peu de logique à spécifier                                                 |

- **Cycle** : écrire un test qui échoue (red) → code minimal qui passe (green) → refactor à vert.
- **Avec Claude Code** : écrire le test d'abord donne à l'agent une **spec exécutable** + une boucle de vérification — il sait quand il a terminé et ne dérive pas. À privilégier pour toute logique pure confiée à l'IA.

---

## 10. Git & qualité (qui tourne, et quand)

**Conventional Commits** obligatoires (`feat:`, `fix:`, `chore:`…) — vérifiés par **commitlint**.

| Étape        | Outil                   | Action                                                      | Pourquoi là               |
| ------------ | ----------------------- | ----------------------------------------------------------- | ------------------------- |
| `pre-commit` | husky + **lint-staged** | prettier + eslint **sur les fichiers staged**               | rapide, ne bloque pas     |
| `commit-msg` | commitlint              | format du message                                           | norme d'historique        |
| `pre-push`   | husky                   | `typecheck` + `test` + `build`                              | filet local avant partage |
| CI (PR)      | GitHub Actions          | lint + typecheck + test + build + `gitleaks` + `pnpm audit` | **le vrai garde-fou**     |

> Husky est **local** et contournable (`--no-verify`). La CI GitHub Actions est la seule barrière réelle : c'est là que vivent `pnpm audit` et le scan de secrets (trop lents/critiques pour le commit).

---

## 11. Checklist d'une nouvelle feature

1. Créer `features/<feature>/` (front) **et** `convex/<feature>/` (back) en miroir.
2. Définir les schémas Zod dans `packages/shared`.
3. Logique métier serveur dans `model.ts` (pur) + handlers Convex minces.
4. Exposer une **API publique** via `index.ts`.
5. Routes fines qui composent la feature.
6. Tests : `model.ts` + parcours critique.
7. Vérifier : aucun import croisé de feature, aucune logique backend dans le front, fichiers < 500 lignes.

---

## 12. Sécurité

> Principe directeur : **ne jamais faire confiance au client.** Valider à la frontière, encoder à la sortie, jamais de requête/commande construite par concaténation de chaînes. Le front ne _protège_ rien — il ne fait qu'appeler.

### 12.1 Modèle d'autorisation Convex (la vraie frontière)

- Une `query`/`mutation`/`action` **publique est un endpoint appelable par n'importe qui** connaissant l'URL du déploiement, hors de ton front. La sécurité se joue ici, pas dans l'UI.
- **Autorisation explicite en première ligne** de chaque function : qui est l'utilisateur, et a-t-il le droit sur _cette_ ressource précise (pas juste « est connecté »).
- Convex n'a **pas de row-level security** : rien n'empêche techniquement de lire la table d'un autre user, sauf le check que tu écris. L'authz par ressource est non négociable.
- Tout ce qui ne doit pas être appelé depuis le client → `internalQuery` / `internalMutation` / `internalAction`. Footgun n°1 : exposer en `public` ce qui aurait dû être `internal`. Une action orchestre des functions _internal_, jamais l'inverse.

### 12.2 Variables d'env & secrets

- Tout préfixe **`VITE_` est embarqué dans le bundle client = PUBLIC.** Jamais de secret dedans.
- Secrets (`BETTER_AUTH_SECRET`, secrets OAuth, clés d'API tierces) → **côté Convex** (CLI/dashboard), touchés uniquement dans des actions/server functions.
- `env.ts` validé par Zod au boot + `.env.example` tenu à jour. `gitleaks` en CI pour l'oubli accidentel dans le repo.

### 12.3 Anti-injection (par classe)

- **SQL / NoSQL** : inexistant côté Convex (API structurée `ctx.db.query(...).withIndex(...)`, pas de SQL brut). ⚠️ **Supabase/Postgres** (autres projets) : requêtes paramétrées / query builder uniquement, jamais de SQL concaténé.
- **XSS (vecteur réel, front)** : React échappe par défaut. Donc :
  - `dangerouslySetInnerHTML` **proscrit par défaut** ; si HTML/markdown user nécessaire → **DOMPurify** obligatoire (règle ESLint `react/no-danger`).
  - **URLs user dans `href`/`src`** : valider le schéma (allowlist `https`/`http`/`mailto`) — un `javascript:` reste exécutable sinon.
  - **SSR TanStack Start** : tout contenu user injecté dans le `<head>`/document côté serveur doit être échappé.
- **Injection de prompt (IA)** : traiter toute **sortie de LLM comme un input non fiable**. Jamais d'action privilégiée (mutation, email, appel API) déclenchée par une sortie LLM sans re-validation Zod côté code.
- **Open redirect (flux Better Auth)** : le `redirect` post-login/logout issu d'un paramètre → vérifié contre une **allowlist de chemins internes**.
- **Command injection** : pas de spawn de shell dans les actions ; si un appel externe est construit depuis de l'input, valider les composants, ne pas concaténer.

### 12.4 Le maillon transversal : les validateurs

Les `v.*` (Convex) + schémas Zod (`packages/shared`) sont la **barrière d'entrée commune**, pas du confort de typage. Tout arg de function, champ de form et payload de server function passe par là **avant** toute logique. C'est ce qui rend la défense systématique plutôt qu'au cas par cas.

### 12.5 Auth en alpha & supply-chain

- Le composant Convex + Better Auth est en **alpha** : suivre les advisories, ne pas désactiver les flux par défaut (vérif email, expiration session), garder l'auth isolée derrière son API stable (cf. §7) pour patcher/swapper vite.
- **Supply-chain** (l'écosystème `@tanstack/*` a subi une attaque de 84 versions malveillantes en mai 2026) : lockfile commité + `--frozen-lockfile` en CI, `pnpm audit` en CI, prudence sur les scripts `postinstall`, versions épinglées sur les deps critiques.

---

## 13. Roadmap de construction du template (ordre de dépendance)

> À construire avec Claude Code, dans cet ordre.

1. **Skill `karpathy-guidelines`** — `.cursor/rules/karpathy.mdc` + `CLAUDE.md` / `AGENTS.md` qui encode la philosophie (KISS/YAGNI, _no premature abstraction_, fonctions courtes nommées, supprimer > ajouter) pour que l'IA respecte ces conventions automatiquement.
2. **Config ESLint partagée** (`packages/config/eslint`) qui _applique_ concrètement les règles : `max-lines`, `boundaries`, `import/no-restricted-paths`, `jsx-a11y`.
3. **Setup husky + lint-staged + commitlint** : fichiers `.husky/`, `lint-staged.config.js`, `commitlint.config.js`.
4. **Workflow GitHub Actions** : lint / typecheck / test / build + `gitleaks` + `pnpm audit`.
5. **Scaffold réel** : `package.json` racine + workspaces, `turbo.json`, `tsconfig` de base.
