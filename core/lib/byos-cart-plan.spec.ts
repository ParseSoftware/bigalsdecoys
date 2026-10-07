import { describe, expect, it } from 'vitest';

import { createByosCartPlan } from './byos-cart-plan';

const existing = [
  { entityId: 'first', productEntityId: 1, variantEntityId: 10, quantity: 3 },
  { entityId: 'duplicate', productEntityId: 1, variantEntityId: 10, quantity: 2 },
  { entityId: 'removed', productEntityId: 2, variantEntityId: 20, quantity: 4 },
];

describe('BYOS cart reconciliation', () => {
  it('sets exact quantities, removes omitted products and duplicates, and adds new products', () => {
    expect(
      createByosCartPlan(existing, [
        { productEntityId: 1, quantity: 6 },
        { productEntityId: 3, quantity: 2 },
      ]),
    ).toEqual({
      updates: [{ ...existing[0], quantity: 6 }],
      removals: ['duplicate', 'removed'],
      additions: [{ productEntityId: 3, quantity: 2 }],
    });
  });

  it('removes the entire eligible spread for an empty selection', () => {
    expect(createByosCartPlan(existing, [])).toEqual({
      updates: [],
      removals: ['first', 'duplicate', 'removed'],
      additions: [],
    });
  });

  it('does not mutate an unchanged selection', () => {
    expect(createByosCartPlan(existing.slice(0, 1), [{ productEntityId: 1, quantity: 3 }])).toEqual(
      {
        updates: [],
        removals: [],
        additions: [],
      },
    );
  });
});
