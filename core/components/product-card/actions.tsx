'use client';

import { clsx } from 'clsx';
import { Check, ShoppingCart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type ReactNode, useState, useTransition } from 'react';

import { toast } from '@/vibes/soul/primitives/toaster';
import { Link } from '~/components/link';

import { quickAddToCart } from './add-to-cart-action';

interface Props {
  productId: string;
  href: string;
  colorScheme?: 'light' | 'dark';
  purchasable?: boolean;
  requiresOptions?: boolean;
  addToCartLabel?: string;
  viewDetailsLabel?: string;
}

/*
 * "Add to Cart" + "View Details" buttons rendered inside the ProductCard unless
 * `hideButtons` is set. Add to Cart performs a quick add of a single unit. When
 * the product requires options it links to the product page instead, and when
 * the product is not purchasable the quick-add button is disabled.
 */
export function ProductCardActions({
  productId,
  href,
  colorScheme = 'light',
  purchasable = true,
  requiresOptions = false,
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

  const primaryButtonClasses =
    'flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors';

  const addToCartClasses = clsx(
    primaryButtonClasses,
    !purchasable && 'cursor-not-allowed bg-contrast-100 text-contrast-400',
    purchasable && added && 'bg-success text-white',
    purchasable && !added && 'bg-primary text-white hover:bg-primary/90 disabled:opacity-70',
  );

  let addToCartContent: ReactNode;

  if (!purchasable) {
    addToCartContent = t('unavailable');
  } else if (added) {
    addToCartContent = (
      <>
        <Check size={14} />
        {t('added')}
      </>
    );
  } else {
    addToCartContent = (
      <>
        <ShoppingCart size={14} />
        {addToCartLabel ?? t('addToCart')}
      </>
    );
  }

  return (
    <div className="mt-auto flex flex-col gap-2 px-1 pt-2">
      {requiresOptions && href !== '#' ? (
        <Link
          className={clsx(primaryButtonClasses, 'bg-primary text-white hover:bg-primary/90')}
          href={href}
        >
          <ShoppingCart size={14} />
          {t('chooseOptions')}
        </Link>
      ) : (
        <button
          aria-label={addToCartLabel ?? t('addToCart')}
          className={addToCartClasses}
          disabled={isPending || !purchasable}
          onClick={handleAddToCart}
          type="button"
        >
          {addToCartContent}
        </button>
      )}
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
