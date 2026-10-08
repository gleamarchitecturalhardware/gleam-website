import type { ReactElement } from 'react';
import type { ArtSpec, LeverShape } from '@/data/types';
import type { FinishCode } from '@/data/finishes';
import type { Mode, Paint } from './paint';
import { CL, Caption, HDim, Surface, VDim } from './dims';

/*
 * Orthographic product drawings on a 400 × 400 grid.
 * Each drawing renders in three modes: `render` (finished metal),
 * `line` (technical drawing with dimensions) and `shadow` (silhouette).
 */

type Kind = ArtSpec['kind'];
export type KindProps<K extends Kind> = {
  spec: Extract<ArtSpec, { kind: K }>;
  p: Paint;
  mode: Mode;
  finish: FinishCode;
  l: (key: string) => string;
};

const INK = 'var(--art-ink, #1d2024)';
const DARK_FINISHES: FinishCode[] = ['MB', 'GM', 'AB'];

/** Outline of a bar that follows a centre line, with rounded ends. */
function sweep(x0: number, x1: number, cy: (t: number) => number, th: (t: number) => number, n = 40) {
  const top: string[] = [];
  const bot: string[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x0 + (x1 - x0) * t;
    const c = cy(t);
    const h = th(t) / 2;
    top.push(`${x.toFixed(1)},${(c - h).toFixed(1)}`);
    bot.push(`${x.toFixed(1)},${(c + h).toFixed(1)}`);
  }
  const he = (th(1) / 2).toFixed(1);
  const hs = (th(0) / 2).toFixed(1);
  return `M${top[0]} L${top.join(' L')} A${he},${he} 0 0 1 ${bot[n]} L${bot.reverse().join(' L')} A${hs},${hs} 0 0 1 ${top[0]} Z`;
}

const leverEnd: Record<LeverShape, { th: number; dy: number }> = {
  round: { th: 22, dy: 0 },
  square: { th: 24, dy: 0 },
  flat: { th: 18, dy: 0 },
  taper: { th: 18, dy: 0 },
  wave: { th: 20, dy: -5 },
};

function leverArm(shape: LeverShape, x0: number, y: number, tip: number, p: Paint) {
  switch (shape) {
    case 'round':
      return <rect x={x0 - 11} y={y - 11} width={tip - x0 + 11} height={22} rx={11} {...p('cyl')} />;
    case 'square':
      return <rect x={x0 - 12} y={y - 12} width={tip - x0 + 12} height={24} rx={2.5} {...p('bar')} />;
    case 'flat':
      return <rect x={x0 - 9} y={y - 9} width={tip - x0 + 9} height={18} rx={3} {...p('bar')} />;
    case 'taper':
      return <path d={sweep(x0, tip - 9, () => y, (t) => 26 - 8 * t)} {...p('cyl')} />;
    case 'wave':
      return (
        <path
          d={sweep(
            x0,
            tip - 10,
            (t) => y + 11 * Math.sin(Math.PI * t) - 5 * t * t,
            (t) => 22 - 6 * Math.sin(Math.PI * t * 0.9),
          )}
          {...p('cyl')}
        />
      );
  }
}

/* Lever on rose ---------------------------------------------------------- */
function Lever({ spec, p, mode, l }: KindProps<'lever'>) {
  const cx = 108;
  const cy = 200;
  const tip = 346;
  const end = leverEnd[spec.lever];
  const round = spec.rose === 'round';
  return (
    <>
      {round ? (
        <>
          <circle cx={cx} cy={cy} r={50} {...p('ring')} />
          <circle cx={cx} cy={cy} r={44} {...p('face')} />
        </>
      ) : (
        <>
          <rect x={cx - 50} y={cy - 50} width={100} height={100} rx={5} {...p('ring')} />
          <rect x={cx - 45} y={cy - 45} width={90} height={90} rx={3} {...p('face')} />
        </>
      )}
      <circle cx={cx} cy={cy} r={19} {...p('ring')} />
      {leverArm(spec.lever, cx, cy, tip, p)}
      {mode === 'line' && (
        <>
          <CL x1={36} y1={cy} x2={372} y2={cy} />
          <CL x1={cx} y1={136} x2={cx} y2={264} />
          <HDim x1={cx} x2={tip} y={112} from={[cy - 50, cy + end.dy - end.th / 2]} label={l('A')} />
          <VDim y1={cy - 50} y2={cy + 50} x={36} from={round ? [cx, cx] : [cx - 50, cx - 50]} label={l('B')} />
          <VDim
            y1={cy + end.dy - end.th / 2}
            y2={cy + end.dy + end.th / 2}
            x={374}
            from={[tip, tip]}
            label={l('C')}
            right
          />
        </>
      )}
    </>
  );
}

