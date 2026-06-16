import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { BrandMark, GitHubMark } from '#/components/landing/marks';
import { SiteFooter } from '#/components/landing/SiteFooter';
import { REPO_URL } from '#/components/landing/data';

// Presentational auth shell — the app's default entry point. Lives under
// components/ (a `shared` boundary), so it can't import features: the route
// injects the auth-gated `card` (sign-in form or the signed-in app) and the
// `authControl` (sign-out) as slots.
type AuthPageProps = {
  card: ReactNode;
  authControl?: ReactNode;
};

export function AuthPage({ card, authControl }: AuthPageProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <AuthHeader authControl={authControl} />
      <main className="page-wrap flex flex-1 flex-col items-center justify-center py-12">
        <div className="w-full max-w-md">{card}</div>
      </main>
      <SiteFooter />
    </div>
  );
}

function AuthHeader({ authControl }: { authControl?: ReactNode }) {
  return (
    <header
      className="sticky top-0 z-20 border-b backdrop-blur"
      style={{ background: 'var(--header-bg)', borderColor: 'var(--line)' }}
    >
      <div className="page-wrap flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2.5 no-underline"
          style={{ color: 'var(--sea-ink)' }}
        >
          <BrandMark className="h-7 w-7" />
          <span className="display-title text-lg font-bold tracking-tight">my-sample</span>
        </Link>

        <div className="flex items-center gap-3">
          {authControl}
          <Link
            to="/docs"
            className="chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Docs
          </Link>
          <a
            href={REPO_URL}
            aria-label="View my-sample on GitHub"
            target="_blank"
            rel="noreferrer"
            className="chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <GitHubMark className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
