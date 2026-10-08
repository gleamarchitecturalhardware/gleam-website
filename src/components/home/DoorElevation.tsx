import { Surface } from '../art/dims';

export type DoorType = 'main' | 'bedroom' | 'bathroom' | 'glass';

const INK = 'var(--art-ink, #1d2024)';
const RED = 'var(--red, #ed1c24)';
const line = { stroke: INK, strokeWidth: 1.1, vectorEffect: 'non-scaling-stroke' as const };
const thin = { stroke: INK, strokeWidth: 0.6, strokeOpacity: 0.5, vectorEffect: 'non-scaling-stroke' as const };

/** Height marker from the floor, in the style of an elevation drawing. */
function Height({ y, label }: { y: number; label: string }) {
  return (
    <g stroke={RED} strokeWidth={0.8} vectorEffect="non-scaling-stroke">
      <line x1={238} y1={y} x2={238} y2={420} vectorEffect="non-scaling-stroke" />
      <line x1={232} y1={y} x2={244} y2={y} vectorEffect="non-scaling-stroke" />
      <line x1={234} y1={y + 4} x2={242} y2={y - 4} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
      <line x1={234} y1={424} x2={242} y2={416} strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
      <text x={248} y={(y + 420) / 2} fill={RED} stroke="none" fontSize={11} fontWeight={600} transform={`rotate(-90 248 ${(y + 420) / 2})`} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}

function Hinges({ at }: { at: number[] }) {
  return (
    <>
      {at.map((y) => (
        <rect key={y} x={41} y={y} width={6} height={20} fill={RED} />
      ))}
    </>
  );
}

/** Door elevations (scale about 1:55) showing where each piece of hardware sits. */
export function DoorElevation({ type }: { type: DoorType }) {
  const glass = type === 'glass';
  return (
    <svg viewBox="0 0 262 440" className="door" aria-hidden="true">
      <Surface x1={8} y1={420} x2={230} y2={420} side={1} />

      {glass ? (
        <>
          <rect x={44} y={30} width={172} height={388} fill="rgba(186, 220, 226, 0.35)" {...line} />
          <g stroke="#fff" strokeWidth={1.4}>
            <line x1={150} y1={46} x2={206} y2={102} />
            <line x1={170} y1={46} x2={210} y2={86} />
          </g>
          <rect x={44} y={30} width={44} height={14} fill={RED} />
          <rect x={44} y={404} width={44} height={14} fill={RED} />
          <rect x={44} y={424} width={60} height={10} fill="none" stroke={RED} strokeWidth={0.9} strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
          <rect x={190} y={150} width={5} height={180} rx={2.5} fill={RED} />
          <line x1={44} y1={30} x2={44} y2={8} {...thin} strokeDasharray="6 2 1 2" />
        </>
      ) : (
        <>
          <rect x={34} y={24} width={192} height={396} fill="none" {...line} />
          <rect x={44} y={34} width={172} height={386} fill="#fff" {...line} />
        </>
      )}

      {type === 'main' && (
        <>
          <line x1={58} y1={140} x2={202} y2={140} {...thin} />
          <line x1={58} y1={316} x2={202} y2={316} {...thin} />
          <Hinges at={[56, 156, 268, 372]} />
          <rect x={186} y={196} width={16} height={64} rx={3} fill={RED} />
          <rect x={164} y={238} width={30} height={5} rx={2.5} fill={RED} />
          <circle cx={130} cy={148} r={4} fill={RED} />
          <rect x={56} y={40} width={62} height={10} rx={2} fill={RED} />
          <line x1={110} y1={42} x2={136} y2={28} stroke={RED} strokeWidth={2} />
          <Height y={240} label="1000" />
        </>
      )}

      {type === 'bedroom' && (
        <>
          <Hinges at={[64, 214, 364]} />
          <circle cx={196} cy={236} r={7} fill={RED} />
          <rect x={168} y={234} width={28} height={4.5} rx={2.25} fill={RED} />
          <circle cx={196} cy={262} r={3} fill={RED} />
          <circle cx={150} cy={414} r={4} fill={RED} />
          <Height y={236} label="1000" />
        </>
      )}

      {type === 'bathroom' && (
        <>
          <Hinges at={[64, 214, 364]} />
          {[372, 380, 388, 396, 404].map((y) => (
            <line key={y} x1={70} y1={y} x2={190} y2={y} {...thin} />
          ))}
          <rect x={191} y={214} width={10} height={52} rx={5} fill={RED} />
          <rect x={168} y={222} width={28} height={4.5} rx={2.25} fill={RED} />
          <circle cx={196} cy={254} r={3.2} fill="#fff" />
          <Height y={224} label="1000" />
        </>
      )}

      {glass && <Height y={240} label="1000" />}
    </svg>
  );
}
