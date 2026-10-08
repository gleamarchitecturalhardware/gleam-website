'use client';

import Link from 'next/link';
import { useState } from 'react';
import { finishMap } from '@/data/finishes';
import { productMap } from '@/data/products';
import { site } from '@/data/site';
import { useEnquiry } from '@/lib/enquiry';
import { ProductArt } from '../art/ProductArt';
import s from './EnquiryForm.module.css';

const roles = ['Architect', 'Interior designer', 'Builder or contractor', 'Dealer', 'Homeowner', 'Other'];

export function EnquiryForm({ about }: { about?: string }) {
  const { items, setQty, remove, clear } = useEnquiry();
  const asked = about ? productMap[about] : undefined;
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState(
    asked ? `I would like more information about ${asked.name} (${asked.code}).` : '',
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? '').trim();
    const optional = (label: string, key: string) => (get(key) ? `${label}: ${get(key)}` : null);
    const lines = [
      `Name: ${get('name')}`,
      optional('Company', 'company'),
      `I am: ${get('role')}`,
      `Phone: ${get('phone')}`,
      optional('Email', 'email'),
      optional('City', 'city'),
      '',
      get('message') || null,
    ].filter((l): l is string => l !== null);

    if (items.length) {
      lines.push('', 'Enquiry list:');
      items.forEach((i) => {
        const p = productMap[i.slug];
        if (!p) return;
        lines.push(`- ${i.qty} × ${p.name} ${p.code}, ${finishMap[i.finish].name}${i.size ? `, ${i.size}` : ''}`);
      });
    }

    const subject = `Enquiry from ${get('name')}${get('company') ? `, ${get('company')}` : ''}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
    setSent(true);
  };

  return (
    <div className={s.wrap}>
      <section id="enquiry" className={s.list} aria-labelledby="list-title">
        <div className={s.listHead}>
          <h2 id="list-title" className={s.title}>
            Your enquiry list
          </h2>
          {items.length > 0 && (
            <button type="button" className={s.clear} onClick={clear}>
              Clear list
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <p className={s.empty}>
            Nothing here yet. Open any product, choose a finish and size, and add it to the list. It stays saved in this
            browser until you send it.{' '}
            <Link href="/products" className="link">
              Browse products
            </Link>
          </p>
        ) : (
          <ul className={s.items}>
            {items.map((item, i) => {
              const p = productMap[item.slug];
              if (!p) return null;
              return (
                <li key={`${item.slug}-${item.finish}-${item.size ?? ''}`} className={s.item}>
                  <Link href={`/products/${p.slug}`} className={`tile ${s.thumb}`} aria-label={p.name}>
                    <ProductArt art={p.art} finish={item.finish} shadow={false} />
                  </Link>
                  <div className={s.itemInfo}>
                    <Link href={`/products/${p.slug}`} className={s.itemName}>
                      {p.name}
                    </Link>
                    <span className={s.itemMeta}>
                      {p.code} · {finishMap[item.finish].name}
                      {item.size ? ` · ${item.size}` : ''}
                    </span>
                  </div>
                  <label className={s.qty}>
                    <span className="visually-hidden">Quantity for {p.name}</span>
                    <input
                      type="number"
                      min={1}
                      max={9999}
                      value={item.qty}
                      onChange={(e) => setQty(i, Number(e.target.value))}
                    />
                  </label>
                  <button type="button" className={s.remove} onClick={() => remove(i)} aria-label={`Remove ${p.name}`}>
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <form className={s.form} onSubmit={onSubmit}>
        <h2 className={s.title}>Your details</h2>
        <div className={s.grid}>
          <label className={s.field}>
            <span>Name *</span>
            <input name="name" required autoComplete="name" />
          </label>
          <label className={s.field}>
            <span>Company or practice</span>
            <input name="company" autoComplete="organization" />
          </label>
          <label className={s.field}>
            <span>I am *</span>
            <select name="role" required defaultValue="">
              <option value="" disabled>
                Choose one
              </option>
              {roles.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className={s.field}>
            <span>City</span>
            <input name="city" autoComplete="address-level2" />
          </label>
          <label className={s.field}>
            <span>Phone *</span>
            <input name="phone" type="tel" required autoComplete="tel" />
          </label>
          <label className={s.field}>
            <span>Email</span>
            <input name="email" type="email" autoComplete="email" />
          </label>
          <label className={`${s.field} ${s.full}`}>
            <span>Message</span>
            <textarea
              name="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about the project: number of doors, timeline, and anything you would like samples of."
            />
          </label>
        </div>
        <div className={s.submit}>
          <button type="submit" className="btn btn--primary">
            Send enquiry{items.length ? ` with ${items.length} ${items.length === 1 ? 'item' : 'items'}` : ''}
          </button>
          <p className={s.hint}>
            {sent
              ? 'Your email app should have opened with the enquiry filled in. If it did not, write to us at ' + site.email + '.'
              : 'This opens your email app with the enquiry filled in, ready to send.'}
          </p>
        </div>
      </form>
    </div>
  );
}
