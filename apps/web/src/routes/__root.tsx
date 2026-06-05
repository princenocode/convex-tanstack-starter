import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import type { QueryClient } from '@tanstack/react-query';
import type { ConvexQueryClient } from '@convex-dev/react-query';
import TanStackQueryDevtools from '../integrations/tanstack-query/devtools';
import { getToken } from '../lib/auth-server';
import appCss from '../styles.css?url';

interface MyRouterContext {
  queryClient: QueryClient;
  convexQueryClient: ConvexQueryClient;
}

// Server-only: read the Better Auth session token so SSR'd Convex queries run
// authenticated. Runs in request scope, so it can read the session cookie.
const fetchAuthToken = createServerFn({ method: 'GET' }).handler(async () => getToken());

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async ({ context }) => {
    const token = await fetchAuthToken();
    if (token) {
      context.convexQueryClient.serverHttpClient?.setAuth(token);
    }
    return { token };
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'My Sample · TanStack Start + Convex' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{ position: 'bottom-right' }}
          plugins={[
            { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
