// Signature element: the vertical-slice data flow drawn by hand as one SVG.
// It encodes what the template actually is — the client and Convex backend talk
// over a type-safe generated API, both deriving their shapes from one shared Zod
// contract, with Better Auth guarding every backend call.

const ink = 'var(--sea-ink)';
const inkSoft = 'var(--sea-ink-soft)';
const line = 'var(--line)';
const lagoon = 'var(--lagoon-deep)';
const palm = 'var(--kicker)';

function Node({
  x,
  y,
  kicker,
  path,
  sub,
}: {
  x: number;
  y: number;
  kicker: string;
  path: string;
  sub: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={250}
        height={92}
        rx={16}
        fill="var(--surface-strong)"
        stroke={line}
        strokeWidth={1.4}
      />
      <text x={x + 22} y={y + 28} fontSize={11} letterSpacing={1.6} fontWeight={700} fill={palm}>
        {kicker.toUpperCase()}
      </text>
      <text
        x={x + 22}
        y={y + 52}
        fontSize={17}
        fontWeight={700}
        fill={ink}
        fontFamily="'Fraunces', Georgia, serif"
      >
        {path}
      </text>
      <text x={x + 22} y={y + 72} fontSize={12.5} fill={inkSoft}>
        {sub}
      </text>
    </g>
  );
}

// Hairline links: the shared contract feeds both sides (dashed), and the client
// and backend exchange a type-safe API (the animated lagoon connector).
function Connectors() {
  return (
    <>
      <path
        d="M392 222 C 392 180, 196 176, 165 142"
        fill="none"
        stroke={line}
        strokeWidth={1.4}
        strokeDasharray="2 5"
      />
      <path
        d="M392 222 C 392 180, 588 176, 619 142"
        fill="none"
        stroke={line}
        strokeWidth={1.4}
        strokeDasharray="2 5"
      />
      <path
        className="flow-line"
        d="M298 96 H 462"
        fill="none"
        stroke={lagoon}
        strokeWidth={2}
        markerStart="url(#arrow)"
        markerEnd="url(#arrow)"
      />
      <text x={380} y={84} fontSize={11.5} fontWeight={600} fill={inkSoft} textAnchor="middle">
        Convex API · type-safe
      </text>
    </>
  );
}

// The authorization guard pinned to the backend node.
function AuthChip() {
  return (
    <g>
      <rect
        x={566}
        y={26}
        width="118"
        height="26"
        rx="13"
        fill="var(--chip-bg)"
        stroke="var(--chip-line)"
        strokeWidth={1.2}
      />
      <path
        d="M581 39.2v-2.4a3 3 0 0 1 6 0v2.4"
        fill="none"
        stroke={lagoon}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <rect
        x={579.5}
        y={39}
        width="9"
        height="7"
        rx="1.6"
        fill="none"
        stroke={lagoon}
        strokeWidth={1.4}
      />
      <text x={596} y={43} fontSize={11.5} fontWeight={600} fill={ink}>
        requireUser
      </text>
    </g>
  );
}

export function ArchitectureDiagram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 760 340"
      role="img"
      aria-label="apps/web and the Convex backend exchange a type-safe API; both derive their types from one shared Zod contract, with Better Auth guarding the backend."
    >
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10z" fill={lagoon} />
        </marker>
      </defs>

      <Connectors />
      <Node x={48} y={50} kicker="Frontend" path="apps/web" sub="TanStack Start · features" />
      <Node
        x={462}
        y={50}
        kicker="Realtime backend"
        path="packages/backend"
        sub="Convex functions"
      />
      <Node
        x={267}
        y={222}
        kicker="Shared contract"
        path="packages/shared"
        sub="Zod schemas + inferred types"
      />
      <AuthChip />
    </svg>
  );
}
