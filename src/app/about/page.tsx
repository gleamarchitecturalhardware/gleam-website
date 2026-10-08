import type { Metadata } from 'next';
import Link from 'next/link';
import { ProductArt } from '@/components/art/ProductArt';
import { Arrow } from '@/components/Arrow';
import { productMap } from '@/data/products';
import s from './page.module.css';

export const metadata: Metadata = {
  title: 'About',
  description: 'Gleam designs and supplies architectural hardware for homes, offices and hotels.',
};

/* Placeholder company story. Replace with Gleam's own history and facts. */

const steps = [
  ['Drawing', 'Every product starts as a dimensioned drawing, checked against the doors and locks it has to fit before any metal is cut.'],
  ['Forging and casting', 'Levers are hot forged from brass bar. Plates and roses are cut from sheet. Lock cases are pressed from steel.'],
  ['Machining', 'Spindle holes, threads and seats are machined after forging, so parts fit the same way every time.'],
  ['Finishing', 'Brushed, plated or coated in one of seven finishes, then checked by eye under daylight lamps.'],
  ['Testing', 'Samples from each batch are cycle tested for spring return and checked for finish adhesion.'],
  ['Packing', 'Packed as complete sets with screws, spindles and a fitting template, so nothing is missing on site.'],
];

const people = [
  ['Architects and interior designers', 'Drawings, specifications and finish samples for your schedules. We will check a hardware schedule against your door list.'],
  ['Builders and contractors', 'Supply for whole projects, delivered in batches, with keyed-alike and master-keyed cylinders when you need them.'],
  ['Dealers', 'Stock, display boards and catalogues for your counter, with support on technical questions from your customers.'],
  ['Homeowners', 'Help choosing handles and locks room by room, and a list of dealers near you.'],
];

export default function AboutPage() {
  const lever = productMap['ogee-lever-on-rose'];
  return (
    <>
      <section className={`container ${s.intro}`}>
        <div>
          <p className="label">About Gleam</p>
          <h1 className={`display ${s.title}`}>Made to be handled.</h1>
        </div>
        <div className={s.introText}>
          <p className="lead">
            Gleam designs and supplies architectural hardware: the handles, locks, hinges and door controls that people
            touch every day without thinking about them.
          </p>
          <p>
            We think that is the point. A good lever should feel solid the first time and the ten-thousandth time. A
            hinge should never need oil. A lock should be simple to fit and simple to use. Everything in the catalogue
            is drawn, dimensioned and tested with that in mind.
          </p>
        </div>
      </section>

      <div className={`container ${s.band}`}>
        <div className={`tile ${s.bandArt}`}>
          <ProductArt art={lever.art} finish="AB" viewBox="30 110 360 180" />
        </div>
        <div className={s.bandArtLine}>
          <ProductArt art={lever.art} finish="AB" mode="line" viewBox="10 80 400 210" />
        </div>
      </div>

      <section className="section" aria-labelledby="process">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-head__index label">
                <span>01</span>
                <span>Process</span>
              </p>
              <h2 id="process" className="h2">
                From drawing
                <br />
                to door.
              </h2>
            </div>
            <p className="lead">Six steps between a sketch and a lever in your hand.</p>
          </div>
          <ol className={s.steps}>
            {steps.map(([name, text], i) => (
              <li key={name}>
                <span className={s.stepNo}>{String(i + 1).padStart(2, '0')}</span>
                <h3 className={s.stepName}>{name}</h3>
                <p className={s.stepText}>{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--alt" aria-labelledby="who">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="section-head__index label">
                <span>02</span>
                <span>Who we work with</span>
              </p>
              <h2 id="who" className="h2">
                From the drawing board
                <br />
                to the site.
              </h2>
            </div>
          </div>
          <ul className={s.people}>
            {people.map(([name, text]) => (
              <li key={name}>
                <h3 className={s.personName}>{name}</h3>
                <p className={s.personText}>{text}</p>
              </li>
            ))}
          </ul>
          <div className={s.actions}>
            <Link href="/contact" className="btn btn--primary">
              Talk to us <Arrow />
            </Link>
            <Link href="/products" className="link">
              Browse the catalogue
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
