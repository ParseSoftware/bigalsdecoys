import { clsx } from 'clsx';
import { Truck } from 'lucide-react';
import { ReactNode } from 'react';

interface Props {
  /** Progress toward the free-shipping threshold, 0–100. */
  progress: number;
  qualified: boolean;
  message: ReactNode;
  className?: string;
}

/**
 * Free-shipping progress indicator for the cart. Shows how close the order is to
 * the free-shipping threshold, or a success state once it qualifies.
 */
export function FreeShippingProgress({ progress, qualified, message, className }: Props) {
  const clamped = Math.max(0, Math.min(100, progress));

  return (
    <div
      className={clsx(
        'mb-8 rounded-lg border border-contrast-100 bg-contrast-100/40 px-4 py-3.5',
        className,
      )}
    >
      <p className="flex items-center gap-2 text-sm font-medium text-foreground">
        <Truck className={clsx('h-4 w-4 shrink-0', qualified ? 'text-success' : 'text-primary')} />
        {message}
      </p>
      <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-contrast-100">
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-500',
            qualified ? 'bg-success' : 'bg-primary',
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
