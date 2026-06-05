import { cn } from '../lib/cn';

export type SpinnerProps = { className?: string; label?: string };

// Accessible loading indicator (§4 a11y by default).
export function Spinner({ className, label = 'Loading' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent',
        className,
      )}
    />
  );
}
