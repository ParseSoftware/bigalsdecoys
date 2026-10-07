'use server';

import { BigCommerceGQLError } from '@bigcommerce/catalyst-client';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import { addToOrCreateCart } from '~/lib/cart';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { MissingCartError } from '~/lib/cart/error';

const MAX_BYOS_QUANTITY = 9999;
const BYOS_AVAILABILITY_PAGE_SIZE = 50;

const ByosItemsSchema = z
  .array(
    z.object({
      productEntityId: z.number().int().positive(),
      quantity: z.number().int().positive().max(MAX_BYOS_QUANTITY),
    }),
  )
  .min(1);

const GetByosProductAvailabilityQuery = graphql(`
  query GetByosProductAvailabilityQuery($entityIds: [Int!], $first: Int) {
    site {
      products(entityIds: $entityIds, first: $first) {
        edges {
          node {
            entityId
            inventory {
              isInStock
            }
          }
        }
      }
    }
  }
`);

const getAvailableProductIds = async (entityIds: number[]) => {
  const availabilityPages = await Promise.all(
    Array.from({ length: Math.ceil(entityIds.length / BYOS_AVAILABILITY_PAGE_SIZE) }, (_, index) =>
      client.fetch({
        document: GetByosProductAvailabilityQuery,
        variables: {
          entityIds: entityIds.slice(
            index * BYOS_AVAILABILITY_PAGE_SIZE,
            (index + 1) * BYOS_AVAILABILITY_PAGE_SIZE,
          ),
          first: BYOS_AVAILABILITY_PAGE_SIZE,
        },
        fetchOptions: { cache: 'no-store' },
      }),
    ),
  );

  return new Set(
    availabilityPages.flatMap(({ data }) =>
      (data.site.products.edges ?? [])
        .map(({ node }) => node)
        .filter((product) => product.inventory.isInStock)
        .map((product) => product.entityId),
    ),
  );
};

export async function addByosItems(items: unknown): Promise<{ error?: string }> {
  const t = await getTranslations('Components.ProductCard');
  const parsedItems = ByosItemsSchema.safeParse(items);

  if (!parsedItems.success) {
    return { error: t('addToCartError') };
  }

  try {
    const entityIds = [...new Set(parsedItems.data.map((item) => item.productEntityId))];
    const availableProductIds = await getAvailableProductIds(entityIds);

    if (entityIds.some((entityId) => !availableProductIds.has(entityId))) {
      return { error: 'One or more selected decoys are out of stock.' };
    }

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
