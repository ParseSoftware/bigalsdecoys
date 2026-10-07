import { beforeEach, describe, expect, it, vi } from 'vitest';

interface FetchRequest {
  document: unknown;
  variables: { cartId?: string; entityIds?: number[] };
}

const mocks = vi.hoisted(() => ({
  fetch: vi.fn<(request: FetchRequest) => Promise<unknown>>(),
  getCartId: vi.fn(),
  getByosCategoryIds: vi.fn(),
}));

vi.mock('~/client', () => ({ client: { fetch: mocks.fetch } }));
vi.mock('~/auth', () => ({
  getSessionCustomerAccessToken: vi.fn(() => Promise.resolve(undefined)),
}));
vi.mock('~/lib/cart', () => ({ getCartId: mocks.getCartId, addToOrCreateCart: vi.fn() }));
vi.mock('~/lib/byos', () => ({ getByosCategoryIds: mocks.getByosCategoryIds }));
vi.mock('next-intl/server', () => ({ getTranslations: vi.fn() }));
vi.mock('~/app/[locale]/(default)/cart/_actions/remove-item', () => ({ removeItem: vi.fn() }));
vi.mock('~/app/[locale]/(default)/cart/_actions/update-quantity', () => ({
  updateQuantity: vi.fn(),
}));

import { getByosCartItems } from '~/app/[locale]/(default)/(faceted)/category/[slug]/_components/add-byos-items';

const cartItem = (productEntityId: number) => ({
  entityId: `line-${productEntityId}`,
  productEntityId,
  variantEntityId: null,
  quantity: 1,
  isMutable: true,
  parentEntityId: null,
  selectedOptions: [],
});

describe('loading existing BYOS carts', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.getCartId.mockResolvedValue('existing-cart');
    mocks.getByosCategoryIds.mockResolvedValue([150]);
  });

  it('batches populated carts, retains duplicates, and preserves ineligible lines', async () => {
    const items = Array.from({ length: 57 }, (_, index) => cartItem(index + 1));

    items.push({ ...cartItem(1), entityId: 'duplicate' });
    items.push({ ...cartItem(58), isMutable: false });
    mocks.fetch.mockImplementation(({ variables }) => {
      if (variables.cartId) {
        return Promise.resolve({
          data: { site: { cart: { lineItems: { physicalItems: items } } } },
        });
      }

      return Promise.resolve({
        data: {
          site: {
            products: {
              edges: (variables.entityIds ?? []).map((entityId) => ({
                node: {
                  entityId,
                  showCartAction: true,
                  inventory: { isInStock: entityId !== 1 },
                  categories: { edges: [{ node: { entityId: entityId === 57 ? 200 : 150 } }] },
                  productOptions: { edges: entityId === 56 ? [{ node: { entityId: 1 } }] : [] },
                },
              })),
            },
          },
        },
      });
    });

    const result = await getByosCartItems();

    expect(result).toHaveLength(56);
    expect(result.filter((item) => item.productEntityId === 1)).toHaveLength(2);
    expect(result.some((item) => [56, 57, 58].includes(item.productEntityId))).toBe(false);
    expect(mocks.fetch).toHaveBeenCalledTimes(3);
    expect(JSON.stringify(mocks.fetch.mock.calls[0]?.[0].document)).not.toContain(
      'catalogProductWithOptionSelections',
    );
    expect(mocks.fetch.mock.calls[1]?.[0].variables.entityIds).toHaveLength(50);
    expect(mocks.fetch.mock.calls[2]?.[0].variables.entityIds).toHaveLength(7);
  });

  it('loads an expired cart as empty without requesting catalog products', async () => {
    mocks.fetch.mockResolvedValue({ data: { site: { cart: null } } });

    expect(await getByosCartItems()).toEqual([]);
    expect(mocks.fetch).toHaveBeenCalledTimes(1);
  });

  it('does not treat a failed cart read as an empty selection', async () => {
    mocks.fetch.mockRejectedValue(new Error('Cart API failed'));

    await expect(getByosCartItems()).rejects.toThrow('Cart API failed');
  });
});
