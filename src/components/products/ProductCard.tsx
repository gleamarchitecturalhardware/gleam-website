import Link from 'next/link';
import type { Product } from '@/data/types';
import type { FinishCode } from '@/data/finishes';
import { ProductArt } from '../art/ProductArt';
import s from './ProductCard.module.css';

export function ProductCard({ product, finish, priority }: { product: Product; finish?: FinishCode; priority?: boolean }) {
  const f = finish && product.finishes.includes(finish) ? finish : product.finishes[0];
  const n = product.finishes.length;
  return (
    <Link href={`/products/${product.slug}`} className={s.card} prefetch={priority ? true : undefined}>
      <div className={`tile ${s.media}`}>
        <ProductArt art={product.art} finish={f} className={s.render} title={`${product.name}, ${product.type}`} />
        <ProductArt art={product.art} finish={f} mode="line" className={s.line} />
        {product.isNew && <span className={s.flag}>New</span>}
      </div>
      <div className={s.body}>
        <div className={s.row}>
          <h3 className={s.name}>{product.name}</h3>
          <span className={`code ${s.code}`}>{product.code}</span>
        </div>
        <p className={s.type}>{product.type}</p>
        <p className={s.finishes}>
          {n === 1 ? '1 finish' : `${n} finishes`}
          {product.sizes ? ` · ${product.sizes.rows.length} sizes` : ''}
        </p>
      </div>
    </Link>
  );
}
