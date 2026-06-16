import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@convex-tanstack-starter/ui';
import { AuthBoundary, SignInForm, useAuth } from '#/features/auth';
import { TasksPanel } from '#/features/tasks';
import { AuthPage } from '#/components/auth-page/AuthPage';

// Routes are thin: they compose features and hold no business logic (§2). The
// auth shell lives in components/ (a `shared` boundary that can't import
// features), so the route injects the auth-gated pieces as slots: the sign-in
// form when signed out, the app once signed in.
export const Route = createFileRoute('/')({ component: Home });

function Home() {
  const { isAuthenticated, signOut } = useAuth();
  // SSR-known session state, so the boundary renders the right slot on the
  // first client paint instead of flashing a spinner (see AuthBoundary).
  const { token } = Route.useRouteContext();
  return (
    <AuthPage
      authControl={
        isAuthenticated ? (
          <Button variant="outline" size="sm" onClick={() => signOut()}>
            Sign out
          </Button>
        ) : null
      }
      card={
        <AuthBoundary fallback={<SignInForm />} initiallyAuthenticated={Boolean(token)}>
          <div className="island-shell rounded-2xl p-6 sm:p-8">
            <TasksPanel />
          </div>
        </AuthBoundary>
      }
    />
  );
}
