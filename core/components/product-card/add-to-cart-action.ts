'use server';

import { BigCommerceGQLError } from '@bigcommerce/catalyst-client';
import { getTranslations } from 'next-intl/server';

import { addToOrCreateCart } from '~/lib/cart';
import { MissingCartError } from '~/lib/cart/error';

/*
 * Quick add-to-cart for product cards. Adds a single unit of the product by its
 * entity id. Products that require option selection should be configured on the
 * product detail page instead — this mirrors the existing compare/wishlist
 * quick-add behavior.
 */
export async function quickAddToCart(productId: string): Promise<{ error?: string }> {
  const t = await getTranslations('Components.ProductCard');
  const productEntityId = Number(productId);

  if (!Number.isInteger(productEntityId) || productEntityId <= 0) {
    return { error: t('addToCartError') };
  }

  try {
    await addToOrCreateCart({ lineItems: [{ productEntityId, quantity: 1 }] });

    return {};
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    if (error instanceof BigCommerceGQLError) {
      const message = error.errors.map(({ message: m }) => m).join(' ');

      return { error: message || t('addToCartError') };
    }

    if (error instanceof MissingCartError || error instanceof Error) {
      return { error: error.message };
    }

    return { error: t('addToCartError') };
  }
}
