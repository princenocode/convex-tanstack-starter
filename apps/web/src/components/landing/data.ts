// Static content for the landing page. Kept as plain data so the presentational
// components stay declarative (and copy lives in one place).

export const REPO_URL = 'https://github.com/princenocode/convex-tanstack-starter';
export const PROFILE_URL = 'https://github.com/princenocode';

export type SocialIcon = 'github' | 'website' | 'x' | 'linkedin';

// Template credit — edit these to make the template yours, or delete the whole
// block together with <SiteFooter/> (see SiteFooter.tsx) to remove the credit.
export const author = {
  name: 'Prince NZANZU',
  handle: '@princenocode',
  bio: 'Product Architect | AI Agents, Automation & Software — your technical Swiss-army knife.',
  avatar: 'https://github.com/princenocode.png',
  links: [
    { icon: 'github', label: 'GitHub', href: PROFILE_URL },
    { icon: 'website', label: 'Website', href: 'https://princenocode.com' },
    { icon: 'x', label: 'X', href: 'https://x.com/princenocode' },
    {
      icon: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/prince-nzanzu-4262151b0/',
    },
  ] satisfies ReadonlyArray<{ icon: SocialIcon; label: string; href: string }>,
} as const;

// The one-command setup the hero terminal replays (mirrors `pnpm bootstrap`).
export const bootstrapLines = [
  { kind: 'cmd', text: 'pnpm bootstrap' },
  { kind: 'ok', text: 'dependencies installed' },
  { kind: 'ok', text: 'Convex deployment linked' },
  { kind: 'ok', text: 'secrets set · apps/web/.env.local written' },
  { kind: 'cmd', text: 'pnpm dev' },
  { kind: 'url', text: 'http://localhost:3000' },
] as const;

export type StackIcon = 'frontend' | 'backend' | 'auth' | 'shared' | 'tooling';

export type StackLayer = {
  icon: StackIcon;
  kicker: string;
  title: string;
  blurb: string;
  items: string[];
};

export const stack: StackLayer[] = [
  {
    icon: 'frontend',
    kicker: 'Frontend',
    title: 'TanStack Start',
    blurb: 'Type-safe routing and server functions, rendered with React and styled with Tailwind.',
    items: ['TanStack Start', 'TanStack Query', 'React 19', 'Tailwind v4', 'shadcn/ui'],
  },
  {
    icon: 'backend',
    kicker: 'Realtime backend',
    title: 'Convex',
    blurb:
      'Queries, mutations and actions on a reactive database — authorize first, validate every arg.',
    items: ['Convex', 'Reactive queries', 'Server actions'],
  },
  {
    icon: 'auth',
    kicker: 'Auth',
    title: 'Better Auth',
    blurb: 'Email + password sessions, isolated behind a single useAuth / requireUser interface.',
    items: ['@convex-dev/better-auth', 'requireUser', 'AuthBoundary'],
  },
  {
    icon: 'shared',
    kicker: 'Shared contract',
    title: 'Zod schemas',
    blurb: 'One schema, inferred on both sides — the client and Convex never disagree on a shape.',
    items: ['Zod', 'Inferred types', 'react-hook-form'],
  },
  {
    icon: 'tooling',
    kicker: 'Tooling',
    title: 'Turborepo',
    blurb:
      'pnpm workspaces, ESLint boundaries, Vitest and Prettier — the guard-rails ship wired up.',
    items: ['pnpm', 'Turborepo', 'ESLint boundaries', 'Vitest', 'Husky'],
  },
];
