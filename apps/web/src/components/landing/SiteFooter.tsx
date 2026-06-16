// Template credit — safe to delete.
// To remove the author credit entirely: delete this file, drop the
// `<SiteFooter />` imports/usages (auth-page/AuthPage.tsx and landing/Landing.tsx),
// and remove the `author` block from data.ts.

import { SocialMark } from './marks';
import { author } from './data';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-wrap flex flex-col items-start justify-between gap-6 py-10 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <img
            src={author.avatar}
            alt={author.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full"
            style={{ border: '1px solid var(--line)' }}
          />
          <div className="flex flex-col">
            <span className="font-semibold" style={{ color: 'var(--sea-ink)' }}>
              Built by {author.name}
            </span>
            <span className="text-sm" style={{ color: 'var(--sea-ink-soft)' }}>
              {author.bio}
            </span>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          {author.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-label={link.label}
              title={link.label}
              className="chip flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              <SocialMark icon={link.icon} className="h-4 w-4" />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
