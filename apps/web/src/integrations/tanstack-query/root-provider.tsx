import { QueryClient } from '@tanstack/react-query';
import { ConvexQueryClient } from '@convex-dev/react-query';

const CONVEX_URL = import.meta.env.VITE_CONVEX_URL as string | undefined;

// Builds the per-request client context: a TanStack QueryClient wired to a
// ConvexQueryClient so `convexQuery()` results are reactive and SSR-friendly.
export function getContext() {
  if (!CONVEX_URL) {
    throw new Error(
      'Missing VITE_CONVEX_URL. Run `npx convex dev` in packages/backend and set it in .env.local.',
    );
  }

  // expectAuth defers authenticated queries until the Better Auth token is set
  // (see beforeLoad in __root.tsx). On sign-out a reload re-establishes state.
  const convexQueryClient = new ConvexQueryClient(CONVEX_URL, { expectAuth: true });

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  });
  convexQueryClient.connect(queryClient);

  return { queryClient, convexQueryClient };
}