/* Lever on plate --------------------------------------------------------- */
function Plate({ spec, p, mode, l }: KindProps<'plate'>) {
  const cx = 145;
  const top = 44;
  const bot = 356;
  const sy = 112;
  const ky = spec.lock === 'turn' ? 214 : 222;
  const tip = 318;
  const slim = spec.plate === 'slim';
  const w = slim ? 40 : 56;
  const r = slim ? 20 : 5;
  const end = leverEnd[spec.lever];
  return (
    <>
      <rect x={cx - w / 2} y={top} width={w} height={bot - top} rx={r} {...p('ring')} />
      <rect x={cx - w / 2 + 4} y={top + 4} width={w - 8} height={bot - top - 8} rx={Math.max(r - 4, 2)} {...p('face')} />
      {spec.lock === 'key' && (
        <path
          d={`M${cx - 5},${ky + 6.9} A8.5,8.5 0 1 1 ${cx + 5},${ky + 6.9} V${ky + 20} Q${cx + 5},${ky + 24} ${cx},${ky + 24} Q${cx - 5},${ky + 24} ${cx - 5},${ky + 20} Z`}
          {...p('hole')}
        />
      )}
      {spec.lock === 'turn' && (
        <>
          <circle cx={cx} cy={ky} r={14} {...p('ring')} />
          <rect x={cx - 16} y={ky - 4.5} width={32} height={9} rx={4} {...p('bar')} />
          <circle cx={cx} cy={ky} r={4.5} {...p('disc')} />
        </>
      )}
      <circle cx={cx} cy={sy} r={17} {...p('ring')} />
      {leverArm(spec.lever, cx, sy, tip, p)}
      {mode === 'line' && (
        <>
          <CL x1={cx} y1={top - 16} x2={cx} y2={bot + 14} />
          <CL x1={cx - 56} y1={sy} x2={tip + 14} y2={sy} />
          {spec.lock !== 'none' && <CL x1={cx - 56} y1={ky} x2={cx + 40} y2={ky} />}
          <VDim y1={top} y2={bot} x={44} from={[cx - (slim ? 0 : w / 2), cx - (slim ? 0 : w / 2)]} label={l('A')} />
          <HDim x1={cx - w / 2} x2={cx + w / 2} y={384} from={[bot - (slim ? 20 : 0), bot - (slim ? 20 : 0)]} label={l('B')} />
          <HDim x1={cx} x2={tip} y={22} from={[top, sy - end.th / 2]} label={l('C')} below />
          {spec.lock !== 'none' && <VDim y1={sy} y2={ky} x={92} label={l('D')} />}
        </>
      )}
    </>
  );
}

/* Pull handle (side elevation) ------------------------------------------ */
function Pull({ spec, p, mode, l }: KindProps<'pull'>) {
  const door = 118;
  const top = 26;
  const bot = 374;
  const y1 = 96;
  const y2 = 304;
  const outer = 236;
  const flat = spec.bar === 'flat';
  const bw = flat ? 16 : 24;
  const bx = outer - bw;
  const square = spec.bar === 'square' || flat;
  const rose = (y: number) => <rect key={`r${y}`} x={door} y={y - 17} width={9} height={34} rx={2} {...p('cyl')} />;
  const post = (y: number) => {
    const h = flat ? 16 : 18;
    return (
      <rect key={`p${y}`} x={door + 8} y={y - h / 2} width={bx - door - 6} height={h} rx={square ? 1 : 2} {...p(square ? 'bar' : 'cyl')} />
    );
  };
  return (
    <>
      {mode === 'line' && <Surface x1={door} y1={44} x2={door} y2={356} side={1} />}
      {rose(y1)}
      {rose(y2)}
      {spec.bar === 'd' ? (
        <path
          d={`M${door + 8},${y1 - 11} H${outer - 50} A50,50 0 0 1 ${outer},${y1 + 39} V${y2 - 39} A50,50 0 0 1 ${outer - 50},${y2 + 11} H${door + 8} V${y2 - 11} H${outer - 50} A28,28 0 0 0 ${outer - 22},${y2 - 39} V${y1 + 39} A28,28 0 0 0 ${outer - 50},${y1 + 11} H${door + 8} Z`}
          {...p('cylv')}
        />
      ) : (
        <>
          {post(y1)}
          {post(y2)}
          <rect x={bx} y={top} width={bw} height={bot - top} rx={spec.bar === 'round' ? 12 : 2} {...p(square ? 'barv' : 'cylv')} />
        </>
      )}
      {mode === 'line' && (
        <>
          <CL x1={door - 22} y1={y1} x2={outer + 16} y2={y1} />
          <CL x1={door - 22} y1={y2} x2={outer + 16} y2={y2} />
          {spec.bar !== 'd' && <CL x1={bx + bw / 2} y1={top - 14} x2={bx + bw / 2} y2={bot + 14} />}
          <VDim y1={spec.bar === 'd' ? y1 - 11 : top} y2={spec.bar === 'd' ? y2 + 11 : bot} x={292} from={[outer - (spec.bar === 'd' ? 50 : 0), outer - (spec.bar === 'd' ? 50 : 0)]} label={l('A')} right />
          <VDim y1={y1} y2={y2} x={172} label={l('B')} right />
          <HDim x1={door} x2={outer} y={12} from={[44, spec.bar === 'd' ? y1 - 11 : top]} label={l('C')} below />
        </>
      )}
    </>
  );
}

