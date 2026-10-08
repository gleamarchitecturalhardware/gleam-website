import { finishes } from '@/data/finishes';

type Stop = [number, string, number?];

function Linear({ id, stops, x2 = 0, y2 = 1, x1 = 0, y1 = 0 }: { id: string; stops: Stop[]; x1?: number; y1?: number; x2?: number; y2?: number }) {
  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
      {stops.map(([o, c, a], i) => (
        <stop key={i} offset={o} stopColor={c} stopOpacity={a ?? 1} />
      ))}
    </linearGradient>
  );
}

/**
 * Shared gradients, patterns and filters for every product drawing on the page.
 * Rendered once in the root layout so each drawing only references ids.
 */
export function SvgDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        {finishes.map((f) => {
          const [hi, light, mid, dark, deep] = f.tones;
          const chrome = f.code === 'CP';
          const cyl: Stop[] = chrome
            ? [[0, dark], [0.08, light], [0.2, hi], [0.3, hi], [0.4, mid], [0.56, deep], [0.76, dark], [0.9, light], [1, mid]]
            : [[0, mid], [0.1, light], [0.27, hi], [0.44, light], [0.68, dark], [0.88, deep], [1, dark]];
          const bar: Stop[] = [[0, hi], [0.14, hi], [0.14, light], [0.55, mid], [0.86, mid], [0.86, dark], [1, deep]];
          const id = (t: string) => `g-${f.code}-${t}`;
          return (
            <g key={f.code}>
              <Linear id={id('cyl')} stops={cyl} />
              <Linear id={id('cylv')} stops={cyl} x2={1} y2={0} />
              <Linear id={id('bar')} stops={bar} />
              <Linear id={id('barv')} stops={bar} x2={1} y2={0} />
              <Linear id={id('face')} stops={[[0, hi], [0.55, light], [1, mid]]} x2={1} y2={1} />
              <Linear id={id('side')} stops={[[0, mid], [1, dark]]} x2={1} y2={1} />
              <radialGradient id={id('disc')} cx="0.38" cy="0.32" r="0.8">
                <stop offset="0" stopColor={hi} />
                <stop offset="0.5" stopColor={light} />
                <stop offset="1" stopColor={dark} />
              </radialGradient>
              <Linear id={id('ring')} stops={[[0, hi], [0.45, mid], [1, deep]]} x1={0.15} y1={0} x2={0.85} y2={1} />
              <Linear id={id('ringIn')} stops={[[0, dark], [0.55, mid], [1, hi]]} x1={0.15} y1={0} x2={0.85} y2={1} />
            </g>
          );
        })}

        <Linear id="g-glass" x2={1} y2={1} stops={[[0, '#33373d'], [0.38, '#191b1f'], [0.381, '#24272b'], [1, '#0d0e10']]} />
        <Linear id="g-glassDark" x2={1} y2={1} stops={[[0, '#2a2d31'], [1, '#0b0c0e']]} />
        <Linear id="g-rubber" stops={[[0, '#45474b'], [0.35, '#26282b'], [1, '#121315']]} />
        <Linear id="g-case" x2={1} y2={1} stops={[[0, '#eef0ee'], [0.6, '#d6d9d7'], [1, '#bfc3c2']]} />
        <Linear id="g-caseRing" x1={0.15} x2={0.85} y2={1} stops={[[0, '#f6f7f6'], [0.5, '#bfc3c2'], [1, '#8d9291']]} />
        <Linear id="g-tint" x2={1} y2={1} stops={[[0, '#cfe6ea', 0.75], [0.5, '#bcdbe0', 0.5], [1, '#a9cfd6', 0.65]]} />
        <Linear id="g-key" stops={[[0, '#c9c3ae'], [0.25, '#f3eedd'], [0.6, '#bdb59a'], [1, '#8a826a']]} />
        <radialGradient id="g-lens" cx="0.42" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#6f8c99" />
          <stop offset="0.45" stopColor="#24343c" />
          <stop offset="1" stopColor="#0a0e11" />
        </radialGradient>

        <pattern id="p-knurl" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V5M0 0H5" stroke="rgba(0,0,0,0.3)" strokeWidth="1.1" />
        </pattern>
        <pattern id="p-knurl-line" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V6M0 0H6" stroke="var(--art-ink, #1d2024)" strokeWidth="0.5" />
        </pattern>
        <pattern id="p-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V7" stroke="var(--art-ink, #1d2024)" strokeWidth="0.6" strokeOpacity="0.55" />
        </pattern>

        <filter id="f-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
    </svg>
  );
}
