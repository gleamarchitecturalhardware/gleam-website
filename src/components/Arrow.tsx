export function Arrow({ className = 'arrow', dir = 'right' }: { className?: string; dir?: 'right' | 'left' | 'down' }) {
  const rotate = dir === 'left' ? 180 : dir === 'down' ? 90 : 0;
  return (
    <svg className={className} viewBox="0 0 14 10" fill="none" aria-hidden="true" style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}>
      <path d="M0 5h12.5M8.5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