/* Digital lock ----------------------------------------------------------- */
function Digital({ spec, p, mode, finish, l }: KindProps<'digital'>) {
  const x0 = 140;
  const x1 = 244;
  const top = 28;
  const bot = 372;
  const cx = 192;
  const shadow = mode === 'shadow';
  const render = mode === 'render';
  const darkBody = DARK_FINISHES.includes(finish);
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  const fy = 222;
  const hy = spec.fingerprint ? 296 : 272;
  const gy0 = spec.fingerprint ? 276 : 232;
  return (
    <>
      <rect x={x0} y={top} width={x1 - x0} height={bot - top} rx={18} {...p('ring')} />
      <rect x={x0 + 3} y={top + 3} width={x1 - x0 - 6} height={bot - top - 6} rx={15} {...p('face')} />
      <rect x={154} y={60} width={76} height={148} rx={10} {...p('glass')} />
      {!shadow && (
        <>
          <text
            x={cx}
            y={48}
            textAnchor="middle"
            fontSize={8.5}
            letterSpacing={3}
            fontWeight={600}
            fill={render ? (darkBody ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.4)') : INK}
          >
            GLEAM
          </text>
          <rect x={184} y={71} width={16} height={2.5} rx={1.25} fill={render ? '#5fd7a8' : 'none'} stroke={render ? 'none' : INK} strokeWidth={0.8} />
          {keys.map((k, i) => (
            <text
              key={k}
              x={172 + (i % 3) * 20}
              y={100 + Math.floor(i / 3) * 28}
              textAnchor="middle"
              fontSize={14}
              fontWeight={500}
              fill={render ? 'rgba(255,255,255,0.85)' : INK}
            >
              {k}
            </text>
          ))}
        </>
      )}
      {spec.fingerprint && (
        <>
          <rect x={cx - 15} y={fy} width={30} height={38} rx={15} {...p('glassDark')} />
          {!shadow && (
            <g fill="none" stroke={render ? 'rgba(255,255,255,0.18)' : INK} strokeWidth={0.8}>
              <rect x={cx - 9} y={fy + 6} width={18} height={26} rx={9} />
              <rect x={cx - 4.5} y={fy + 11} width={9} height={16} rx={4.5} />
            </g>
          )}
        </>
      )}
      {spec.handle === 'lever' ? (
        <>
          <rect x={cx - 8} y={340} width={16} height={20} rx={8} {...p('side')} />
          <circle cx={cx} cy={hy} r={21} {...p('ring')} />
          <rect x={cx - 11.5} y={hy - 11.5} width={340 - cx + 11.5} height={23} rx={11.5} {...p('cyl')} />
          <circle cx={cx} cy={hy} r={9} {...p('disc')} />
        </>
      ) : (
        <>
          <rect x={cx - 20} y={gy0} width={40} height={358 - gy0} rx={20} {...p('cylv')} />
          <rect x={cx - 9} y={gy0 + 14} width={18} height={358 - gy0 - 28} rx={9} {...p('side')} />
        </>
      )}
      {mode === 'line' && (
        <>
          <CL x1={cx} y1={top - 14} x2={cx} y2={bot + 10} />
          <VDim y1={top} y2={bot} x={102} from={[x0 + 18, x0 + 18]} label={l('A')} />
          <HDim x1={x0} x2={x1} y={390} from={[bot - 18, bot - 18]} label={l('B')} />
        </>
      )}
    </>
  );
}

/* Mortise lock body ------------------------------------------------------ */
function Mortise({ spec, p, mode, l }: KindProps<'mortise'>) {
  const fx0 = 84;
  const fx1 = 102;
  const ftop = 36;
  const fbot = 364;
  const hx = 186;
  const hy = 138;
  const ky = spec.lock === 'key' ? 248 : 239;
  const line = mode === 'line';
  return (
    <>
      <path d={`M${fx0},120 H66 Q60,120 60,126 L71,156 H${fx0} Z`} {...p('barv')} />
      {spec.lock === 'key' ? (
        <rect x={54} y={ky - 14} width={32} height={26} rx={2} {...p('bar')} />
      ) : (
        <rect x={66} y={ky - 11} width={20} height={22} rx={2} {...p('bar')} />
      )}
      <rect x={fx1} y={88} width={220} height={224} rx={2} {...p('case')} />
      {mode !== 'shadow' && (
        <rect x={110} y={96} width={204} height={208} rx={1} fill="none" stroke={line ? INK : 'rgba(0,0,0,0.09)'} strokeWidth={0.8} strokeOpacity={line ? 0.4 : 1} vectorEffect="non-scaling-stroke" />
      )}
      {[
        [122, 108],
        [302, 108],
        [122, 292],
        [302, 292],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r={5} {...p('caseRing')} />
      ))}
      <circle cx={hx} cy={hy} r={21} {...p('caseRing')} />
      <circle cx={hx} cy={hy} r={15} {...p('case')} />
      <rect x={hx - 5} y={hy - 5} width={10} height={10} {...p('hole')} />
      {spec.lock === 'key' ? (
        <path
          d={`M${hx - 6},${ky + 8} A10,10 0 1 1 ${hx + 6},${ky + 8} V${ky + 22} Q${hx + 6},${ky + 27} ${hx},${ky + 27} Q${hx - 6},${ky + 27} ${hx - 6},${ky + 22} Z`}
          {...p('hole')}
        />
      ) : (
        <>
          <circle cx={hx} cy={ky} r={16} {...p('caseRing')} />
          <rect x={hx - 4.5} y={ky - 4.5} width={9} height={9} {...p('hole')} />
        </>
      )}
      <rect x={fx0} y={ftop} width={fx1 - fx0} height={fbot - ftop} rx={3} {...p('barv')} />
      {[56, 344].map((y) => (
        <g key={y}>
          <circle cx={(fx0 + fx1) / 2} cy={y} r={6} {...p('ringIn')} />
          <circle cx={(fx0 + fx1) / 2} cy={y} r={2.3} {...p('hole')} />
        </g>
      ))}
      {line && (
        <>
          <CL x1={hx - 36} y1={hy} x2={hx + 40} y2={hy} />
          <CL x1={hx} y1={hy - 34} x2={hx} y2={ky + 40} />
          <CL x1={hx - 36} y1={ky} x2={hx + 40} y2={ky} />
          <HDim x1={fx0} x2={hx} y={18} from={[ftop, hy - 34]} label={l('A')} below />
          <VDim y1={hy} y2={ky} x={352} from={[hx + 40, hx + 40]} label={l('B')} right />
          <VDim y1={ftop} y2={fbot} x={36} from={[fx0, fx0]} label={l('C')} />
        </>
      )}
    </>
  );
}

