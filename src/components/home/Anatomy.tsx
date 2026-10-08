import { makePaint } from '../art/paint';
import { CL, Caption } from '../art/dims';

const INK = 'var(--art-ink, #1d2024)';
const RED = 'var(--red, #ed1c24)';

function Balloon({ n, x, y, tx, ty }: { n: number; x: number; y: number; tx: number; ty: number }) {
  const dx = tx - x;
  const dy = ty - y;
  const len = Math.hypot(dx, dy);
  const sx = x + (dx / len) * 14;
  const sy = y + (dy / len) * 14;
  return (
    <g>
      <line x1={sx} y1={sy} x2={tx} y2={ty} stroke={RED} strokeWidth={0.9} vectorEffect="non-scaling-stroke" />
      <circle cx={tx} cy={ty} r={2.6} fill={RED} />
      <circle cx={x} cy={y} r={14} fill="#fff" stroke={RED} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
      <text x={x} y={y + 5} textAnchor="middle" fontSize={14} fontWeight={600} fill={RED}>
        {n}
      </text>
    </g>
  );
}

/** Exploded plan view of a lever set through a door, with numbered parts. */
export function AnatomyDrawing() {
  const p = makePaint('SS', 'render');
  const ax = 230;
  return (
    <svg viewBox="250 0 600 400" className="anatomy" role="img" aria-label="Exploded drawing of a Gleam lever set fitted through a door, with six numbered parts">
      {/* Door section, seen from above */}
      <rect x={521.5} y={36} width={57} height={252.5} fill="#fff" stroke={INK} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
      <rect x={521.5} y={36} width={57} height={252.5} fill="url(#p-hatch)" />
      <Caption x={550} y={26}>
        DOOR
      </Caption>

      <CL x1={300} y1={ax} x2={800} y2={ax} />

      {/* Spindle */}
      <rect x={392} y={ax - 6} width={316} height={12} rx={1} {...p('bar')} />

      {/* Lock body inside the door */}
      <rect x={540} y={168} width={20} height={120.5} {...p('case')} />
      <circle cx={550} cy={ax} r={9} {...p('caseRing')} />
      <rect x={545.5} y={ax - 4.5} width={9} height={9} {...p('hole')} />
      <rect x={535} y={288.5} width={30} height={5} {...p('barv')} />
      <path d="M543,293.5 H557 V303 L551,311 H543 Z" {...p('barv')} />
      <Caption x={550} y={334}>
        LOCK EDGE
      </Caption>

      {/* Spring cassettes and roses */}
      <rect x={487} y={208} width={20} height={44} rx={2} {...p('case')} />
      <rect x={593} y={208} width={20} height={44} rx={2} {...p('case')} />
      <rect x={455} y={196} width={10} height={68} rx={2} {...p('cylv')} />
      <rect x={635} y={196} width={10} height={68} rx={2} {...p('cylv')} />

      {/* Through bolts */}
      {[208.5, 251.5].map((y) => (
        <g key={y}>
          <rect x={652} y={y - 2.5} width={58} height={5} {...p('cyl')} />
          <rect x={708} y={y - 5} width={7} height={10} rx={1.5} {...p('barv')} />
        </g>
      ))}

      {/* Levers: neck into the rose, grip running parallel to the door */}
      <rect x={355} y={ax - 11} width={80} height={22} {...p('cyl')} />
      <rect x={341} y={52} width={26} height={ax + 11 - 52} rx={13} {...p('cylv')} />
      <rect x={665} y={ax - 11} width={80} height={22} {...p('cyl')} />
      <rect x={733} y={52} width={26} height={ax + 11 - 52} rx={13} {...p('cylv')} />

      <Caption x={354} y={300}>
        OUTSIDE
      </Caption>
      <Caption x={746} y={300}>
        INSIDE
      </Caption>

      <Balloon n={1} x={300} y={96} tx={341} ty={118} />
      <Balloon n={2} x={432} y={150} tx={459} ty={198} />
      <Balloon n={3} x={492} y={150} tx={497} ty={209} />
      <Balloon n={4} x={420} y={318} tx={444} ty={ax + 5} />
      <Balloon n={5} x={640} y={330} tx={561} ty={284} />
      <Balloon n={6} x={690} y={150} tx={684} ty={206} />
    </svg>
  );
}
