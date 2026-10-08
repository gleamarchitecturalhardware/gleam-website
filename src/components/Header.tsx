'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { categories } from '@/data/categories';
import { productMap, products, productsIn } from '@/data/products';
import { useEnquiry } from '@/lib/enquiry';
import { ProductArt } from './art/ProductArt';
import { Arrow } from './Arrow';
import { Logo } from './Logo';
import s from './Header.module.css';

const links = [
  { href: '/finishes', label: 'Finishes' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const { count, ready } = useEnquiry();
  const [mega, setMega] = useState(false);
  const [menu, setMenu] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMega(false);
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = menu ? 'hidden' : '';
    return () => {
      document.documentElement.style.overflow = '';
    };
  }, [menu]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMega(false);
        setMenu(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const open = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMega(true);
  };
  const close = () => {
    closeTimer.current = setTimeout(() => setMega(false), 120);
  };

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={s.header}>
      <div className={`container ${s.bar}`}>
        <Link href="/" className={s.logo} aria-label="Gleam Architectural Hardware, home">
          <Logo priority />
        </Link>

        <nav className={s.nav} aria-label="Main">
          <div className={s.item} onMouseEnter={open} onMouseLeave={close} onFocus={open} onBlur={close}>
            <Link
              href="/products"
              className={`${s.link} ${active('/products') ? s.current : ''}`}
              aria-expanded={mega}
              aria-haspopup="true"
            >
              Products
            </Link>
            <div className={`${s.mega} ${mega ? s.megaOpen : ''}`}>
              <div className={`container ${s.megaInner}`}>
                <div className={s.megaIntro}>
                  <p className="label">Catalogue</p>
                  <p className={s.megaTitle}>{products.length} products in {categories.length} categories</p>
                  <Link href="/products" className="link">
                    View all products <Arrow />
                  </Link>
                </div>
                <ul className={s.megaGrid}>
                  {categories.map((c) => {
                    const cover = productMap[c.cover];
                    return (
                      <li key={c.slug}>
                        <Link href={`/products?category=${c.slug}`} className={s.megaLink}>
                          <span className={`tile ${s.megaThumb}`}>
                            <ProductArt art={cover.art} finish={cover.finishes[0]} shadow={false} />
                          </span>
                          <span>
                            <span className={s.megaName}>{c.name}</span>
                            <span className={s.megaCount}>{productsIn(c.slug).length} products</span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`${s.link} ${active(l.href) ? s.current : ''}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className={s.actions}>
          <Link href="/contact#enquiry" className={s.enquiry}>
            <span className={s.enquiryText}>Enquiry list</span>
            <span className={s.count} aria-label={ready ? `${count} items` : undefined}>
              {ready ? count : ''}
            </span>
          </Link>
          <button
            type="button"
            className={s.menuBtn}
            aria-expanded={menu}
            aria-controls="mobile-menu"
            onClick={() => setMenu((m) => !m)}
          >
            <span className={s.burger} data-open={menu} aria-hidden="true">
              <i />
              <i />
            </span>
            {menu ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`${s.mobile} ${menu ? s.mobileOpen : ''}`} hidden={!menu}>
        <div className="container">
          <p className="label">Products</p>
          <ul className={s.mobileCats}>
            <li>
              <Link href="/products">All products</Link>
            </li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/products?category=${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
          <ul className={s.mobileLinks}>
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/contact#enquiry">Enquiry list ({count})</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
