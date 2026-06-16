import { useQuery } from '@tanstack/react-query';
import { convexQuery } from '@convex-dev/react-query';
import { api } from '@convex-tanstack-starter/backend/api';

// Reactive list of the current user's tasks. `convexQuery` keeps the result
// live and SSR-friendly via TanStack Query (§4: no fetch in JSX).
export function useTasks() {
  return useQuery(convexQuery(api.tasks.queries.list, {}));
}
