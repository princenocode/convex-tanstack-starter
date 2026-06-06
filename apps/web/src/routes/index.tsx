import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@my-sample/ui';
import { AuthBoundary, SignInForm, useAuth } from '#/features/auth';
import { TasksPanel } from '#/features/tasks';

// Routes are thin: they compose features and hold no business logic (§2).
export const Route = createFileRoute('/')({ component: Home });

function Home() {
  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 p-8">
      <Header />
      <AuthBoundary fallback={<SignInForm />}>
        <TasksPanel />
      </AuthBoundary>
    </main>
  );
}

function Header() {
  const { isAuthenticated, signOut } = useAuth();
  return (
    <header className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">My Sample</h1>
      {isAuthenticated && (
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          Sign out
        </Button>
      )}
    </header>
  );
}