/* Euro cylinder ---------------------------------------------------------- */
function Cylinder({ spec, p, mode, l }: KindProps<'cylinder'>) {
  const x0 = 81;
  const x1 = 319;
  const top = 146;
  const mid = 204;
  const finTop = 196;
  const finBot = 258;
  const cx = 200;
  return (
    <>
      <rect x={x0} y={finTop} width={x1 - x0} height={finBot - finTop} rx={3} {...p('face')} />
      <rect x={cx - 16} y={finTop + 2} width={32} height={40} {...p('side')} />
      <rect x={cx - 11} y={finTop + 4} width={22} height={32} rx={4} {...p('case')} />
      <circle cx={cx} cy={247} r={5.5} {...p('hole')} />
      <rect x={x0} y={top} width={x1 - x0} height={mid - top} rx={4} {...p('cyl')} />
      <rect x={x0 - 5} y={top - 3} width={8} height={mid - top + 6} rx={2} {...p('cylv')} />
      {!spec.turn && <rect x={x1 - 3} y={top - 3} width={8} height={mid - top + 6} rx={2} {...p('cylv')} />}
      <rect x={56} y={169} width={22} height={12} rx={2} {...p('key')} />
      <rect x={10} y={149} width={50} height={52} rx={16} {...p('key')} />
      <circle cx={28} cy={175} r={6.5} {...p('void')} />
      {spec.turn && (
        <>
          <rect x={x1} y={166} width={14} height={18} {...p('cylv')} />
          <rect x={x1 + 13} y={140} width={17} height={70} rx={7} {...p('barv')} />
        </>
      )}
      {mode === 'line' && (
        <>
          <CL x1={cx} y1={100} x2={cx} y2={274} />
          <CL x1={x0 - 20} y1={175} x2={x1 + 20} y2={175} />
          <HDim x1={x0} x2={x1} y={300} from={[finBot, finBot]} label={l('A')} />
          <HDim x1={x0} x2={cx} y={114} from={[top, 100]} label={l('B')} />
          <HDim x1={cx} x2={x1} y={114} from={[100, top]} label={l('C')} />
          <path
            d="M340.3,79 A20,20 0 1 1 363.7,79 L363.7,108.3 A11.7,11.7 0 0 1 340.3,108.3 Z"
            fill="var(--art-paper, #fff)"
            stroke={INK}
            strokeWidth={1.1}
            vectorEffect="non-scaling-stroke"
            transform="translate(0 -6)"
          />
          <rect x={350} y={50} width={4} height={56} rx={2} fill="none" stroke={INK} strokeWidth={0.7} vectorEffect="non-scaling-stroke" />
          <Caption x={352} y={30}>
            END VIEW
          </Caption>
        </>
      )}
    </>
  );
}

