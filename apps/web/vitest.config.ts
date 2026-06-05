import { defineConfig } from 'vitest/config';
import viteReact from '@vitejs/plugin-react';

// Standalone test config so component tests run under jsdom without loading the
// full TanStack Start Vite plugin chain.
export default defineConfig({
  plugins: [viteReact()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
