import { convexBetterAuthReactStart } from '@convex-dev/better-auth/react-start';

// Server-side Better Auth utilities for TanStack Start.
//  - `handler` backs the /api/auth/$ proxy route.
//  - `getToken` reads the current session token for SSR'd Convex queries.
// These env vars are the PUBLIC Convex URLs (no secrets here, §12.2).
export const { handler, getToken, fetchAuthQuery, fetchAuthMutation, fetchAuthAction } =
  convexBetterAuthReactStart({
    convexUrl: process.env.VITE_CONVEX_URL!,
    convexSiteUrl: process.env.VITE_CONVEX_SITE_URL!,
    basePath: '/api/auth',
  });
