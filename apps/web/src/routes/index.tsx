import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@my-sample/ui';
import { AuthBoundary, SignInForm, useAuth } from '#/features/auth';
import { TasksPanel } from '#/features/tasks';
import { Landing } from '#/components/landing/Landing';

// Routes are thin: they compose features and hold no business logic (§2). The
// landing layout lives in components/ (a `shared` boundary that can't import
// features), so the route injects the auth-gated pieces as slots.
export const Route = createFileRoute('/')({ component: Home });

function Home() {
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
