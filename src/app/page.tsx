import Link from 'next/link';
import { ProductArt } from '@/components/art/ProductArt';
import { Arrow } from '@/components/Arrow';
import { AnatomyDrawing } from '@/components/home/Anatomy';
import { DoorElevation, type DoorType } from '@/components/home/DoorElevation';
import { HeroStage } from '@/components/home/HeroStage';
import { ProductCard } from '@/components/products/ProductCard';
import { categories } from '@/data/categories';
import { finishes } from '@/data/finishes';
import { productMap, products, productsIn } from '@/data/products';
import { site } from '@/data/site';
import type { ArtSpec } from '@/data/types';
import s from './page.module.css';

const sampleLever: ArtSpec = { kind: 'lever', lever: 'round', rose: 'round' };

const featured = ['arris-lever-on-rose', 'portal-f4-digital-lock', 'knurl-cabinet-handle', 'mullion-pull-handle'].map(
  (slug) => productMap[slug],
);

const parts = [
  ['Lever', 'Forged from solid brass, then machined. Forging packs the grain of the metal, so the lever stays true and does not work loose.'],
  ['Rose', '8 mm brass with a concealed fixing collar. There are no screw heads on show and nothing to unscrew from outside.'],
  ['Spring cassette', 'A pre-loaded spring in each rose lifts the lever back to level after every use, so it never droops.'],
  ['Spindle', '8 mm square and split in two, so each lever sits tight whatever the thickness of the door.'],
  ['Lock body', 'Keep 45, with a latch that reverses without opening the case. Key and bathroom versions.'],
  ['Through bolts', 'Tie the two roses together through the door instead of relying on wood screws alone.'],
];

