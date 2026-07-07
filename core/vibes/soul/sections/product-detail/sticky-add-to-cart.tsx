'use client';

import { clsx } from 'clsx';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Price, PriceLabel } from '@/vibes/soul/primitives/price-label';
import { Image } from '~/components/image';

interface Props {
  title: string;
  image?: { src: string; alt: string };
  price?: Price;
  ctaLabel?: string;
  ctaDisabled?: boolean;
}

/**
 * Fixed "sticky" add-to-cart bar for the product detail page. It watches the main
 * add-to-cart CTA (marked with `data-product-detail-cta`) via an IntersectionObserver
 * and reveals itself once that CTA scrolls out of view. Clicking its button submits
 * the real product form (`data-product-detail-form`) so the selected options and
 * quantity are respected — no duplicated form state.
 */
export function StickyAddToCart({
  title,
  image,
  price,
  ctaLabel = 'Add to cart',
  ctaDisabled,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const cta = document.querySelector('[data-product-detail-cta]');

    if (!cta) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry ? !entry.isIntersecting : false);
      },
      { threshold: 0 },
    );

    observer.observe(cta);

    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    const form = document.querySelector<HTMLFormElement>('[data-product-detail-form]');

    form?.requestSubmit();
  };

  return (
    <div
      aria-hidden={!visible}
      className={clsx(
        'fixed inset-x-0 bottom-0 z-50 border-t border-contrast-100 bg-background shadow-[0_-6px_24px_rgba(0,0,0,0.10)] transition-transform duration-300',
        visible ? 'translate-y-0' : 'pointer-events-none translate-y-full',
      )}
    >
      <div className="mx-auto flex max-w-screen-xl items-center gap-4 px-4 py-3 @xl:px-6 @4xl:px-8">
        <div className="hidden min-w-0 flex-1 items-center gap-4 sm:flex">
          {image ? (
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded border border-contrast-100">
              <Image
                alt={image.alt}
                className="h-full w-full object-contain p-1"
                height={48}
                src={image.src}
                width={48}
              />
            </div>
          ) : null}
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-bold leading-tight text-foreground">
              {title}
            </p>
            {price != null && <PriceLabel className="text-sm" price={price} />}
          </div>
        </div>

        <button
          className="ml-auto flex shrink-0 items-center gap-2 bg-primary px-7 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={ctaDisabled}
          onClick={handleAddToCart}
          type="button"
        >
          <ShoppingCart size={16} />
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