/* Butt hinge ------------------------------------------------------------- */
function Hinge({ spec, p, mode, l }: KindProps<'hinge'>) {
  const top = 48;
  const bot = 352;
  const lx0 = 78;
  const rx1 = 322;
  const kx0 = 188;
  const joints = [1, 2, 3, 4].map((k) => top + ((bot - top) * k) / 5);
  const bearingAt = spec.bearings === 4 ? [0, 1, 2, 3] : [0, 3];
  const holes =
    spec.holes === 3
      ? [
          [116, 98],
          [152, 200],
          [116, 302],
        ]
      : [
          [118, 88],
          [152, 162],
          [118, 238],
          [152, 312],
        ];
  return (
    <>
      <rect x={lx0} y={top} width={112} height={bot - top} rx={3} {...p('face')} />
      <rect x={210} y={top} width={112} height={bot - top} rx={3} {...p('face')} />
      {holes.flatMap(([x, y]) =>
        [x, 400 - x].map((hx) => (
          <g key={`${hx}-${y}`}>
            <circle cx={hx} cy={y} r={10} {...p('ringIn')} />
            <circle cx={hx} cy={y} r={4.2} {...p('hole')} />
          </g>
        )),
      )}
      <rect x={kx0 + 1} y={top - 9} width={22} height={10} rx={4} {...p('cylv')} />
      <rect x={kx0 + 1} y={bot - 1} width={22} height={10} rx={4} {...p('cylv')} />
      <rect x={kx0} y={top} width={24} height={bot - top} {...p('cylv')} />
      {joints.map((j, i) =>
        bearingAt.includes(i) ? (
          <rect key={j} x={kx0} y={j - 3} width={24} height={6} {...p('ringIn')} />
        ) : (
          <rect key={j} x={kx0} y={j - 0.6} width={24} height={1.2} {...p('side')} />
        ),
      )}
      {mode === 'line' && (
        <>
          <CL x1={200} y1={top - 26} x2={200} y2={bot + 22} />
          <VDim y1={top} y2={bot} x={40} from={[lx0, lx0]} label={l('A')} />
          <HDim x1={lx0} x2={rx1} y={386} from={[bot, bot]} label={l('B')} />
        </>
      )}
    </>
  );
}

/* Door closer ------------------------------------------------------------ */
function Closer({ spec, p, mode, l }: KindProps<'closer'>) {
  const line = mode === 'line';
  return (
    <>
      {line && (
        <>
          <line x1={16} y1={196} x2={384} y2={196} stroke={INK} strokeWidth={1.1} vectorEffect="non-scaling-stroke" />
          <Caption x={18} y={186} anchor="start">
            FRAME
          </Caption>
          <Caption x={18} y={212} anchor="start">
            DOOR
          </Caption>
        </>
      )}
      {spec.arm === 'standard' ? (
        <>
          <rect x={74} y={112} width={72} height={32} rx={4} {...p('face')} />
          <g transform="translate(330 150) rotate(185.7)">
            <rect x={-6} y={-5.5} width={233} height={11} rx={5.5} {...p('cyl')} />
          </g>
          <circle cx={110} cy={128} r={8} {...p('ring')} />
        </>
      ) : (
        <>
          <rect x={64} y={120} width={256} height={24} rx={4} {...p('face')} />
          <rect x={72} y={129} width={240} height={6} rx={3} {...p('side')} />
        </>
      )}
      <rect x={36} y={226} width={256} height={60} rx={10} {...p('face')} />
      <rect x={36} y={226} width={24} height={60} rx={10} {...p('cylv')} />
      <rect x={268} y={226} width={24} height={60} rx={10} {...p('cylv')} />
      <rect x={60} y={262} width={208} height={2} {...p('side')} />
      {spec.arm === 'standard' ? (
        <>
          <g transform="translate(240 226) rotate(-40.2)">
            <rect x={-10} y={-9} width={128} height={18} rx={9} {...p('cyl')} />
          </g>
          <circle cx={330} cy={150} r={10} {...p('ring')} />
          <circle cx={330} cy={150} r={3.5} {...p('hole')} />
        </>
      ) : (
        <>
          <g transform="translate(240 226) rotate(-134.4)">
            <rect x={-8} y={-8} width={137} height={16} rx={8} {...p('cyl')} />
          </g>
          <rect x={136} y={124} width={28} height={16} rx={3} {...p('barv')} />
          <circle cx={150} cy={132} r={4.5} {...p('disc')} />
        </>
      )}
      <circle cx={240} cy={226} r={13} {...p('ring')} />
      <circle cx={240} cy={226} r={6} {...p('disc')} />
      {line && (
        <>
          <HDim x1={36} x2={292} y={322} from={[286, 286]} label={l('A')} />
          <VDim y1={226} y2={286} x={330} from={[292, 292]} label={l('B')} right />
        </>
      )}
    </>
  );
}

