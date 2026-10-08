import Link from 'next/link';
import { ProductArt } from '@/components/art/ProductArt';
import { Arrow } from '@/components/Arrow';

export default function NotFound() {
  return (
    <div className="container" style={{ paddingBlock: 'clamp(56px, 8vw, 120px)', display: 'grid', gap: 24, justifyItems: 'start' }}>
      <p className="label">Error 404</p>
      <h1 className="display">This door is locked.</h1>
      <p className="lead">The page you were looking for has moved or does not exist.</p>
      <div style={{ width: 'min(100%, 420px)', aspectRatio: '2 / 1' }}>
        <ProductArt art={{ kind: 'plate', lever: 'round', plate: 'standard', lock: 'key' }} finish="SS" mode="line" viewBox="60 20 300 150" />
      </div>
      <Link href="/products" className="btn btn--primary">
        Go to the catalogue <Arrow />
      </Link>
    </div>
  );
}