const doors: { type: DoorType; name: string; text: string; items: string[] }[] = [
  {
    type: 'main',
    name: 'Main door',
    text: 'A digital lock with a key override, heavy-duty hinges, a viewer and a closer so the door never slams.',
    items: ['portal-f4-digital-lock', 'knuckle-hd-hinge', 'hold-60-door-closer', 'eye-200-door-viewer'],
  },
  {
    type: 'bedroom',
    name: 'Bedroom',
    text: 'Lever on rose over a key lock, three ball-bearing hinges and a floor stopper to protect the wall.',
    items: ['torus-lever-on-rose', 'keep-45-mortise-lock', 'knuckle-bb-hinge', 'stay-door-stopper'],
  },
  {
    type: 'bathroom',
    name: 'Bathroom',
    text: 'A plate handle with a thumb-turn inside and an emergency release outside, on a matching lock body.',
    items: ['corbel-lever-on-plate', 'keep-45-wc-lock', 'knuckle-bb-hinge'],
  },
  {
    type: 'glass',
    name: 'Glass entrance',
    text: 'A floor spring and patch fittings carry the door; a long pull handle goes through the glass.',
    items: ['pivot-120-floor-spring', 'glaze-patch-fitting', 'mullion-pull-handle'],
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero ------------------------------------------------------------ */}
      <section className={s.hero}>
        <div className={`container ${s.heroGrid}`}>
          <div className={s.heroCopy}>
            <p className="label">Gleam Architectural Hardware</p>
            <h1 className={`display ${s.heroTitle}`}>
              The part of the door you&nbsp;touch.
            </h1>
            <p className={`lead ${s.heroLead}`}>
              Mortise handles, locks, hinges and door controls in solid brass and stainless steel. Drawn to the
              millimetre and made for doors that are opened every day.
            </p>
            <div className={s.heroActions}>
              <Link href="/products" className="btn btn--primary">
                Browse the catalogue <Arrow />
              </Link>
              <Link href="/finishes" className="link">
                See the finishes
              </Link>
            </div>
            <dl className={s.stats}>
              <div>
                <dt>Products</dt>
                <dd>{products.length}</dd>
              </div>
              <div>
                <dt>Categories</dt>
                <dd>{categories.length}</dd>
              </div>
              <div>
                <dt>Finishes</dt>
                <dd>{finishes.length}</dd>
              </div>
            </dl>
          </div>
          <div className={s.heroStage}>
            <HeroStage />
          </div>
        </div>
      </section>

      {/* Categories -------------------------------------------------------- */}
      <section className="section" aria-labelledby="catalogue">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-head__index label">
                <span>01</span>
                <span>Catalogue</span>
              </p>
              <h2 id="catalogue" className="h2">
                Everything for the door,
                <br />
                and the cabinet beside it.
              </h2>
            </div>
            <p className="lead">
              Every product is listed with a drawing, its dimensions and the finishes it comes in, so you can specify
              it straight from the page.
            </p>
          </div>

          <ul className={s.cats}>
            {categories.map((c, i) => {
              const cover = productMap[c.cover];
              const n = productsIn(c.slug).length;
              return (
                <li key={c.slug} className={i === 0 ? s.catBig : undefined}>
                  <Link href={`/products?category=${c.slug}`} className={s.cat}>
                    <div className={`tile ${s.catMedia}`}>
                      <ProductArt art={cover.art} finish={cover.finishes[0]} className={s.catArt} />
                    </div>
                    <div className={s.catBody}>
                      <span className={s.catIndex}>{String(i + 1).padStart(2, '0')}</span>
                      <h3 className={s.catName}>{c.name}</h3>
                      <p className={s.catText}>{c.blurb}</p>
                      <span className={s.catMore}>
                        {n} {n === 1 ? 'product' : 'products'} <Arrow />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Featured ---------------------------------------------------------- */}
      <section className="section section--alt" aria-labelledby="selected">
        <div className="container">
          <div className={s.rowHead}>
            <div>
              <p className="section-head__index label">
                <span>02</span>
                <span>Selected</span>
              </p>
              <h2 id="selected" className="h2">
                Selected products
              </h2>
            </div>
            <Link href="/products" className="link">
              All {products.length} products <Arrow />
            </Link>
          </div>
          <ul className={s.featured}>
            {featured.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Finishes ---------------------------------------------------------- */}
      <section className="section" aria-labelledby="finishes">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-head__index label">
                <span>03</span>
                <span>Finishes</span>
              </p>
              <h2 id="finishes" className="h2">
                One lever,
                <br />
                seven finishes.
              </h2>
            </div>
            <p className="lead">
              From brushed steel to PVD gold, every finish is listed with how it is made and how to look after it.
              Pick one on any product page to see that product in it.
            </p>
          </div>
          <ul className={s.finishes}>
            {finishes.map((f) => (
              <li key={f.code}>
                <Link href={`/finishes#${f.code.toLowerCase()}`} className={s.finish}>
                  <div className={`tile ${s.finishTile}`}>
                    <ProductArt art={sampleLever} finish={f.code} rotate={90} viewBox="104 30 192 340" />
                  </div>
                  <p className={s.finishCode}>{f.code}</p>
                  <h3 className={s.finishName}>{f.name}</h3>
                  <p className={s.finishText}>{f.bestFor}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Anatomy ----------------------------------------------------------- */}
      <section className="section section--alt" aria-labelledby="inside">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-head__index label">
                <span>04</span>
                <span>Construction</span>
              </p>
              <h2 id="inside" className="h2">
                What holds a lever
                <br />
                level for years.
              </h2>
            </div>
            <p className="lead">
              A lever set is six parts working through the thickness of a door. This is how ours fit together, seen
              from above.
            </p>
          </div>
          <div className={s.anatomy}>
            <div className={s.anatomyArt}>
              <AnatomyDrawing />
            </div>
            <ol className={s.parts}>
              {parts.map(([name, text], i) => (
                <li key={name}>
                  <span className={s.partNo}>{i + 1}</span>
                  <div>
                    <h3 className={s.partName}>{name}</h3>
                    <p className={s.partText}>{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Door types -------------------------------------------------------- */}
      <section className="section" aria-labelledby="doors">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-head__index label">
                <span>05</span>
                <span>Hardware by door</span>
              </p>
              <h2 id="doors" className="h2">
                Four doors,
                <br />
                fully specified.
              </h2>
            </div>
            <p className="lead">
              A starting point for the doors in most homes. Handles sit at 1000 mm from the finished floor; everything
              else follows from the door.
            </p>
          </div>
          <ul className={s.doors}>
            {doors.map((d) => (
              <li key={d.type} className={s.door}>
                <div className={s.doorArt}>
                  <DoorElevation type={d.type} />
                </div>
                <h3 className={s.doorName}>{d.name}</h3>
                <p className={s.doorText}>{d.text}</p>
                <ul className={s.doorItems}>
                  {d.items.map((slug) => {
                    const p = productMap[slug];
                    return (
                      <li key={slug}>
                        <Link href={`/products/${slug}`}>
                          <span>{p.name}</span>
                          <span className={s.doorItemType}>{p.type}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Project CTA ------------------------------------------------------- */}
      <section className={s.cta} aria-labelledby="project">
        <div className={`container ${s.ctaGrid}`}>
          <div>
            <p className="label">For architects, builders and dealers</p>
            <h2 id="project" className={`h2 ${s.ctaTitle}`}>
              Specifying hardware
              <br />
              for a project?
            </h2>
          </div>
          <div className={s.ctaBody}>
            <p className="lead">
              Send us your door schedule. We will come back with a hardware schedule listing product codes, finishes
              and quantities for every door, and we can send finish samples before you order.
            </p>
            <div className={s.ctaActions}>
              <Link href="/contact" className="btn btn--red">
                Start an enquiry <Arrow />
              </Link>
              <a href={`tel:${site.phone.replace(/\s/g, '')}`} className="link">
                Call {site.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
