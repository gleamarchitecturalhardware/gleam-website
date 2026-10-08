import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductArt } from '@/components/art/ProductArt';
import { Arrow } from '@/components/Arrow';
import { finishes } from '@/data/finishes';
import { products } from '@/data/products';
import type { ArtSpec } from '@/data/types';
import s from './page.module.css';

export const metadata: Metadata = {
  title: 'Finishes',
  description:
    'Seven finishes across the Gleam range, from satin stainless steel to PVD gold, with how each is made, where it works best and how to care for it.',
};

const trio: { art: ArtSpec; viewBox: string; rotate?: number }[] = [
  { art: { kind: 'lever', lever: 'round', rose: 'round' }, viewBox: '104 30 192 340', rotate: 90 },
  { art: { kind: 'pull', bar: 'round' }, viewBox: '90 10 190 380' },
  { art: { kind: 'knob', shape: 'round' }, viewBox: '200 110 160 180' },
];

export default function FinishesPage() {
  return (
    <>
      <div className={`container ${s.head}`}>
        <p className="label">Finishes and care</p>
        <h1 className="display">Seven finishes.</h1>
        <p className="lead">
          Each finish is described below with how it is made, where it works best and how to look after it. Colours on
          screen are a guide, so ask for a physical sample before you order for a whole project.
        </p>
        <nav className={s.jump} aria-label="Finishes on this page">
          {finishes.map((f) => (
            <a key={f.code} href={`#${f.code.toLowerCase()}`}>
              {f.name}
            </a>
          ))}
        </nav>
      </div>

      <div className="container">
        {finishes.map((f, i) => {
          const count = products.filter((p) => p.finishes.includes(f.code)).length;
          return (
            <section key={f.code} id={f.code.toLowerCase()} className={s.row} aria-labelledby={`f-${f.code}`}>
              <div className={`tile ${s.media}`}>
                {trio.map((t, j) => (
                  <div key={j} className={s.piece}>
                    <ProductArt art={t.art} finish={f.code} viewBox={t.viewBox} rotate={t.rotate} />
                  </div>
                ))}
              </div>
              <div className={s.body}>
                <p className={s.index}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  <span className="code">{f.code}</span>
                </p>
                <h2 id={`f-${f.code}`} className={`h2 ${s.name}`}>
                  {f.name}
                </h2>
                <p className={s.desc}>{f.description}</p>
                <dl className={s.facts}>
                  <div>
                    <dt>How it is made</dt>
                    <dd>{f.process}</dd>
                  </div>
                  <div>
                    <dt>Works best in</dt>
                    <dd>{f.bestFor}</dd>
                  </div>
                  <div>
                    <dt>Care</dt>
                    <dd>{f.care}</dd>
                  </div>
                </dl>
                <Link href={`/products?finish=${f.code}`} className="link">
                  {count} products in {f.short} <Arrow />
                </Link>
              </div>
            </section>
          );
        })}
      </div>

      <section className={s.sample}>
        <div className={`container ${s.sampleInner}`}>
          <div>
            <h2 className="h2">See it before you specify it.</h2>
            <p className="lead">
              We can send finish samples for your project so you can check them against the timber, stone and paint
              they will sit with.
            </p>
          </div>
          <Link href="/contact" className="btn btn--primary">
            Request finish samples <Arrow />
          </Link>
        </div>
      </section>
    </>
  );
}
