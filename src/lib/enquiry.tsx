'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { FinishCode } from '@/data/finishes';

export interface EnquiryItem {
  slug: string;
  finish: FinishCode;
  size?: string;
  qty: number;
}

interface EnquiryState {
  items: EnquiryItem[];
  count: number;
  /** False until the saved list has been read from this browser. */
  ready: boolean;
  add: (item: EnquiryItem) => void;
  setQty: (index: number, qty: number) => void;
  remove: (index: number) => void;
  clear: () => void;
}

const KEY = 'gleam-enquiry-v1';
const EnquiryContext = createContext<EnquiryState | null>(null);

const same = (a: EnquiryItem, b: EnquiryItem) => a.slug === b.slug && a.finish === b.finish && a.size === b.size;

export function EnquiryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<EnquiryItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* storage unavailable: start with an empty list */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, loaded]);

  const add = useCallback((item: EnquiryItem) => {
    setItems((prev) => {
      const i = prev.findIndex((p) => same(p, item));
      if (i === -1) return [...prev, item];
      const next = [...prev];
      next[i] = { ...next[i], qty: next[i].qty + item.qty };
      return next;
    });
  }, []);

  const setQty = useCallback((index: number, qty: number) => {
    setItems((prev) => prev.map((p, i) => (i === index ? { ...p, qty: Math.max(1, Math.min(9999, qty || 1)) } : p)));
  }, []);

  const remove = useCallback((index: number) => setItems((prev) => prev.filter((_, i) => i !== index)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, count: items.length, ready: loaded, add, setQty, remove, clear }),
    [items, loaded, add, setQty, remove, clear],
  );

  return <EnquiryContext.Provider value={value}>{children}</EnquiryContext.Provider>;
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext);
  if (!ctx) throw new Error('useEnquiry must be used inside EnquiryProvider');
  return ctx;
}
