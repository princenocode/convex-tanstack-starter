import { createFileRoute } from '@tanstack/react-router';
import { handler } from '../../../lib/auth-server';

// Proxy every /api/auth/* request to the Better Auth handler, which forwards to
// Convex. Server-only route (no component).
export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => handler(request),
      POST: ({ request }) => handler(request),
    },
  },
});
