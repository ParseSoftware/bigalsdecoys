'use client';

import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState, useTransition } from 'react';

import { Accordion, AccordionItem } from '@/vibes/soul/primitives/accordion';
import { Price, PriceLabel } from '@/vibes/soul/primitives/price-label';
import { toast } from '@/vibes/soul/primitives/toaster';
import { Image } from '~/components/image';
import { Link } from '~/components/link';
import { useRouter } from '~/i18n/routing';
import { getByosCategoryAnchor } from '~/lib/byos';

import { addByosItems } from './add-byos-items';
import { ByosProductImage } from './byos-product-image';

export interface ByosProduct {
  id: string;
  title: string;
  href: string;
  categoryIds: number[];
  image?: { src: string; alt: string };
  images: Array<{ src: string; alt: string }>;
  price?: Price;
  unitPrice?: number;
  currencyCode?: string;
  purchasable: boolean;
  requiresOptions: boolean;
}

interface ByosCategory {
  id: number;
  name: string;
}

interface Props {
  categories: ByosCategory[];
  description?: string;
  heroImage?: { src: string; alt: string };
  products: ByosProduct[];
}

const MAX_BYOS_QUANTITY = 9999;
const BASE_PRICE_TIER = { minimumQuantity: 0, unitPrice: 10 };
const PRICE_TIERS = [
  BASE_PRICE_TIER,
  { minimumQuantity: 24, unitPrice: 9 },
  { minimumQuantity: 72, unitPrice: 8 },
];

const formatCurrency = (value: number, currencyCode?: string) =>
  new Intl.NumberFormat(undefined, {
    currency: currencyCode ?? 'USD',
    style: 'currency',
  }).format(value);

