'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { finishMap, type FinishCode } from '@/data/finishes';
import { productMap } from '@/data/products';
import { ProductArt } from '../art/ProductArt';
import { Arrow } from '../Arrow';
import s from './HeroStage.module.css';

const product = productMap['torus-lever-on-rose'];
const VIEW = '-12 34 424 318';
const LABELS = { A: '140', B: 'Ø 52', C: 'Ø 19' };

export function HeroStage() {
  const [finish, setFinish] = useState<FinishCode>(product.finishes[0]);
  const [pos, setPos] = useState(100);
  const [phase, setPhase] = useState<'intro' | 'idle' | 'drag'>('intro');
  const stage = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPos(52);
      setPhase('idle');
      return;
    }
    const start = setTimeout(() => setPos(52), 500);
    const end = setTimeout(() => setPhase('idle'), 2400);
    return () => {
      clearTimeout(start);
      clearTimeout(end);
    };
  }, []);

  const moveTo = (clientX: number) => {
    const r = stage.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    dragging.current = true;
    setPhase('drag');
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    moveTo(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) moveTo(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
    setPhase('idle');
  };

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 20 : 5;
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - step));
    else if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + step));
    else if (e.key === 'Home') setPos(0);
    else if (e.key === 'End') setPos(100);
    else return;
    e.preventDefault();
    setPhase('idle');
  };

  const f = finishMap[finish];

  return (
    <div className={s.wrap}>
      <div
        ref={stage}
        className={s.stage}
        data-phase={phase}
        style={{ '--pos': pos } as React.CSSProperties}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className={s.drawing}>
          <ProductArt art={product.art} finish={finish} mode="line" labels={LABELS} viewBox={VIEW} className={s.art} />
          <span className={`${s.tag} ${s.tagLeft}`}>Drawing</span>
          <dl className={s.titleBlock} aria-hidden="true">
            <div>
              <dt>Item</dt>
              <dd>Torus lever on rose</dd>
            </div>
            <div>
              <dt>Code</dt>
              <dd>{product.code}</dd>
            </div>
            <div>
              <dt>Units</dt>
              <dd>mm</dd>
            </div>
          </dl>
        </div>

        <div className={s.render}>
          <ProductArt
            art={product.art}
            finish={finish}
            viewBox={VIEW}
            className={s.art}
            title={`${product.name} lever handle in ${f.name}`}
          />
          <span className={`${s.tag} ${s.tagRight}`}>Finished</span>
          <span className={s.finishName}>{f.name}</span>
        </div>

        <div
          className={s.handle}
          role="slider"
          tabIndex={0}
          aria-label="Compare drawing and finished product"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(100 - pos)} percent finished`}
          onKeyDown={onKey}
        >
          <span className={s.grip} aria-hidden="true">
            <svg viewBox="0 0 20 10" fill="none">
              <path d="M5 1L1 5l4 4M15 1l4 4-4 4" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </span>
        </div>
      </div>

      <div className={s.controls}>
        <p className={s.controlsLabel}>
          <Link href={`/products/${product.slug}`}>
            {product.name} <span className="code">{product.code}</span>
          </Link>{' '}
          in
        </p>
        <ul className={s.finishes}>
          {product.finishes.map((code) => (
            <li key={code}>
              <button type="button" aria-pressed={finish === code} onClick={() => setFinish(code)}>
                {finishMap[code].short}
              </button>
            </li>
          ))}
        </ul>
        <Link href={`/products/${product.slug}`} className={s.view} aria-label={`View ${product.name}`}>
          <Arrow />
        </Link>
      </div>
    </div>
  );
}
