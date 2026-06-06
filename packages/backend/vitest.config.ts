import { defineConfig } from 'vitest/config';

// convex-test runs functions in a Convex-like runtime; the edge-runtime
// environment matches Convex's V8 isolate semantics most closely (§9).
export default defineConfig({
  test: {
    environment: 'edge-runtime',
    server: { deps: { inline: ['convex-test'] } },
  },
});
