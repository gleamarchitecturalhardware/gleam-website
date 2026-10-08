import type { ReactElement } from 'react';
import type { ArtSpec } from '@/data/types';
import type { FinishCode } from '@/data/finishes';
import { makePaint, type Mode } from './paint';
import { KINDS, type KindProps } from './kinds';

interface Props {
  art: ArtSpec;
  finish: FinishCode;
  mode?: Exclude<Mode, 'shadow'>;
  /** Replace the A, B, C, D dimension letters with other text. */
  labels?: Record<string, string>;
  className?: string;
  title?: string;
  shadow?: boolean;
  /** Crop of the 400 × 400 drawing grid. */
  viewBox?: string;
  /** Rotate the drawing about its centre, in degrees. The shadow still falls down and right. */
  rotate?: number;
  style?: React.CSSProperties;
}

export function ProductArt({
  art,
  finish,
  mode = 'render',
  labels,
  className,
  title,
  shadow = true,
  viewBox = '0 0 400 400',
  rotate,
  style,
}: Props) {
  const Kind = KINDS[art.kind] as unknown as (props: KindProps<typeof art.kind>) => ReactElement;
  const l = (key: string) => labels?.[key] ?? key;
  const turn = rotate ? `rotate(${rotate} 200 200)` : undefined;
  return (
    <svg
      viewBox={viewBox}
      className={className}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      data-mode={mode}
    >
      {mode === 'render' && shadow && (
        <g opacity={0.18} filter="url(#f-soft)" transform="translate(7 11)">
          <g transform={turn}>
            <Kind spec={art} p={makePaint(finish, 'shadow')} mode="shadow" finish={finish} l={l} />
          </g>
        </g>
      )}
      <g transform={turn}>
        <Kind spec={art} p={makePaint(finish, mode)} mode={mode} finish={finish} l={l} />
      </g>
    </svg>
  );
}