/* Floor spring (plan) ---------------------------------------------------- */
function FloorSpring({ p, mode, l }: KindProps<'floorspring'>) {
  const line = mode === 'line';
  const shadow = mode === 'shadow';
  return (
    <>
      <rect x={48} y={146} width={304} height={108} rx={6} {...p('face')} />
      {!shadow && (
        <rect x={56} y={154} width={288} height={92} rx={3} fill="none" stroke={line ? INK : 'rgba(0,0,0,0.14)'} strokeOpacity={line ? 0.45 : 1} strokeWidth={0.8} vectorEffect="non-scaling-stroke" />
      )}
      <circle cx={120} cy={200} r={30} {...p('ringIn')} />
      <circle cx={120} cy={200} r={22} {...p('disc')} />
      <rect x={112} y={192} width={16} height={16} {...p('hole')} />
      {[
        [68, 168],
        [68, 232],
        [334, 168],
        [334, 232],
      ].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <circle cx={x} cy={y} r={7} {...p('ringIn')} />
          <circle cx={x} cy={y} r={2.6} {...p('hole')} />
        </g>
      ))}
      {[186, 214].map((y) => (
        <g key={y}>
          <circle cx={300} cy={y} r={5} {...p('ringIn')} />
          <circle cx={300} cy={y} r={1.8} {...p('hole')} />
        </g>
      ))}
      {!shadow && (
        <text x={236} y={206} textAnchor="middle" fontSize={15} letterSpacing={7} fontWeight={600} fill={line ? INK : 'rgba(0,0,0,0.17)'} fillOpacity={line ? 0.5 : 1}>
          GLEAM
        </text>
      )}
      {line && (
        <>
          <CL x1={82} y1={200} x2={160} y2={200} />
          <CL x1={120} y1={160} x2={120} y2={240} />
          <HDim x1={48} x2={352} y={292} from={[254, 254]} label={l('A')} />
          <VDim y1={146} y2={254} x={24} from={[48, 48]} label={l('B')} />
          <Caption x={200} y={120}>
            PLAN
          </Caption>
        </>
      )}
    </>
  );
}

/* Tower bolt ------------------------------------------------------------- */
function TowerBolt({ p, mode, l }: KindProps<'towerbolt'>) {
  return (
    <>
      <rect x={40} y={166} width={256} height={68} rx={4} {...p('face')} />
      {[
        [58, 180],
        [58, 220],
        [278, 180],
        [278, 220],
      ].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <circle cx={x} cy={y} r={6} {...p('ringIn')} />
          <circle cx={x} cy={y} r={2.4} {...p('hole')} />
        </g>
      ))}
      <rect x={318} y={170} width={44} height={60} rx={3} {...p('face')} />
      <rect x={52} y={190} width={290} height={20} rx={10} {...p('cyl')} />
      <rect x={80} y={172} width={40} height={56} rx={3} {...p('barv')} />
      <rect x={214} y={172} width={40} height={56} rx={3} {...p('barv')} />
      <rect x={326} y={184} width={28} height={32} rx={3} {...p('barv')} />
      <rect x={164} y={142} width={12} height={54} rx={3} {...p('cylv')} />
      <circle cx={170} cy={136} r={13} {...p('disc')} />
      {mode === 'line' && (
        <>
          <CL x1={30} y1={200} x2={376} y2={200} />
          <HDim x1={40} x2={296} y={274} from={[234, 234]} label={l('A')} />
          <VDim y1={166} y2={234} x={18} from={[40, 40]} label={l('B')} />
        </>
      )}
    </>
  );
}

/* Door stoppers ---------------------------------------------------------- */
function Stopper({ spec, p, mode, l }: KindProps<'stopper'>) {
  const line = mode === 'line';
  if (spec.type === 'floor') {
    return (
      <>
        {line && <Surface x1={70} y1={336} x2={330} y2={336} side={1} />}
        <rect x={140} y={320} width={120} height={16} rx={3} {...p('cyl')} />
        <path d="M164,321 L172,152 H228 L236,321 Z" {...p('cylv')} />
        <rect x={160} y={106} width={80} height={50} rx={12} {...p('rubber')} />
        {line && (
          <>
            <CL x1={200} y1={90} x2={200} y2={352} />
            <VDim y1={106} y2={336} x={296} from={[240, 262]} label={l('A')} right />
            <HDim x1={140} x2={260} y={370} from={[336, 336]} label={l('B')} />
          </>
        )}
      </>
    );
  }
  return (
    <>
      {line && (
        <>
          <Surface x1={40} y1={110} x2={40} y2={290} side={1} />
          <Surface x1={352} y1={110} x2={352} y2={290} side={-1} />
          <Caption x={46} y={104} anchor="start">
            WALL
          </Caption>
          <Caption x={346} y={104} anchor="end">
            DOOR
          </Caption>
        </>
      )}
      <rect x={40} y={166} width={14} height={68} rx={3} {...p('cyl')} />
      <rect x={52} y={180} width={154} height={40} rx={4} {...p('cyl')} />
      <rect x={204} y={172} width={16} height={56} rx={5} {...p('rubber')} />
      <rect x={219} y={186} width={7} height={28} rx={2} {...p('side')} />
      <rect x={334} y={168} width={18} height={64} rx={3} {...p('cyl')} />
      <rect x={306} y={180} width={30} height={40} rx={4} {...p('face')} />
      {line && (
        <>
          <CL x1={30} y1={200} x2={364} y2={200} />
          <HDim x1={40} x2={226} y={270} from={[234, 214]} label={l('A')} />
          <HDim x1={306} x2={352} y={270} from={[220, 290]} label={l('B')} />
        </>
      )}
    </>
  );
}

