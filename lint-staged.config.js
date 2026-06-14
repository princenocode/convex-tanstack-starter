// pre-commit: fast, staged-only checks (docs/GUIDELINES.md §10).
// ESLint auto-fixes (warnings do not block the commit — CI enforces them);
// Prettier formats everything. The heavier typecheck/test/build run on pre-push.
export default {
  '*.{ts,tsx}': ['eslint --fix', 'prettier --write'],
  '*.{js,jsx,cjs,mjs,json,md,css,yaml,yml}': ['prettier --write'],
};
