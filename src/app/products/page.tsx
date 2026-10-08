import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProductBrowser } from '@/components/products/ProductBrowser';

export const metadata: Metadata = {
  title: 'Products',
  description:
    'The full Gleam catalogue: mortise handles, pull handles, digital locks, hinges, door closers, accessories, cabinet hardware and glass fittings.',
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // Reading the params renders the filtered list on the server, so the page arrives complete.
  await searchParams;
  return (
    <Suspense>
      <ProductBrowser />
    </Suspense>
  );
}
