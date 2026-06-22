import { cn } from '@/lib/utils';

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
        <svg
          viewBox="0 0 32 32"
          className="h-6 w-6"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 19 L8 26 L13 7 L29 7"
            stroke="var(--color-primary)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 24 V12 H19.5 a3.5 3.5 0 0 1 0 7 H13 M18 19 L23 24"
            stroke="var(--color-foreground)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M25 11 q3 0 3 3 q-3 0 -3 -3 Z" fill="var(--color-primary)" />
        </svg>
      </div>
      {showText && (
        <span className="font-sans text-lg font-bold tracking-tight text-foreground">
          Raizal
        </span>
      )}
    </div>
  );
}
