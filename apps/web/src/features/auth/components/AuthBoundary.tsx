import type { ReactNode } from 'react';
import { Spinner } from '@my-sample/ui';
import { useAuth } from '../hooks/useAuth';

type AuthBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

// Renders `children` only when authenticated, otherwise `fallback` (§7).
export function AuthBoundary({ children, fallback }: AuthBoundaryProps) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner label="Checking your session" />
      </div>
    );
  }

  return <>{isAuthenticated ? children : fallback}</>;
}
