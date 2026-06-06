import { getAuthConfigProvider } from '@convex-dev/better-auth/auth-config';
import type { AuthConfig } from 'convex/server';

// Tells Convex to trust JWTs minted by Better Auth as an auth provider.
export default {
  providers: [getAuthConfigProvider()],
} satisfies AuthConfig;
