'use client';

import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { useEffect, useRef } from 'react';

import { PricingFragment } from '~/client/fragments/pricing';
import { FragmentOf } from '~/client/graphql';
import { useKlaviyoTracker } from '~/components/klaviyo/use-klaviyo-tracker';
import { TaxDisplay } from '~/data-transformers/prices-transformer';
import { pickPricesForTaxDisplay } from '~/lib/tax-pricing';

import { ProductViewedFragment } from './product-viewed/fragment';

interface Props {
  product: FragmentOf<typeof ProductViewedFragment> & FragmentOf<typeof PricingFragment>;
  taxDisplay?: TaxDisplay | null;
}

export function KlaviyoProductViewed({ product, taxDisplay }: Props) {
  const fired = useRef(false);
  const track = useKlaviyoTracker();

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    const categories = removeEdgesAndNodes(product.categories).map((c) => c.name);
    const prices = pickPricesForTaxDisplay(product, taxDisplay);

    const item = {
      Name: product.name,
      ProductID: product.entityId.toString(),
      ImageURL: product.defaultImage?.url ?? '',
      URL: window.location.href,
      Brand: product.brand?.name ?? '',
      Categories: categories,
      Price: prices?.price.value.toString() ?? '',
      CompareAtPrice: prices?.retailPrice?.value.toString() ?? '',
    };

    track(
      ['track', 'Viewed Product', item],
      [
        'trackViewedItem',
        {
          Title: item.Name,
          ItemId: item.ProductID,
          Categories: item.Categories,
          ImageUrl: item.ImageURL,
          Url: item.URL,
          Metadata: {
            Brand: item.Brand,
            Price: item.Price,
            CompareAtPrice: item.CompareAtPrice,
          },
        },
      ],
    );
  }, [product, track]);

  return null;
}
