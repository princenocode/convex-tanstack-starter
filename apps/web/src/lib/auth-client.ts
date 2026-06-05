import { createAuthClient } from 'better-auth/react';
import { convexClient } from '@convex-dev/better-auth/client/plugins';

// Browser-side Better Auth client. It targets the app's own /api/auth/* proxy
// route, which forwards to Convex. This is the only place that talks to Better
// Auth directly; feature code goes through the `features/auth` public API (§7).
export const authClient = createAuthClient({
  plugins: [convexClient()],
});
