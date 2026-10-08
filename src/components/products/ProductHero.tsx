'use client';

import Link from 'next/link';
import { useState } from 'react';
import { categoryMap } from '@/data/categories';
import { finishMap, type FinishCode } from '@/data/finishes';
import type { Product } from '@/data/types';
import { useEnquiry } from '@/lib/enquiry';
import { ProductArt } from '../art/ProductArt';
import { Arrow } from '../Arrow';
import s from './ProductHero.module.css';

type View = 'product' | 'drawing';

export function ProductHero({ product }: { product: Product }) {
  const { add } = useEnquiry();
  const [finish, setFinish] = useState<FinishCode>(product.finishes[0]);
  const [view, setView] = useState<View>('product');
  const [size, setSize] = useState<string | undefined>(product.sizes?.rows[0][0]);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const f = finishMap[finish];
  const cat = categoryMap[product.category];

  const submit = () => {
    add({ slug: product.slug, finish, size, qty });
    setAdded(true);
  };

  return (
    <div className={s.hero}>
      <div className={s.media}>
        <div className={`tile ${s.stage}`} data-view={view}>
          <ProductArt
            art={product.art}
            finish={finish}
            className={s.render}
            title={`${product.name} in ${f.name}`}
          />
          <ProductArt art={product.art} finish={finish} mode="line" className={s.drawing} title={`${product.name}, dimensioned drawing`} />
          <p className={s.caption}>
            {view === 'product' ? f.name : 'Dimensions in mm, see table below'}
          </p>
        </div>
        <div className={s.views} role="tablist" aria-label="Image view">
          {(['product', 'drawing'] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              className={view === v ? s.viewOn : ''}
              onClick={() => setView(v)}
            >
              {v === 'product' ? 'Product' : 'Drawing'}
            </button>
          ))}
        </div>
      </div>

      <div className={s.info}>
        <p className={s.meta}>
          <span className="code">{product.code}</span>
          <span aria-hidden="true">·</span>
          <Link href={`/products?category=${cat.slug}`}>{cat.name}</Link>
          {product.isNew && <span className={s.new}>New</span>}
        </p>
        <h1 className={`display ${s.name}`}>{product.name}</h1>
        <p className={s.type}>{product.type}</p>
        <p className={s.summary}>{product.summary}</p>

        <div className={s.block}>
          <p className={s.blockHead}>
            <span className="label">Finish</span>
            <span className={s.selected}>{f.name}</span>
          </p>
          <ul className={s.options}>
            {product.finishes.map((code) => (
              <li key={code}>
                <button
                  type="button"
                  aria-pressed={finish === code}
                  className={finish === code ? s.optOn : ''}
                  onClick={() => {
                    setFinish(code);
                    setView('product');
                    setAdded(false);
                  }}
                >
                  <span>{finishMap[code].short}</span>
                  <span className={s.optCode}>{code}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className={s.note}>{f.process}.</p>
        </div>

        {product.sizes && (
          <div className={s.block}>
            <p className={s.blockHead}>
              <span className="label">Size</span>
              <span className={s.selected}>{size}</span>
            </p>
            <ul className={`${s.options} ${s.sizes}`}>
              {product.sizes.rows.map((r) => (
                <li key={r[0]}>
                  <button
                    type="button"
                    aria-pressed={size === r[0]}
                    className={size === r[0] ? s.optOn : ''}
                    onClick={() => {
                      setSize(r[0]);
                      setAdded(false);
                    }}
                  >
                    {r[0]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className={s.buy}>
          <div className={s.qty}>
            <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              −
            </button>
            <input
              type="number"
              min={1}
              max={9999}
              value={qty}
              aria-label="Quantity"
              onChange={(e) => setQty(Math.max(1, Math.min(9999, Number(e.target.value) || 1)))}
            />
            <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(9999, q + 1))}>
              +
            </button>
          </div>
          <button type="button" className="btn btn--primary" onClick={submit}>
            Add to enquiry list
          </button>
        </div>
        <p className={s.added} aria-live="polite">
          {added ? (
            <>
              Added {qty} × {product.name}, {f.short}
              {size ? `, ${size}` : ''}.{' '}
              <Link href="/contact#enquiry" className="link">
                View enquiry list <Arrow />
              </Link>
            </>
          ) : (
            'Build a list of products and send it to us for a quote. No payment is taken on this site.'
          )}
        </p>

        <dl className={s.facts}>
          {product.specs.slice(0, 4).map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
