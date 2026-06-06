// Single flat ESLint config for the whole monorepo (KISS — one source of truth,
// editor-friendly, and works with lint-staged from the repo root).
//   - apps/web      → React preset + feature-isolation boundaries (§2)
//   - packages/**   → TypeScript base preset
import { base, react, featureBoundaries, ignores } from '@my-sample/eslint-config';

export default [
  ignores,

  // React app: browser globals, hooks, a11y, no-danger, feature boundaries.
  ...react.map((config) => ({ ...config, files: ['apps/web/**/*.{ts,tsx}'] })),
  featureBoundaries({ appDir: 'apps/web' }),

  // Backend + shared/ui/config packages: TypeScript base only.
  ...base.map((config) => ({
    ...config,
    files: ['packages/**/*.{ts,tsx}'],
  })),
];