/* Door viewer ------------------------------------------------------------ */
function Viewer({ p, mode, l }: KindProps<'viewer'>) {
  const line = mode === 'line';
  const render = mode === 'render';
  return (
    <>
      <circle cx={112} cy={200} r={56} {...p('ring')} />
      <circle cx={112} cy={200} r={48} {...p('disc')} />
      <circle cx={112} cy={200} r={28} {...p('ringIn')} />
      <circle cx={112} cy={200} r={22} {...p('lens')} />
      {render && <ellipse cx={104} cy={192} rx={7} ry={4} fill="#fff" opacity={0.55} transform="rotate(-30 104 192)" />}
      <rect x={226} y={181} width={112} height={38} {...p('cyl')} />
      {mode !== 'shadow' && (
        <g stroke={line ? INK : 'rgba(0,0,0,0.2)'} strokeWidth={0.8} strokeOpacity={line ? 0.5 : 1}>
          {Array.from({ length: 13 }, (_, i) => 262 + i * 6).map((x) => (
            <line key={x} x1={x} y1={182} x2={x} y2={218} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      )}
      <rect x={212} y={146} width={14} height={108} rx={4} {...p('cylv')} />
      <rect x={336} y={168} width={14} height={64} rx={4} {...p('cylv')} />
      {line && (
        <>
          <CL x1={46} y1={200} x2={178} y2={200} />
          <CL x1={112} y1={134} x2={112} y2={266} />
          <CL x1={200} y1={200} x2={366} y2={200} />
          <Caption x={112} y={124}>
            FRONT
          </Caption>
          <Caption x={281} y={124}>
            SIDE
          </Caption>
          <HDim x1={56} x2={168} y={292} from={[200, 200]} label={l('A')} />
          <HDim x1={212} x2={350} y={292} from={[254, 232]} label={l('B')} />
        </>
      )}
    </>
  );
}

/* Cabinet handle (side elevation) --------------------------------------- */
function Cabinet({ spec, p, mode, l }: KindProps<'cabinet'>) {
  const surf = 262;
  const line = mode === 'line';
  const square = spec.bar === 'square';
  return (
    <>
      {line && <Surface x1={20} y1={surf} x2={380} y2={surf} side={1} />}
      {[102, 278].map((x) => (
        <g key={x}>
          <rect x={x} y={178} width={20} height={surf - 178} {...p(square ? 'barv' : 'cylv')} />
          <rect x={x - 5} y={surf - 8} width={30} height={8} rx={2} {...p('side')} />
        </g>
      ))}
      <rect x={36} y={164} width={328} height={20} rx={square ? 2 : 10} {...p(square ? 'bar' : 'cyl')} />
      {spec.bar === 'knurl' && mode !== 'shadow' && (
        <>
          <rect x={126} y={164} width={148} height={20} fill={line ? 'url(#p-knurl-line)' : 'url(#p-knurl)'} />
          <rect x={124} y={164} width={2} height={20} {...p('side')} />
          <rect x={274} y={164} width={2} height={20} {...p('side')} />
        </>
      )}
      {line && (
        <>
          <CL x1={112} y1={150} x2={112} y2={surf + 14} />
          <CL x1={288} y1={150} x2={288} y2={surf + 14} />
          <HDim x1={112} x2={288} y={300} from={[surf, surf]} label={l('A')} />
          <HDim x1={36} x2={364} y={136} from={[164, 164]} label={l('B')} />
          <VDim y1={164} y2={surf} x={384} from={[364, 380]} label={l('C')} />
        </>
      )}
    </>
  );
}

/* Cabinet knob ----------------------------------------------------------- */
function Knob({ spec, p, mode, l }: KindProps<'knob'>) {
  const line = mode === 'line';
  const round = spec.shape === 'round';
  const headEnd = round ? 342 : 302;
  return (
    <>
      <circle cx={110} cy={200} r={60} {...p('ring')} />
      {round ? <circle cx={110} cy={200} r={54} {...p('disc')} /> : <circle cx={110} cy={200} r={50} {...p('face')} />}
      {line && <Surface x1={222} y1={120} x2={222} y2={280} side={1} />}
      <rect x={222} y={172} width={10} height={56} rx={2} {...p('cyl')} />
      <path d="M231,184 C246,188 252,191 263,190 V210 C252,209 246,212 231,216 Z" {...p('cyl')} />
      {round ? (
        <path d="M262,168 Q262,140 292,140 Q340,142 342,200 Q340,258 292,260 Q262,260 262,232 Z" {...p('cyl')} />
      ) : (
        <>
          <rect x={262} y={140} width={40} height={120} rx={6} {...p('cyl')} />
          <rect x={294} y={146} width={8} height={108} rx={3} {...p('side')} />
        </>
      )}
      {line && (
        <>
          <CL x1={40} y1={200} x2={180} y2={200} />
          <CL x1={110} y1={130} x2={110} y2={270} />
          <CL x1={210} y1={200} x2={headEnd + 14} y2={200} />
          <Caption x={110} y={124}>
            FRONT
          </Caption>
          <Caption x={282} y={124}>
            SIDE
          </Caption>
          <HDim x1={50} x2={170} y={304} from={[200, 200]} label={l('A')} />
          <HDim x1={222} x2={headEnd} y={304} from={[280, 260]} label={l('B')} />
        </>
      )}
    </>
  );
}

/* Glass fittings --------------------------------------------------------- */
function Glass({ spec, p, mode, l }: KindProps<'glass'>) {
  const line = mode === 'line';
  const render = mode === 'render';
  if (spec.type === 'patch') {
    return (
      <>
        <rect x={120} y={24} width={300} height={318} {...p('tint')} />
        {render && (
          <g stroke="#fff" strokeOpacity={0.7} strokeWidth={1.2}>
            <line x1={286} y1={40} x2={386} y2={140} />
            <line x1={316} y1={40} x2={392} y2={116} />
          </g>
        )}
        <path d="M108,262 H292 Q302,262 306,272 L318,336 Q320,354 302,354 H108 Q96,354 96,342 V274 Q96,262 108,262 Z" {...p('face')} />
        <circle cx={148} cy={318} r={11} {...p('ringIn')} />
        <circle cx={148} cy={318} r={4.5} {...p('hole')} />
        <circle cx={222} cy={290} r={5} {...p('ringIn')} />
        <circle cx={264} cy={326} r={5} {...p('ringIn')} />
        {line && (
          <>
            <Caption x={260} y={150}>
              GLASS 10 TO 12 MM
            </Caption>
            <CL x1={148} y1={284} x2={148} y2={374} />
            <HDim x1={96} x2={320} y={384} from={[354, 344]} label={l('A')} />
            <VDim y1={262} y2={354} x={62} from={[96, 96]} label={l('B')} />
          </>
        )}
      </>
    );
  }
  return (
    <>
      {line && <Surface x1={72} y1={60} x2={72} y2={340} side={1} />}
      <rect x={196} y={24} width={220} height={352} {...p('tint')} />
      {render && (
        <g stroke="#fff" strokeOpacity={0.7} strokeWidth={1.2}>
          <line x1={300} y1={40} x2={392} y2={132} />
          <line x1={330} y1={40} x2={396} y2={106} />
        </g>
      )}
      <rect x={72} y={148} width={54} height={104} rx={4} {...p('face')} />
      {[172, 228].map((y) => (
        <g key={y}>
          <circle cx={99} cy={y} r={6} {...p('ringIn')} />
          <circle cx={99} cy={y} r={2.4} {...p('hole')} />
        </g>
      ))}
      <rect x={144} y={148} width={120} height={104} rx={4} {...p('face')} />
      <rect x={124} y={142} width={20} height={116} rx={6} {...p('cylv')} />
      <circle cx={224} cy={176} r={9} {...p('disc')} />
      <circle cx={224} cy={224} r={9} {...p('disc')} />
      {line && (
        <>
          <Caption x={86} y={52} anchor="start">
            WALL
          </Caption>
          <Caption x={300} y={360}>
            GLASS 8 TO 10 MM
          </Caption>
          <CL x1={134} y1={124} x2={134} y2={276} />
          <HDim x1={72} x2={264} y={296} from={[252, 252]} label={l('A')} />
          <VDim y1={148} y2={252} x={40} from={[72, 72]} label={l('B')} />
        </>
      )}
    </>
  );
}

export const KINDS: { [K in Kind]: (props: KindProps<K>) => ReactElement } = {
  lever: Lever,
  plate: Plate,
  pull: Pull,
  digital: Digital,
  mortise: Mortise,
  cylinder: Cylinder,
  hinge: Hinge,
  closer: Closer,
  floorspring: FloorSpring,
  towerbolt: TowerBolt,
  stopper: Stopper,
  viewer: Viewer,
  cabinet: Cabinet,
  knob: Knob,
  glass: Glass,
};
