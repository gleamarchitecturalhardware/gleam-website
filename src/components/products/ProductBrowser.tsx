'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { categories, categoryMap } from '@/data/categories';
import { finishes, finishMap, type FinishCode } from '@/data/finishes';
import { products } from '@/data/products';
import type { CategorySlug } from '@/data/types';
import { ProductCard } from './ProductCard';
import s from './ProductBrowser.module.css';

const isCategory = (v: string | null): v is CategorySlug => !!v && v in categoryMap;
const isFinish = (v: string | null): v is FinishCode => !!v && v in finishMap;

export function ProductBrowser() {
  const params = useSearchParams();
  const pathname = usePathname();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = isCategory(params.get('category')) ? (params.get('category') as CategorySlug) : null;
  const finish = isFinish(params.get('finish')) ? (params.get('finish') as FinishCode) : null;
  const [query, setQuery] = useState(params.get('q') ?? '');

  const update = (next: Record<string, string | null>) => {
    const p = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) p.set(k, v);
      else p.delete(k);
    }
    const qs = p.toString();
    // Filtering happens in the browser, so update the URL without fetching the page again.
    window.history.replaceState(null, '', qs ? `${pathname}?${qs}` : pathname);
  };

  const q = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      products.filter((p) => {
        if (category && p.category !== category) return false;
        if (finish && !p.finishes.includes(finish)) return false;
        if (q) {
          const hay = `${p.name} ${p.code} ${p.type} ${categoryMap[p.category].name} ${p.summary}`.toLowerCase();
          if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
        }
        return true;
      }),
    [category, finish, q],
  );

  const countFor = (slug: CategorySlug) =>
    products.filter((p) => p.category === slug && (!finish || p.finishes.includes(finish))).length;

  const groups = category
    ? [{ cat: categoryMap[category], items: results }]
    : categories.map((c) => ({ cat: c, items: results.filter((p) => p.category === c.slug) })).filter((g) => g.items.length);

  const active = !!(category || finish || q);
  const title = category ? categoryMap[category].name : 'All products';

  return (
    <div className={`container ${s.wrap}`}>
      <div className={s.head}>
        <nav className={s.crumbs} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          {category ? (
            <>
              <button type="button" onClick={() => update({ category: null })}>
                Products
              </button>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{title}</span>
            </>
          ) : (
            <span aria-current="page">Products</span>
          )}
        </nav>
        <h1 className={`display ${s.title}`}>{title}</h1>
        <p className="lead">
          {category
            ? categoryMap[category].blurb
            : 'Every product with its drawing, dimensions and finishes. Hover a product to see it drawn; open it for the full specification.'}
        </p>
      </div>

      <div className={s.layout}>
        <aside className={s.side}>
          <button
            type="button"
            className={s.filterToggle}
            aria-expanded={filtersOpen}
            aria-controls="filters"
            onClick={() => setFiltersOpen((o) => !o)}
          >
            Filters{active ? ' (on)' : ''}
            <span aria-hidden="true">{filtersOpen ? '−' : '+'}</span>
          </button>

          <div id="filters" className={`${s.filters} ${filtersOpen ? s.filtersOpen : ''}`}>
            <label className={s.search}>
              <span className="visually-hidden">Search products</span>
              <input
                type="search"
                placeholder="Search by name or code"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  update({ q: e.target.value.trim() || null });
                }}
              />
            </label>

            <fieldset className={s.group}>
              <legend className="label">Category</legend>
              <ul>
                <li>
                  <button type="button" className={!category ? s.on : ''} aria-pressed={!category} onClick={() => update({ category: null })}>
                    <span>All products</span>
                    <span className={s.n}>{products.filter((p) => !finish || p.finishes.includes(finish)).length}</span>
                  </button>
                </li>
                {categories.map((c) => (
                  <li key={c.slug}>
                    <button
                      type="button"
                      className={category === c.slug ? s.on : ''}
                      aria-pressed={category === c.slug}
                      onClick={() => update({ category: c.slug })}
                    >
                      <span>{c.name}</span>
                      <span className={s.n}>{countFor(c.slug)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </fieldset>

            <fieldset className={s.group}>
              <legend className="label">Finish</legend>
              <p className={s.hint}>Products are shown in the finish you pick.</p>
              <ul>
                <li>
                  <button type="button" className={!finish ? s.on : ''} aria-pressed={!finish} onClick={() => update({ finish: null })}>
                    <span>Any finish</span>
                  </button>
                </li>
                {finishes.map((f) => (
                  <li key={f.code}>
                    <button
                      type="button"
                      className={finish === f.code ? s.on : ''}
                      aria-pressed={finish === f.code}
                      onClick={() => update({ finish: f.code })}
                    >
                      <span>{f.name}</span>
                      <span className={s.n}>{f.code}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </fieldset>

            {active && (
              <button
                type="button"
                className={`link ${s.reset}`}
                onClick={() => {
                  setQuery('');
                  window.history.replaceState(null, '', pathname);
                }}
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        <div className={s.main}>
          <p className={s.count} aria-live="polite">
            {results.length === 1 ? '1 product' : `${results.length} products`}
            {finish ? ` in ${finishMap[finish].name}` : ''}
            {q ? ` matching “${query.trim()}”` : ''}
          </p>

          {results.length === 0 ? (
            <div className={s.empty}>
              <p className="h3">Nothing matches those filters.</p>
              <p className="muted">Try another finish, or clear the search. If you need something that is not listed, ask us. Not every product we supply is in the online catalogue.</p>
            </div>
          ) : (
            groups.map(({ cat, items }) => (
              <section key={cat.slug} className={s.group2} aria-labelledby={`g-${cat.slug}`}>
                {!category && (
                  <div className={s.groupHead}>
                    <h2 id={`g-${cat.slug}`} className={s.groupTitle}>
                      <span className={s.groupIndex}>{String(categories.indexOf(cat) + 1).padStart(2, '0')}</span>
                      {cat.name}
                    </h2>
                    <button type="button" className={s.groupLink} onClick={() => update({ category: cat.slug })}>
                      Only {cat.name.toLowerCase()}
                    </button>
                  </div>
                )}
                <ul className={s.grid}>
                  {items.map((p) => (
                    <li key={p.slug}>
                      <ProductCard product={p} finish={finish ?? undefined} />
                    </li>
                  ))}
                </ul>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
