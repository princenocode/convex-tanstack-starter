import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@convex-tanstack-starter/ui';
import { AuthBoundary, SignInForm, useAuth } from '#/features/auth';
import { TasksPanel } from '#/features/tasks';
import { Landing } from '#/components/landing/Landing';

// The template showcase (stack, architecture, live demo). Thin route: it
// composes the `Landing` shell (a `shared` boundary) with the auth-gated demo
// and sign-out control injected as slots.
export const Route = createFileRoute('/docs')({ component: Docs });

function Docs() {
  const { isAuthenticated, signOut } = useAuth();
  return (
    <Landing
      authControl={
        isAuthenticated ? (
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            Sign out
          </Button>
        ) : null
      }
      demo={
        <AuthBoundary fallback={<SignInForm />}>
          <TasksPanel />
        </AuthBoundary>
      }
    />
  );
}
