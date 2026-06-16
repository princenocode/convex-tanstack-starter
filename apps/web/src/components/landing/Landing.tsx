import type { ReactNode } from 'react';
import { Link } from '@tanstack/react-router';
import { ArchitectureDiagram } from './architecture';
import { BrandMark, GitHubMark, stackIcons } from './marks';
import { SiteFooter } from './SiteFooter';
import { REPO_URL, bootstrapLines, stack } from './data';

// Presentational landing page. Lives under components/ (a `shared` boundary), so
// it never imports features directly — the route injects the auth-gated `demo`
// and the `authControl` (sign-out) as slots.
type LandingProps = {
  demo: ReactNode;
  authControl?: ReactNode;
};

export function Landing({ demo, authControl }: LandingProps) {
  return (
    <>
      <SiteHeader authControl={authControl} />
      <main className="page-wrap flex flex-col gap-24 pb-24 pt-12 sm:pt-16">
        <Hero />
        <StackSection />
        <ArchitectureSection />
        <DemoSection demo={demo} />
      </main>
      <SiteFooter />
    </>
  );
}

function SiteHeader({ authControl }: { authControl?: ReactNode }) {
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
          <span className="display-title text-lg font-bold tracking-tight">
            convex-tanstack-starter
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {authControl}
          <Chip href={REPO_URL} ariaLabel="View convex-tanstack-starter on GitHub">
            <GitHubMark className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Chip>
          <Link
            to="/"
            className="btn-primary inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            Open the app
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="rise-in grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="flex flex-col gap-6">
        <span className="island-kicker">Full-stack starter · TanStack Start + Convex</span>
        <h1
          className="display-title text-4xl leading-[1.05] font-bold sm:text-5xl"
          style={{ color: 'var(--sea-ink)' }}
        >
          Type-safe from
          <br />
          clone to ship.
        </h1>
        <p className="max-w-md text-lg" style={{ color: 'var(--sea-ink-soft)' }}>
          A feature-first TanStack Start + Convex template — authorized by default, with the whole
          quality guard-rail layer already wired up. One command from clone to a running app.
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <PrimaryLink href={REPO_URL}>
            <GitHubMark className="h-4 w-4" />
            View on GitHub
          </PrimaryLink>
          <Chip href="#stack">Explore the stack</Chip>
        </div>
      </div>
      <Terminal />
    </section>
  );
}

// Replays the `pnpm bootstrap` sequence — the most characteristic artifact of
// this template's world is its command line.
function Terminal() {
  return (
    <div className="island-shell rounded-2xl p-1.5">
      <div
        className="rounded-[12px] p-5 font-mono text-[13px] leading-relaxed"
        style={{ background: '#10242a' }}
      >
        <div className="mb-4 flex gap-1.5">
          <Dot color="#f0a8a0" />
          <Dot color="#f1d59a" />
          <Dot color="#7ed3bf" />
        </div>
        <div className="flex flex-col gap-1.5">
          {bootstrapLines.map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              {l.kind === 'cmd' && <span style={{ color: '#7ed3bf' }}>$</span>}
              {l.kind === 'ok' && <span style={{ color: '#86e0bf' }}>✓</span>}
              {l.kind === 'url' && <span style={{ color: '#5a6f72' }}>→</span>}
              <span
                style={{
                  color: l.kind === 'cmd' ? '#eef7f4' : l.kind === 'url' ? '#8de5db' : '#a9c4c2',
                }}
              >
                {l.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StackSection() {
  return (
    <section id="stack" className="flex flex-col gap-8">
      <SectionHeading kicker="The stack" title="Five layers, one source of truth">
        Every layer is isolated behind a public interface and validated at its edge — pick the slice
        you’re working in without learning the whole tree.
      </SectionHeading>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stack.map((layer) => {
          const Icon = stackIcons[layer.icon];
          return (
            <article
              key={layer.title}
              className="feature-card island-shell flex flex-col gap-3 rounded-2xl p-6"
            >
              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={{
                  background: 'var(--chip-bg)',
                  border: '1px solid var(--chip-line)',
                  color: 'var(--lagoon-deep)',
                }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="island-kicker">{layer.kicker}</span>
                <h3 className="display-title text-xl font-bold" style={{ color: 'var(--sea-ink)' }}>
                  {layer.title}
                </h3>
              </div>
              <p className="text-sm" style={{ color: 'var(--sea-ink-soft)' }}>
                {layer.blurb}
              </p>
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {layer.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{
                      background: 'var(--chip-bg)',
                      border: '1px solid var(--chip-line)',
                      color: 'var(--sea-ink-soft)',
                    }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ArchitectureSection() {
  return (
    <section id="architecture" className="flex flex-col gap-8">
      <SectionHeading kicker="Architecture" title="Vertical slices, type-safe end to end">
        The frontend reaches Convex only through its generated API; both sides infer their shapes
        from one shared Zod schema, and no backend call runs without authorization.
      </SectionHeading>
      <div className="island-shell rounded-2xl p-6 sm:p-10">
        <ArchitectureDiagram className="mx-auto h-auto w-full max-w-3xl" />
      </div>
    </section>
  );
}

function DemoSection({ demo }: { demo: ReactNode }) {
  return (
    <section id="demo" className="flex flex-col gap-8">
      <SectionHeading kicker="Live demo" title="The whole stack, end to end">
        Sign in, then add and toggle tasks — a shared Zod schema, an authorized Convex mutation, and
        a reactive query, working together.
      </SectionHeading>
      <div className="island-shell mx-auto w-full max-w-xl rounded-2xl p-6 sm:p-8">{demo}</div>
    </section>
  );
}

// --- small shared atoms -----------------------------------------------------

function SectionHeading({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex max-w-2xl flex-col gap-3">
      <span className="island-kicker">{kicker}</span>
      <h2 className="display-title text-3xl font-bold" style={{ color: 'var(--sea-ink)' }}>
        {title}
      </h2>
      <p className="text-base" style={{ color: 'var(--sea-ink-soft)' }}>
        {children}
      </p>
    </div>
  );
}

function PrimaryLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {children}
    </a>
  );
}

function Chip({
  href,
  children,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      target={href.startsWith('#') ? undefined : '_blank'}
      rel={href.startsWith('#') ? undefined : 'noreferrer'}
      className="chip inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
    >
      {children}
    </a>
  );
}

function Dot({ color }: { color: string }) {
  return <span className="h-3 w-3 rounded-full" style={{ background: color }} />;
}
