import type { ReactNode } from 'react';
import { Spinner } from '@convex-tanstack-starter/ui';
import { useAuth } from '../hooks/useAuth';

type AuthBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  // Server-known auth state, derived from the SSR session token. When provided,
  // it picks the slot during the first client-side auth check instead of
  // flashing a spinner (useConvexAuth always starts `isLoading` after hydration).
  initiallyAuthenticated?: boolean;
};

// Renders `children` only when authenticated, otherwise `fallback` (§7).
export function AuthBoundary({ children, fallback, initiallyAuthenticated }: AuthBoundaryProps) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    // useConvexAuth has no opinion until the Convex client validates the token.
    // Trust the SSR-known state to avoid the card disappearing/reappearing.
    if (initiallyAuthenticated !== undefined) {
      return <>{initiallyAuthenticated ? children : fallback}</>;
    }
    return (
      <div className="flex justify-center p-8">
        <Spinner label="Checking your session" />
      </div>
    );
  }

  return <>{isAuthenticated ? children : fallback}</>;
}