export function ByosBuilder({ categories, description, heroImage, products }: Props) {
  const router = useRouter();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [isPending, startTransition] = useTransition();
  const selectedProducts = products.filter((product) => (quantities[product.id] ?? 0) > 0);
  const itemCount = selectedProducts.reduce(
    (total, product) => total + (quantities[product.id] ?? 0),
    0,
  );
  const subtotal = selectedProducts.reduce(
    (total, product) => total + (product.unitPrice ?? 0) * (quantities[product.id] ?? 0),
    0,
  );
  const currencyCode = selectedProducts.find((product) => product.currencyCode)?.currencyCode;
  const activeTier =
    PRICE_TIERS.findLast((tier) => itemCount >= tier.minimumQuantity) ?? BASE_PRICE_TIER;
  const nextTier = PRICE_TIERS.find((tier) => tier.minimumQuantity > itemCount);
  const itemsUntilNextTier = nextTier ? nextTier.minimumQuantity - itemCount : 0;
  const tierRange = nextTier ? nextTier.minimumQuantity - activeTier.minimumQuantity : 1;
  const progress = nextTier
    ? Math.min(((itemCount - activeTier.minimumQuantity) / tierRange) * 100, 100)
    : 100;
  const estimatedTotal = activeTier.unitPrice * itemCount;
  const estimatedSavings = Math.max(subtotal - estimatedTotal, 0);
  const backgroundImage = heroImage ?? products.find((product) => product.image)?.image;
  const categorizedProductIds = new Set(
    categories.flatMap((category) =>
      products
        .filter((product) => product.categoryIds.includes(category.id))
        .map((product) => product.id),
    ),
  );
  const productGroups = [
    ...categories
      .map((category) => ({
        id: category.id,
        name: category.name,
        products: products.filter((product) => product.categoryIds.includes(category.id)),
      }))
      .filter((category) => category.products.length > 0),
    {
      id: undefined,
      name: 'Other decoys',
      products: products.filter((product) => !categorizedProductIds.has(product.id)),
    },
  ].filter((category) => category.products.length > 0);

  const updateQuantity = (productId: string, nextQuantity: number) => {
    setQuantities((currentQuantities) => ({
      ...currentQuantities,
      [productId]: Math.max(0, Math.min(nextQuantity, MAX_BYOS_QUANTITY)),
    }));
  };

  const addSelectionToCart = () => {
    const items = selectedProducts.map((product) => ({
      productEntityId: Number(product.id),
      quantity: quantities[product.id] ?? 0,
    }));

    startTransition(async () => {
      const result = await addByosItems(items);

      if (result.error) {
        toast.error(result.error);

        return;
      }

      toast.success('Spread added to cart.');
      router.refresh();
    });
  };

  return (
    <section className="pb-28 lg:pb-10">
      <header className="relative isolate overflow-hidden bg-foreground text-white">
        {backgroundImage ? (
          <Image
            alt=""
            className="-z-20 object-cover opacity-45"
            fill
            preload
            sizes="100vw"
            src={backgroundImage.src}
          />
        ) : null}
        <div className="absolute inset-0 -z-10 bg-foreground/70" />
        <div className="mx-auto max-w-screen-2xl px-4 py-9 sm:px-6 lg:px-8 lg:py-11">
          <div>
            <p className="font-heading text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Spread builder / Your hunt, your way
            </p>
            <h1 className="mt-2 font-display text-4xl uppercase leading-none sm:text-5xl lg:text-6xl">
              Build your own spread.
            </h1>
            {description ? (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-screen-2xl gap-8 px-4 py-7 sm:px-6 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start lg:px-8">
        <div>
          <header className="flex items-end justify-between gap-4 border-b-2 border-foreground pb-4">
            <div>
              <p className="font-heading text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                Choose your decoys
              </p>
              <h2 className="mt-1 font-display text-2xl uppercase leading-none sm:text-3xl">
                Available for your spread
              </h2>
            </div>
            <p className="shrink-0 text-sm text-contrast-500">{products.length} options</p>
          </header>

          <Accordion
            className="divide-y divide-contrast-200"
            defaultValue={productGroups.map((group) => group.name)}
            type="multiple"
          >
            {productGroups.map((group) => (
              <AccordionItem
                className="border-b-0"
                id={group.id ? getByosCategoryAnchor(group.id) : undefined}
                key={group.name}
                title={`${group.name} (${group.products.length} options)`}
                value={group.name}
              >
                <div className="divide-y divide-contrast-200">
                  {group.products.map((product) => {
                    const quantity = quantities[product.id] ?? 0;
                    const canSelect = product.purchasable && !product.requiresOptions;

                    return (
                      <article
                        className="grid min-w-0 grid-cols-[7rem_minmax(0,1fr)] gap-x-4 py-4 sm:grid-cols-[9rem_minmax(0,1fr)_auto] sm:gap-x-5"
                        key={product.id}
                      >
                        <ByosProductImage
                          image={product.image}
                          images={product.images}
                          title={product.title}
                        />

                        <div className="min-w-0 pt-1">
                          <Link
                            className="font-heading text-xl font-semibold leading-tight hover:text-primary sm:text-2xl"
                            href={product.href}
                          >
                            {product.title}
                          </Link>
                        </div>
                        {product.price ? (
                          <PriceLabel
                            className="hidden shrink-0 pt-1 sm:block"
                            price={product.price}
                          />
                        ) : null}

                        {product.requiresOptions ? (
                          <div className="col-span-2 mt-3 flex items-center justify-between gap-4 sm:col-span-1 sm:col-start-2">
                            <Link
                              className="text-sm font-semibold text-primary underline underline-offset-4"
                              href={product.href}
                            >
                              Choose options
                            </Link>
                          </div>
                        ) : (
                          <div className="col-span-2 mt-3 flex items-center justify-between gap-4 sm:col-span-1 sm:col-start-2">
                            {product.price ? (
                              <PriceLabel className="sm:hidden" price={product.price} />
                            ) : (
                              <span />
                            )}
                            <div
                              className="inline-flex h-10 items-center border border-contrast-300"
                              role="group"
                            >
                              <button
                                aria-label={`Remove one ${product.title}`}
                                className="grid h-full w-10 place-items-center transition-colors hover:bg-contrast-100 disabled:cursor-not-allowed disabled:text-contrast-300"
                                disabled={!canSelect || quantity === 0}
                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                type="button"
                              >
                                <Minus aria-hidden="true" size={16} />
                              </button>
                              <input
                                aria-label={`${product.title} quantity`}
                                className="h-full w-14 border-x border-contrast-300 bg-transparent text-center text-sm font-semibold tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                disabled={!canSelect}
                                inputMode="numeric"
                                max={MAX_BYOS_QUANTITY}
                                min={0}
                                onChange={(event) => {
                                  const nextQuantity = Number(event.target.value);

                                  updateQuantity(
                                    product.id,
                                    Number.isFinite(nextQuantity) ? nextQuantity : 0,
                                  );
                                }}
                                type="number"
                                value={quantity}
                              />
                              <button
                                aria-label={`Add one ${product.title}`}
                                className="grid h-full w-10 place-items-center transition-colors hover:bg-contrast-100 disabled:cursor-not-allowed disabled:text-contrast-300"
                                disabled={!canSelect || quantity === MAX_BYOS_QUANTITY}
                                onClick={() => updateQuantity(product.id, quantity + 1)}
                                type="button"
                              >
                                <Plus aria-hidden="true" size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <aside className="fixed inset-x-0 bottom-0 z-20 flex max-h-[100vh-6rem] flex-col border-t-2 border-foreground bg-white p-4 shadow-[0_-8px_24px_rgb(0_0_0_/_0.12)] lg:sticky lg:top-6 lg:order-none lg:border lg:border-contrast-200 lg:p-5 lg:shadow-none">
          <div className="border-b-2 border-foreground pb-4">
            <div className="flex items-baseline justify-between gap-4 font-heading text-sm font-semibold uppercase tracking-[0.08em]">
              <span>{itemCount} decoys selected</span>
              <span className="text-green-700">${activeTier.unitPrice} each</span>
            </div>
            <div
              aria-label={`${itemCount} decoys selected at ${formatCurrency(activeTier.unitPrice, currencyCode)} each`}
              aria-valuemax={nextTier?.minimumQuantity ?? itemCount}
              aria-valuemin={0}
              aria-valuenow={itemCount}
              className="mt-3 h-1.5 overflow-hidden bg-contrast-200"
              role="progressbar"
            >
              <div
                className="h-full bg-primary transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-contrast-600 mt-3 text-sm leading-5">
              {nextTier
                ? `Add ${itemsUntilNextTier} more decoy${itemsUntilNextTier === 1 ? '' : 's'} to pay $${nextTier.unitPrice} each.`
                : 'You have unlocked the lowest per-decoy price.'}
            </p>
          </div>
          <div className="mt-4 hidden lg:flex lg:items-baseline lg:justify-between lg:border-b lg:border-contrast-200 lg:pb-4">
            <h2 className="font-display text-2xl uppercase">Your spread</h2>
            <span className="text-sm text-contrast-500">{itemCount} items</span>
          </div>
          <div className="min-h-12 grow">
            {selectedProducts.length === 0 ? (
              <p className="hidden py-6 text-sm leading-6 text-contrast-500 lg:block">
                Select decoys to start building your spread.
              </p>
            ) : (
              <ul className="hidden divide-y divide-contrast-200 lg:block">
                {selectedProducts.map((product) => (
                  <li
                    className="flex items-center justify-between gap-4 py-4 text-sm"
                    key={product.id}
                  >
                    <span className="min-w-0 font-semibold">{product.title}</span>
                    <span className="shrink-0 text-contrast-500">x{quantities[product.id]}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="lg:border-t-2 lg:border-foreground lg:pt-4">
            <div className="hidden items-center justify-between text-sm text-contrast-500 lg:flex">
              <span>Spread subtotal</span>
              <span>{formatCurrency(subtotal, currencyCode)}</span>
            </div>
            {estimatedSavings > 0 ? (
              <div className="hidden items-center justify-between pt-2 text-sm text-green-700 lg:flex">
                <span>Spread pricing savings</span>
                <span>-{formatCurrency(estimatedSavings, currencyCode)}</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between font-heading text-lg font-semibold lg:mt-4">
              <span className="uppercase">Your spread</span>
              <span>{formatCurrency(estimatedTotal, currencyCode)}</span>
            </div>
            <button
              className="mt-3 flex w-full items-center justify-center gap-2 bg-primary px-4 py-3 font-heading text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-contrast-300 lg:mt-5"
              disabled={itemCount === 0 || isPending}
              onClick={addSelectionToCart}
              type="button"
            >
              <ShoppingCart aria-hidden="true" size={17} />
              {isPending ? 'Adding to cart...' : 'Add spread to cart'}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
