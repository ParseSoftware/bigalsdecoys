import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { Product, ProductCard } from '@/vibes/soul/primitives/product-card';
import { Link } from '~/components/link';

const SALE_HREF = '/shop?attr_Sale=Yes';

interface Props {
  products: Streamable<Product[]>;
}

/*
 * Homepage sale section. Pairs a bold branded copy panel with a grid of real
 * on-sale products (sourced via the same `attr_Sale=Yes` filter the nav uses).
 * The whole section hides itself when there are no sale products.
 */
export async function SaleSection({ products }: Props) {
  const t = await getTranslations('Home.Sale');

  return (
    <Stream fallback={null} value={products}>
      {(saleProducts) =>
        saleProducts.length > 0 && (
          <section className="bg-ink text-background">
            <div className="mx-auto max-w-screen-2xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
              <div className="grid items-center gap-10 lg:grid-cols-[1fr_2fr] lg:gap-12">
                <div>
                  <span className="inline-block border border-primary/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                    {t('badge')}
                  </span>
                  <h2 className="mt-6 font-display uppercase leading-[0.88] text-white [font-size:clamp(2rem,4vw,3.75rem)]">
                    {t('title')}
                  </h2>
                  <p className="mt-5 max-w-md text-sm leading-relaxed text-contrast-200">
                    {t('description')}
                  </p>
                  <Link
                    className="mt-8 inline-flex items-center gap-2 bg-primary px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary/90"
                    href={SALE_HREF}
                  >
                    {t('cta')}
                    <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                  {saleProducts.slice(0, 3).map((product) => (
                    <ProductCard colorScheme="dark" key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )
      }
    </Stream>
  );
}
