'use server';

import { BigCommerceGQLError } from '@bigcommerce/catalyst-client';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import { addToOrCreateCart } from '~/lib/cart';
import { MissingCartError } from '~/lib/cart/error';

const MAX_BYOS_QUANTITY = 9999;

const ByosItemsSchema = z
  .array(
    z.object({
      productEntityId: z.number().int().positive(),
      quantity: z.number().int().positive().max(MAX_BYOS_QUANTITY),
    }),
  )
  .min(1);

export async function addByosItems(items: unknown): Promise<{ error?: string }> {
  const t = await getTranslations('Components.ProductCard');
  const parsedItems = ByosItemsSchema.safeParse(items);

  if (!parsedItems.success) {
    return { error: t('addToCartError') };
  }

  try {
    await addToOrCreateCart({ lineItems: parsedItems.data });

    return {};
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    if (error instanceof BigCommerceGQLError) {
      const message = error.errors.map(({ message: itemMessage }) => itemMessage).join(' ');

      return { error: message || t('addToCartError') };
    }

    if (error instanceof MissingCartError || error instanceof Error) {
      return { error: error.message };
    }

    return { error: t('addToCartError') };
  }
}
