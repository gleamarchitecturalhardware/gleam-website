import Image from 'next/image';

export function Logo({ className, priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Image
      src="/brand/gleam-logo.png"
      alt="Gleam Architectural Hardware"
      width={513}
      height={163}
      className={className}
      priority={priority}
      sizes="140px"
    />
  );
}
