import { cache } from 'react';

import { revalidate } from '~/client/revalidate-target';
import { TAGS } from '~/client/tags';

/**
 * Discount derived from an automatic cart promotion that targets a single
 * product with a minimum-quantity condition (i.e. the promotions produced by
 * `scripts/bulk-pricing-to-promotions.ts`).
 */
export interface ProductPromotionDiscount {
  minimumQuantity: number;
  percentageAmount?: number;
  fixedAmount?: number;
}

type PromotionMap = Map<number, ProductPromotionDiscount>;

interface RawPromotionRule {
  action?: {
    cart_items?: {
      discount?: { percentage_amount?: string; fixed_amount?: string };
      items?: { products?: number[] };
    };
  };
  condition?: {
    cart?: {
      minimum_quantity?: number;
      items?: { products?: number[] };
    };
  };
}

interface RawPromotion {
  status?: string;
  redemption_type?: string;
  rules?: RawPromotionRule[];
}

interface PromotionsResponse {
  data?: RawPromotion[];
  meta?: { pagination?: { current_page: number; total_pages: number } };
}

const parseRuleDiscount = (rule: RawPromotionRule): ProductPromotionDiscount | null => {
  const cartItems = rule.action?.cart_items;
  const percentageAmount =
    cartItems?.discount?.percentage_amount != null
      ? Number(cartItems.discount.percentage_amount)
      : undefined;
  const fixedAmount =
    cartItems?.discount?.fixed_amount != null ? Number(cartItems.discount.fixed_amount) : undefined;

  if (percentageAmount == null && fixedAmount == null) {
    return null;
  }

  return {
    minimumQuantity: rule.condition?.cart?.minimum_quantity ?? 1,
    percentageAmount,
    fixedAmount,
  };
};

const collectPromotionDiscounts = (promotion: RawPromotion, promotions: PromotionMap): void => {
  if (promotion.status !== 'ENABLED' || promotion.redemption_type !== 'AUTOMATIC') {
    return;
  }

  for (const rule of promotion.rules ?? []) {
    const products = rule.action?.cart_items?.items?.products;

    if (!Array.isArray(products) || products.length === 0) {
      continue;
    }

    const discount = parseRuleDiscount(rule);

    if (!discount) {
      continue;
    }

    for (const productId of products) {
      // First promotion wins — we expect a single bulk promotion per product.
      if (!promotions.has(productId)) {
        promotions.set(productId, discount);
      }
    }
  }
};

/**
 * Fetch all ENABLED, AUTOMATIC promotions from the BigCommerce management API
 * and build a map of product entity id → per-product promotion discount.
 *
 * This runs on the server (build / ISR) and is cached per-render as well as via
 * the Next.js data cache (`revalidate`). Requires `BIGCOMMERCE_STORE_HASH` and a
 * management API token with the Marketing read scope — `BULK_PRICING_API_KEY`
 * (falling back to `BIGCOMMERCE_ACCESS_TOKEN`). If either is missing, an empty
 * map is returned so the storefront degrades gracefully.
 */
export const getProductPromotions = cache(async (): Promise<PromotionMap> => {
  const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
  const accessToken = process.env.BULK_PRICING_API_KEY ?? process.env.BIGCOMMERCE_ACCESS_TOKEN;

  const promotions: PromotionMap = new Map();

  if (!storeHash || !accessToken) {
    return promotions;
  }

  let page = 1;

  while (true) {
    const response = await fetch(
      `https://api.bigcommerce.com/stores/${storeHash}/v3/promotions?limit=250&page=${page}`,
      {
        headers: {
          'X-Auth-Token': accessToken,
          Accept: 'application/json',
        },
        next: { revalidate, tags: [TAGS.promotions] },
      },
    );

    if (!response.ok) {
      // Don't break the product page over a promotions fetch failure.
      break;
    }

    const json = (await response.json()) as PromotionsResponse;

    for (const promotion of json.data ?? []) {
      collectPromotionDiscounts(promotion, promotions);
    }

    const pagination = json.meta?.pagination;

    if (!pagination || pagination.current_page >= pagination.total_pages) {
      break;
    }

    page++;
  }

  return promotions;
});
