import { defineConfig } from 'vite';
import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  // Bundle these during SSR: the Better Auth component (ESM resolution), and the
  // workspace packages that ship TypeScript source (so Vite transpiles them).
  ssr: {
    noExternal: [
      '@convex-dev/better-auth',
      '@convex-tanstack-starter/ui',
      '@convex-tanstack-starter/shared',
    ],
  },
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
});

export default config;
