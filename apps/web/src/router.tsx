import type { ReactNode } from 'react';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react';
import { routeTree } from './routeTree.gen';
import { getContext } from './integrations/tanstack-query/root-provider';
import { authClient } from './lib/auth-client';

export function getRouter() {
  const context = getContext();

  const router = createTanStackRouter({
    routeTree,
    context,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    // Provide Convex + Better Auth to the whole tree. ConvexBetterAuthProvider
    // replaces the plain ConvexProvider and keeps the auth token refreshed.
    Wrap: ({ children }: { children: ReactNode }) => (
      <ConvexBetterAuthProvider
        client={context.convexQueryClient.convexClient}
        authClient={authClient}
      >
        {children}
      </ConvexBetterAuthProvider>
    ),
  });

  setupRouterSsrQueryIntegration({ router, queryClient: context.queryClient });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
