import type { Metadata } from 'next';
import { EnquiryForm } from '@/components/contact/EnquiryForm';
import { productMap } from '@/data/products';
import { site } from '@/data/site';
import s from './page.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Send Gleam an enquiry, a door schedule or a request for finish samples.',
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product } = await searchParams;
  const about = product && productMap[product] ? product : undefined;

  return (
    <div className={`container ${s.page}`}>
      <header className={s.head}>
        <p className="label">Contact</p>
        <h1 className="display">Tell us about the door.</h1>
        <p className="lead">
          Send a question, a door schedule or your enquiry list. We reply with codes, finishes, prices and lead times.
        </p>
      </header>

      <div className={s.layout}>
        <EnquiryForm about={about} />

        <aside className={s.side}>
          <div className={s.block}>
            <h2 className="label">Call</h2>
            <a href={`tel:${site.phone.replace(/\s/g, '')}`} className={s.big}>
              {site.phone}
            </a>
            <p className={s.small}>{site.hours}</p>
          </div>
          <div className={s.block}>
            <h2 className="label">Email</h2>
            <a href={`mailto:${site.email}`} className={s.big}>
              {site.email}
            </a>
          </div>
          <div className={s.block}>
            <h2 className="label">Office</h2>
            <address className={s.address}>
              {site.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
          </div>
          <div className={s.block}>
            <h2 className="label">Useful to send</h2>
            <ul className={s.list}>
              <li>Door schedule or floor plan</li>
              <li>Door thickness and material</li>
              <li>Finish you have in mind</li>
              <li>Quantities and site timeline</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
