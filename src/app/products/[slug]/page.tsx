import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductArt } from '@/components/art/ProductArt';
import { Arrow } from '@/components/Arrow';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductHero } from '@/components/products/ProductHero';
import { categoryMap } from '@/data/categories';
import { finishMap } from '@/data/finishes';
import { productMap, products } from '@/data/products';
import s from './page.module.css';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = productMap[slug];
  if (!p) return {};
  return {
    title: `${p.name} ${p.type}`,
    description: `${p.code}. ${p.summary}`,
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = productMap[slug];
  if (!product) notFound();

  const cat = categoryMap[product.category];
  const related = products.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);
  const fill = related.length < 4 ? products.filter((p) => p.featured && p.category !== product.category).slice(0, 4 - related.length) : [];

  return (
    <>
      <div className={`container ${s.top}`}>
        <nav className={s.crumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/products">Products</Link>
          <span aria-hidden="true">/</span>
          <Link href={`/products?category=${cat.slug}`}>{cat.name}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{product.name}</span>
        </nav>
        <ProductHero product={product} />
      </div>

      <div className={`container ${s.sections}`}>
        <section className={s.row} aria-labelledby="overview">
          <h2 id="overview" className={s.rowHead}>
            Overview
          </h2>
          <div className={s.overview}>
            <div className={s.prose}>
              {product.description.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
            <ul className={s.features}>
              {product.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className={s.row} aria-labelledby="dimensions">
          <h2 id="dimensions" className={s.rowHead}>
            Dimensions
          </h2>
          <div className={s.dims}>
            <figure className={s.drawing}>
              <ProductArt art={product.art} finish={product.finishes[0]} mode="line" title={`${product.name} drawing`} />
              <figcaption>
                {product.code} · All dimensions in millimetres · Not to scale
              </figcaption>
            </figure>
            <div>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th scope="col">Ref</th>
                    <th scope="col">Dimension</th>
                    <th scope="col">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {product.dims.map((d) => (
                    <tr key={d.ref}>
                      <td className={s.ref}>{d.ref}</td>
                      <td>{d.label}</td>
                      <td>{d.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {product.sizes && (
                <>
                  <h3 className={s.subhead}>Sizes</h3>
                  <table className={s.table}>
                    <thead>
                      <tr>
                        {product.sizes.columns.map((c) => (
                          <th key={c} scope="col">
                            {c}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {product.sizes.rows.map((r) => (
                        <tr key={r[0]}>
                          {r.map((cell, i) => (
                            <td key={i}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </section>

        <section className={s.row} aria-labelledby="specifications">
          <h2 id="specifications" className={s.rowHead}>
            Specifications
          </h2>
          <dl className={s.specs}>
            <div>
              <dt>Product code</dt>
              <dd className="code">{product.code}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{cat.name}</dd>
            </div>
            {product.specs.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
            <div>
              <dt>Finishes</dt>
              <dd>{product.finishes.map((c) => finishMap[c].name).join(', ')}</dd>
            </div>
          </dl>
        </section>

        <section className={s.row} aria-labelledby="finishes">
          <h2 id="finishes" className={s.rowHead}>
            Finishes
          </h2>
          <ul className={s.finishGrid}>
            {product.finishes.map((code) => {
              const f = finishMap[code];
              return (
                <li key={code}>
                  <div className={`tile ${s.finishTile}`}>
                    <ProductArt art={product.art} finish={code} />
                  </div>
                  <p className={s.finishName}>
                    {f.name} <span className="code">{code}</span>
                  </p>
                  <p className={s.finishText}>{f.process}</p>
                  <p className={s.finishText}>{f.care}</p>
                </li>
              );
            })}
          </ul>
          <p className={s.finishMore}>
            <Link href="/finishes" className="link">
              Compare all finishes <Arrow />
            </Link>
          </p>
        </section>

        <section className={s.row} aria-labelledby="box">
          <h2 id="box" className={s.rowHead}>
            In the box
          </h2>
          <div className={s.cols}>
            <ul className={s.plain}>
              {product.inBox.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <div>
              <h3 className={s.subhead}>Suitable for</h3>
              <ul className={s.plain}>
                {product.suitableFor.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={s.row} aria-labelledby="help">
          <h2 id="help" className={s.rowHead}>
            Specifying this?
          </h2>
          <div className={s.help}>
            <p>
              We can send a specification sheet, a physical finish sample, and fixing instructions for {product.name}. Tell
              us the project and the number of doors.
            </p>
            <Link href={`/contact?product=${product.slug}`} className="btn btn--outline">
              Ask about {product.name}
            </Link>
          </div>
        </section>
      </div>

      <section className={`section section--alt ${s.related}`} aria-labelledby="related">
        <div className="container">
          <div className={s.relatedHead}>
            <h2 id="related" className="h2">
              {fill.length ? 'You may also need' : `More ${cat.name.toLowerCase()}`}
            </h2>
            <Link href={`/products?category=${cat.slug}`} className="link">
              All {cat.name.toLowerCase()} <Arrow />
            </Link>
          </div>
          <ul className={s.relatedGrid}>
            {[...related, ...fill].map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
