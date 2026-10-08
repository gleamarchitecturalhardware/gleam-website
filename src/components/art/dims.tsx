/* Drafting helpers used by the line drawings: dimension lines and centre lines. */

const DIM = 'var(--art-dim, #ED1C24)';
const common = {
  stroke: DIM,
  strokeWidth: 0.9,
  vectorEffect: 'non-scaling-stroke' as const,
  fill: 'none',
};

function Tick({ x, y }: { x: number; y: number }) {
  return <line x1={x - 4} y1={y + 4} x2={x + 4} y2={y - 4} {...common} strokeWidth={1.3} />;
}

function Label({ x, y, anchor = 'middle', children }: { x: number; y: number; anchor?: 'start' | 'middle' | 'end'; children: string }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fill={DIM} fontSize={13} fontWeight={600} className="art-dim-label">
      {children}
    </text>
  );
}

/**
 * Horizontal dimension. `from` gives the y position on the object for each
 * extension line, so they stop a little short of the drawing.
 */
export function HDim({ x1, x2, y, label, from, below = false }: { x1: number; x2: number; y: number; label: string; from?: [number, number]; below?: boolean }) {
  const ext = (x: number, fy: number) => {
    const dir = Math.sign(y - fy) || 1;
    return <line x1={x} y1={fy + dir * 3} x2={x} y2={y + dir * 6} {...common} strokeWidth={0.6} />;
  };
  return (
    <g>
      {from && ext(x1, from[0])}
      {from && ext(x2, from[1])}
      <line x1={x1 - 6} y1={y} x2={x2 + 6} y2={y} {...common} />
      <Tick x={x1} y={y} />
      <Tick x={x2} y={y} />
      <Label x={(x1 + x2) / 2} y={below ? y + 17 : y - 7}>
        {label}
      </Label>
    </g>
  );
}

export function VDim({ y1, y2, x, label, from, right = false }: { y1: number; y2: number; x: number; label: string; from?: [number, number]; right?: boolean }) {
  const ext = (y: number, fx: number) => {
    const dir = Math.sign(x - fx) || 1;
    return <line x1={fx + dir * 3} y1={y} x2={x + dir * 6} y2={y} {...common} strokeWidth={0.6} />;
  };
  return (
    <g>
      {from && ext(y1, from[0])}
      {from && ext(y2, from[1])}
      <line x1={x} y1={y1 - 6} x2={x} y2={y2 + 6} {...common} />
      <Tick x={x} y={y1} />
      <Tick x={x} y={y2} />
      <Label x={right ? x + 9 : x - 9} y={(y1 + y2) / 2 + 4.5} anchor={right ? 'start' : 'end'}>
        {label}
      </Label>
    </g>
  );
}

export function CL({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} {...common} strokeWidth={0.6} strokeDasharray="14 3 2 3" />;
}

/** Short caption inside a drawing, e.g. FRONT or SIDE. */
export function Caption({ x, y, children, anchor = 'middle' }: { x: number; y: number; children: string; anchor?: 'start' | 'middle' | 'end' }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={9.5} letterSpacing={1.6} fill="var(--art-ink-soft, #7a8089)" className="art-caption">
      {children}
    </text>
  );
}

/** Surface line with short hatch strokes on one side, for walls, floors and door faces. */
export function Surface({ x1, y1, x2, y2, side = 1 }: { x1: number; y1: number; x2: number; y2: number; side?: 1 | -1 }) {
  const vertical = x1 === x2;
  const len = vertical ? y2 - y1 : x2 - x1;
  const ticks = [];
  for (let d = 6; d < len; d += 10) {
    if (vertical) {
      const y = y1 + d;
      ticks.push(<line key={d} x1={x1} y1={y} x2={x1 - side * 7} y2={y + 7} vectorEffect="non-scaling-stroke" />);
    } else {
      const x = x1 + d;
      ticks.push(<line key={d} x1={x} y1={y1} x2={x - 7} y2={y1 + side * 7} vectorEffect="non-scaling-stroke" />);
    }
  }
  return (
    <g stroke="var(--art-ink, #1d2024)" strokeWidth={0.6} strokeOpacity={0.5} vectorEffect="non-scaling-stroke">
      <line x1={x1} y1={y1} x2={x2} y2={y2} strokeOpacity={1} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
      {ticks}
    </g>
  );
}
