import { ResultOf } from 'gql.tada';
import { getFormatter } from 'next-intl/server';

import { BulkPricingFragment } from '~/client/fragments/pricing';
import { ExistingResultType } from '~/client/util';

export interface BulkPricingTier {
  label: string;
  price: string;
  discount?: string;
}

export const bulkPricingTransformer = (
  prices: ResultOf<typeof BulkPricingFragment>['prices'],
  format: ExistingResultType<typeof getFormatter>,
): BulkPricingTier[] => {
  if (!prices || prices.bulkPricing.length === 0) {
    return [];
  }

  const { currencyCode } = prices.price;
  const basePrice = prices.price.value;

  const formatCurrency = (value: number) =>
    format.number(value, { style: 'currency', currency: currencyCode });

  return prices.bulkPricing.map((tier) => {
    const label =
      tier.maximumQuantity != null
        ? `${tier.minimumQuantity} - ${tier.maximumQuantity}`
        : `${tier.minimumQuantity}+`;

    switch (tier.__typename) {
      case 'BulkPricingFixedPriceDiscount':
        return {
          label,
          price: formatCurrency(tier.price),
        };

      case 'BulkPricingPercentageDiscount':
        return {
          label,
          price: formatCurrency(basePrice * (1 - tier.percentOff / 100)),
          discount: format.number(tier.percentOff / 100, { style: 'percent' }),
        };

      case 'BulkPricingRelativePriceDiscount':
        return {
          label,
          price: formatCurrency(basePrice - tier.priceAdjustment),
          discount: formatCurrency(tier.priceAdjustment),
        };

      default:
        return {
          label,
          price: formatCurrency(basePrice),
        };
    }
  });
};
