import Link from 'next/link';
import { categories } from '@/data/categories';
import { site } from '@/data/site';
import { Logo } from './Logo';
import s from './Footer.module.css';

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className="container">
        <div className={s.top}>
          <div className={s.brand}>
            <Link href="/" aria-label="Gleam Architectural Hardware, home">
              <Logo className={s.logo} />
            </Link>
            <p>
              Mortise handles, locks, hinges and door controls in solid brass and stainless steel, for
              architects, builders, dealers and homeowners.
            </p>
          </div>

          <div>
            <h2 className={s.head}>Products</h2>
            <ul className={s.list}>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/products?category=${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={s.head}>Company</h2>
            <ul className={s.list}>
              <li><Link href="/about">About Gleam</Link></li>
              <li><Link href="/finishes">Finishes and care</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/contact#enquiry">Enquiry list</Link></li>
            </ul>
          </div>

          <div>
            <h2 className={s.head}>Get in touch</h2>
            <address className={s.address}>
              {site.address.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </address>
            <ul className={s.list}>
              <li><a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a></li>
              <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            </ul>
          </div>
        </div>

        <div className={s.bottom}>
          <p>© {new Date().getFullYear()} {site.name}</p>
          <p>Product drawings are for illustration. Finish colours on screen are a guide; ask for a sample before you order.</p>
        </div>
      </div>
    </footer>
  );
}
