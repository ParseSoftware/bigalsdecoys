'use client';

import { clsx } from 'clsx';
import { Check, ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useTransition } from 'react';

import { toast } from '@/vibes/soul/primitives/toaster';
import { Link } from '~/components/link';

import { quickAddToCart } from './add-to-cart-action';

interface Props {
  productId: string;
  href: string;
  colorScheme?: 'light' | 'dark';
  addToCartLabel?: string;
  viewDetailsLabel?: string;
}

/*
 * "Add to Cart" + "View Details" buttons rendered inside the ProductCard when
 * `showButtons` is enabled. Add to Cart performs a quick add of a single unit;
 * View Details links to the product page.
 */
export function ProductCardActions({
  productId,
  href,
  colorScheme = 'light',
  addToCartLabel,
  viewDetailsLabel,
}: Props) {
  const t = useTranslations('Components.ProductCard');
  const [isPending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    startTransition(async () => {
      const result = await quickAddToCart(productId);

      if (result.error != null && result.error !== '') {
        toast.error(result.error);

        return;
      }

      toast.success(t('added'));
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    });
  };

  return (
    <div className="mt-auto flex flex-col gap-2 px-1 pt-2">
      <button
        aria-label={addToCartLabel ?? t('addToCart')}
        className={clsx(
          'flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors disabled:opacity-70',
          added ? 'bg-success text-white' : 'bg-primary text-white hover:bg-primary/90',
        )}
        disabled={isPending}
        onClick={handleAddToCart}
        type="button"
      >
        {added ? (
          <>
            <Check size={14} />
            {t('added')}
          </>
        ) : (
          <>
            <ShoppingCart size={14} />
            {addToCartLabel ?? t('addToCart')}
          </>
        )}
      </button>
      {href !== '#' && (
        <Link
          className={clsx(
            'flex items-center justify-center px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors',
            colorScheme === 'dark'
              ? 'border border-white/40 text-white hover:bg-white hover:text-foreground'
              : 'border border-foreground text-foreground hover:bg-foreground hover:text-background',
          )}
          href={href}
        >
          {viewDetailsLabel ?? t('viewDetails')}
        </Link>
      )}
    </div>
  );
}
