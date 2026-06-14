import type { ReactNode } from 'react';
import type { StackIcon } from './data';

// Minimalist, single-stroke SVGs drawn to one grid (24×24, 1.6 stroke, round
// caps) so the icon set reads as one family. Color follows `currentColor`.

type GlyphProps = { className?: string };

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// Brand mark: stacked, offset slices (the "vertical slice" architecture) with a
// lagoon node — a layered island seen from the side.
export function BrandMark({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="25" height="25" rx="8" stroke="currentColor" strokeWidth="1.7" />
      <path d="M9 12.5h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path
        d="M9 17.5h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M9 22.5h8.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        opacity="0.32"
      />
      <circle cx="22.5" cy="22.5" r="2.4" fill="var(--lagoon-deep)" />
    </svg>
  );
}

export function GitHubMark({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49v-1.7c-2.78.62-3.37-1.22-3.37-1.22-.46-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.82c0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"
      />
    </svg>
  );
}

function FrontendGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.4" {...stroke} />
      <path d="M3 9.2h18" {...stroke} />
      <circle cx="6" cy="7.1" r="0.7" fill="currentColor" />
      <circle cx="8.4" cy="7.1" r="0.7" fill="currentColor" />
    </svg>
  );
}

function BackendGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12" cy="6" rx="7" ry="3" {...stroke} />
      <path d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6" {...stroke} />
      <path d="M5 12c0 1.66 3.13 3 7 3s7-1.34 7-3" {...stroke} />
    </svg>
  );
}

function AuthGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z" {...stroke} />
      <path d="M9 12l2.2 2.2L15 10.4" {...stroke} />
    </svg>
  );
}

function SharedGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9.5 4c-2 0-3 1-3 3v2.2c0 1.1-.7 2-2 2 1.3 0 2 .9 2 2V17c0 2 1 3 3 3" {...stroke} />
      <path d="M14.5 4c2 0 3 1 3 3v2.2c0 1.1.7 2 2 2-1.3 0-2 .9-2 2V17c0 2-1 3-3 3" {...stroke} />
    </svg>
  );
}

function ToolingGlyph({ className }: GlyphProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" {...stroke} />
      <path
        d="M12 3.2v2.6M12 18.2v2.6M20.8 12h-2.6M5.8 12H3.2M18.2 5.8l-1.8 1.8M7.6 16.4l-1.8 1.8M18.2 18.2l-1.8-1.8M7.6 7.6 5.8 5.8"
        {...stroke}
      />
    </svg>
  );
}

export const stackIcons: Record<StackIcon, (props: GlyphProps) => ReactNode> = {
  frontend: FrontendGlyph,
  backend: BackendGlyph,
  auth: AuthGlyph,
  shared: SharedGlyph,
  tooling: ToolingGlyph,
};
