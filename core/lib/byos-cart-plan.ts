export interface ByosCartItem {
  entityId: string;
  productEntityId: number;
  variantEntityId: number | null;
  quantity: number;
}

interface Selection {
  productEntityId: number;
  quantity: number;
}

export function createByosCartPlan(existingItems: ByosCartItem[], selection: Selection[]) {
  const remaining = new Map(selection.map((item) => [item.productEntityId, item]));
  const updates: ByosCartItem[] = [];
  const removals: string[] = [];

  existingItems.forEach((item) => {
    const desired = remaining.get(item.productEntityId);

    if (!desired) {
      removals.push(item.entityId);

      return;
    }

    if (item.quantity !== desired.quantity) {
      updates.push({ ...item, quantity: desired.quantity });
    }

    remaining.delete(item.productEntityId);
  });

  return { updates, removals, additions: [...remaining.values()] };
}
