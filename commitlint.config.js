// Conventional Commits enforcement (docs/GUIDELINES.md §10).
/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allow long lines in commit bodies (e.g. detailed bullet points).
    'body-max-line-length': [0],
  },
};
