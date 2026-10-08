import type { SVGProps } from 'react';
import type { FinishCode } from '@/data/finishes';

export type Mode = 'render' | 'line' | 'shadow';

/** Surface types. Finish tones are rendered in the product finish, fixed tones never change. */
export type FinishTone = 'cyl' | 'cylv' | 'bar' | 'barv' | 'face' | 'side' | 'disc' | 'ring' | 'ringIn';
export type FixedTone =
  | 'hole'
  | 'void'
  | 'glass'
  | 'glassDark'
  | 'rubber'
  | 'case'
  | 'caseRing'
  | 'tint'
  | 'key'
  | 'lens';
export type Tone = FinishTone | FixedTone;

export const FINISH_TONES: FinishTone[] = ['cyl', 'cylv', 'bar', 'barv', 'face', 'side', 'disc', 'ring', 'ringIn'];

const FIXED: Record<FixedTone, string> = {
  hole: '#1a1c1f',
  void: 'var(--art-bg, #eef0f2)',
  glass: 'url(#g-glass)',
  glassDark: 'url(#g-glassDark)',
  rubber: 'url(#g-rubber)',
  case: 'url(#g-case)',
  caseRing: 'url(#g-caseRing)',
  tint: 'url(#g-tint)',
  key: 'url(#g-key)',
  lens: 'url(#g-lens)',
};

export type PaintProps = Pick<
  SVGProps<SVGElement>,
  'fill' | 'stroke' | 'strokeWidth' | 'vectorEffect' | 'strokeLinejoin'
>;
export type Paint = (tone: Tone) => PaintProps;

const LINE = {
  stroke: 'var(--art-ink, #1d2024)',
  strokeWidth: 1.1,
  vectorEffect: 'non-scaling-stroke' as const,
  strokeLinejoin: 'round' as const,
};

export function makePaint(finish: FinishCode, mode: Mode): Paint {
  if (mode === 'shadow') {
    return (tone) => (tone === 'tint' ? { fill: 'none' } : { fill: '#000' });
  }
  if (mode === 'line') {
    return (tone) => ({
      ...LINE,
      fill: tone === 'tint' ? 'var(--art-glass-line, rgba(160, 200, 210, 0.12))' : 'var(--art-paper, #fff)',
    });
  }
  const edge = finish === 'MB' ? 'rgba(0,0,0,0.55)' : 'rgba(18,20,24,0.24)';
  return (tone) => {
    if (tone in FIXED) {
      const fixed = FIXED[tone as FixedTone];
      return {
        fill: fixed,
        stroke: tone === 'tint' ? 'rgba(90,130,140,0.35)' : tone === 'void' ? edge : 'rgba(0,0,0,0.3)',
        strokeWidth: 0.75,
        vectorEffect: 'non-scaling-stroke',
      };
    }
    return {
      fill: `url(#g-${finish}-${tone})`,
      stroke: edge,
      strokeWidth: 0.75,
      vectorEffect: 'non-scaling-stroke',
    };
  };
}
