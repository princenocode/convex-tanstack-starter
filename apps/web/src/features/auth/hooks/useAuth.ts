import { useConvexAuth } from 'convex/react';
import { authClient } from '#/lib/auth-client';

export type SignInInput = { email: string; password: string };
export type SignUpInput = { email: string; password: string; name: string };

/**
 * The stable auth interface the rest of the app depends on (§7). Nothing
 * outside this feature touches Better Auth directly, so the provider can be
 * swapped without a refactor cascade.
 */
export function useAuth() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  return {
    isLoading,
    isAuthenticated,
    signIn: ({ email, password }: SignInInput) => authClient.signIn.email({ email, password }),
    signUp: ({ email, password, name }: SignUpInput) =>
      authClient.signUp.email({ email, password, name }),
    signOut: () => authClient.signOut(),
  };
}
