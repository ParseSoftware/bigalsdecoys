'use server';

import { BigCommerceGQLError } from '@bigcommerce/catalyst-client';
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import { removeItem } from '~/app/[locale]/(default)/cart/_actions/remove-item';
import { updateQuantity } from '~/app/[locale]/(default)/cart/_actions/update-quantity';
import { getSessionCustomerAccessToken } from '~/auth';
import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { getByosCategoryIds } from '~/lib/byos';
import { createByosCartPlan } from '~/lib/byos-cart-plan';
import { addToOrCreateCart, getCartId } from '~/lib/cart';
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
  .refine((items) => new Set(items.map((item) => item.productEntityId)).size === items.length);

const GetByosCartQuery = graphql(`
  query GetByosCartQuery($cartId: String!) {
    site {
      cart(entityId: $cartId) {
        lineItems {
          physicalItems {
            entityId
            productEntityId
            variantEntityId
            quantity
            isMutable
            parentEntityId
            selectedOptions {
              entityId
            }
            catalogProductWithOptionSelections {
              categories(first: 50) {
                edges {
                  node {
                    entityId
                  }
                }
              }
              productOptions(first: 1) {
                edges {
                  node {
                    entityId
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`);

export async function getByosCartItems() {
  const cartId = await getCartId();

  if (!cartId) {
    return [];
  }

  const customerAccessToken = await getSessionCustomerAccessToken();
  const [categoryIds, { data }] = await Promise.all([
    getByosCategoryIds(customerAccessToken),
    client.fetch({
      document: GetByosCartQuery,
      variables: { cartId },
      customerAccessToken,
      fetchOptions: { cache: 'no-store' },
    }),
  ]);

  return (data.site.cart?.lineItems.physicalItems ?? []).filter((item) => {
    const product = item.catalogProductWithOptionSelections;

    return (
      item.isMutable &&
      !item.parentEntityId &&
      item.selectedOptions.length === 0 &&
      product != null &&
      (product.productOptions.edges?.length ?? 0) === 0 &&
      (product.categories.edges ?? []).some(({ node }) => categoryIds.includes(node.entityId))
    );
  });
}

const GetByosProductAvailabilityQuery = graphql(`
  query GetByosProductAvailabilityQuery($entityIds: [Int!], $first: Int) {
    site {
      products(entityIds: $entityIds, first: $first) {
        edges {
          node {
            entityId
            showCartAction
            categories(first: 50) {
              edges {
                node {
                  entityId
                }
              }
            }
            productOptions(first: 1) {
              edges {
                node {
                  entityId
                }
              }
            }
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
  const customerAccessToken = await getSessionCustomerAccessToken();
  const categoryIds = await getByosCategoryIds(customerAccessToken);
  const availabilityPages = await Promise.all(
    Array.from({ length: Math.ceil(entityIds.length / BYOS_AVAILABILITY_PAGE_SIZE) }, (_, index) =>
      client.fetch({
        document: GetByosProductAvailabilityQuery,
        customerAccessToken,
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
        .filter(
          (product) =>
            product.inventory.isInStock &&
            product.showCartAction &&
            (product.productOptions.edges?.length ?? 0) === 0 &&
            (product.categories.edges ?? []).some(({ node }) =>
              categoryIds.includes(node.entityId),
            ),
        )
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
      return { error: 'One or more selected decoys are unavailable for your spread.' };
    }

    const existingItems = await getByosCartItems();
    const plan = createByosCartPlan(existingItems, parsedItems.data);

    await plan.updates.reduce(async (previous, item) => {
      await previous;
      await updateQuantity({
        lineItemEntityId: item.entityId,
        productEntityId: item.productEntityId,
        variantEntityId: item.variantEntityId,
        quantity: item.quantity,
      });
    }, Promise.resolve());

    if (plan.additions.length > 0) {
      await addToOrCreateCart({ lineItems: plan.additions });
    }

    await plan.removals.reduce(async (previous, lineItemEntityId) => {
      await previous;
      await removeItem({ lineItemEntityId });
    }, Promise.resolve());

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
