/* eslint-disable complexity */
import { getTranslations } from 'next-intl/server';
import { z } from 'zod';

import {
  fetchFacetedSearch,
  PublicSearchParamsSchema,
  PublicToPrivateParams,
} from '~/app/[locale]/(default)/(faceted)/fetch-faceted-search';
import { ExistingResultType } from '~/client/util';

const SALE_CUSTOM_FIELD_NAME = 'Sale';
const SALE_CUSTOM_FIELD_VALUE = 'Yes';
const SALE_FILTER_PARAM_NAME = `attr_${SALE_CUSTOM_FIELD_NAME}`;

const isSaleFilterSelected = (filters: ReturnType<typeof PublicToPrivateParams.parse>['filters']) =>
  filters.productAttributes?.some(
    (attr) =>
      attr.attribute === SALE_CUSTOM_FIELD_NAME && attr.values.includes(SALE_CUSTOM_FIELD_VALUE),
  ) === true;

export const facetsTransformer = async ({
  refinedFacets,
  allFacets,
  searchParams,
}: {
  refinedFacets: ExistingResultType<typeof fetchFacetedSearch>['facets']['items'];
  allFacets: ExistingResultType<typeof fetchFacetedSearch>['facets']['items'];
  searchParams: z.input<typeof PublicSearchParamsSchema>;
}) => {
  const t = await getTranslations('Faceted.FacetedSearch.Facets');
  const { filters } = PublicToPrivateParams.parse(searchParams);
  const saleFilterSelected = isSaleFilterSelected(filters);

  const syntheticSaleFilter = {
    type: 'toggle-group' as const,
    paramName: SALE_FILTER_PARAM_NAME,
    label: t('onSaleLabel'),
    defaultCollapsed: false,
    options: [
      {
        label: t('onSaleLabel'),
        value: SALE_CUSTOM_FIELD_VALUE,
      },
    ],
  };

  const transformedFacets = allFacets.map((facet) => {
    const refinedFacet = refinedFacets.find((f) => f.displayName === facet.displayName);
    const isSaleProductAttributeFilter =
      facet.__typename === 'ProductAttributeSearchFilter' &&
      facet.filterKey === SALE_CUSTOM_FIELD_NAME;

    if (refinedFacet == null && !(isSaleProductAttributeFilter && saleFilterSelected)) {
      return null;
    }

    if (facet.__typename === 'CategorySearchFilter') {
      const refinedCategorySearchFilter =
        refinedFacet?.__typename === 'CategorySearchFilter' ? refinedFacet : null;

      return {
        type: 'toggle-group' as const,
        paramName: 'categoryIn',
        label: facet.displayName,
        defaultCollapsed: facet.isCollapsedByDefault,
        options: facet.categories.map((category) => {
          const refinedCategory = refinedCategorySearchFilter?.categories.find(
            (c) => c.entityId === category.entityId,
          );
          const isSelected = filters.categoryEntityIds?.includes(category.entityId) === true;
          const disabled = refinedCategory == null && !isSelected;
          const productCountLabel = disabled ? '' : ` (${category.productCount})`;
          const label = facet.displayProductCount
            ? `${category.name}${productCountLabel}`
            : category.name;

          return {
            label,
            value: category.entityId.toString(),
            disabled,
          };
        }),
      };
    }

    if (facet.__typename === 'BrandSearchFilter') {
      const refinedBrandSearchFilter =
        refinedFacet?.__typename === 'BrandSearchFilter' ? refinedFacet : null;

      return {
        type: 'toggle-group' as const,
        paramName: 'brand',
        label: facet.displayName,
        defaultCollapsed: facet.isCollapsedByDefault,
        options: facet.brands.map((brand) => {
          const refinedBrand = refinedBrandSearchFilter?.brands.find(
            (b) => b.entityId === brand.entityId,
          );
          const isSelected = filters.brandEntityIds?.includes(brand.entityId) === true;
          const disabled = refinedBrand == null && !isSelected;
          const productCountLabel = disabled ? '' : ` (${brand.productCount})`;
          const label = facet.displayProductCount
            ? `${brand.name}${productCountLabel}`
            : brand.name;

          return {
            label,
            value: brand.entityId.toString(),
            disabled,
          };
        }),
      };
    }

    if (facet.__typename === 'ProductAttributeSearchFilter') {
      const refinedProductAttributeSearchFilter =
        refinedFacet?.__typename === 'ProductAttributeSearchFilter' ? refinedFacet : null;
      const isSaleFilter = facet.filterKey === SALE_CUSTOM_FIELD_NAME;

      return {
        type: 'toggle-group' as const,
        paramName: `attr_${facet.filterKey}`,
        label: isSaleFilter ? t('onSaleLabel') : facet.displayName,
        defaultCollapsed: facet.isCollapsedByDefault,
        options: facet.attributes.map((attribute) => {
          const refinedAttribute = refinedProductAttributeSearchFilter?.attributes.find(
            (a) => a.value === attribute.value,
          );

          const isSelected =
            filters.productAttributes?.some(
              (attr) => attr.attribute === facet.filterKey && attr.values.includes(attribute.value),
            ) === true;

          const disabled = refinedAttribute == null && !isSelected;
          const productCountLabel = disabled ? '' : ` (${attribute.productCount})`;
          const valueLabel =
            isSaleFilter && attribute.value === SALE_CUSTOM_FIELD_VALUE
              ? t('onSaleLabel')
              : attribute.value;
          const label = facet.displayProductCount
            ? `${valueLabel}${productCountLabel}`
            : valueLabel;

          return {
            label,
            value: attribute.value,
            disabled,
          };
        }),
      };
    }

    if (facet.__typename === 'RatingSearchFilter') {
      const refinedRatingSearchFilter =
        refinedFacet?.__typename === 'RatingSearchFilter' ? refinedFacet : null;
      const isSelected = filters.rating?.minRating != null;

      return {
        type: 'rating' as const,
        paramName: 'minRating',
        label: facet.displayName,
        disabled: refinedRatingSearchFilter == null && !isSelected,
        defaultCollapsed: facet.isCollapsedByDefault,
      };
    }

    if (facet.__typename === 'PriceSearchFilter') {
      const refinedPriceSearchFilter =
        refinedFacet?.__typename === 'PriceSearchFilter' ? refinedFacet : null;
      const isSelected = filters.price?.minPrice != null || filters.price?.maxPrice != null;

      return {
        type: 'range' as const,
        minParamName: 'minPrice',
        maxParamName: 'maxPrice',
        label: facet.displayName,
        min: facet.selected?.minPrice ?? undefined,
        max: facet.selected?.maxPrice ?? undefined,
        disabled: refinedPriceSearchFilter == null && !isSelected,
        defaultCollapsed: facet.isCollapsedByDefault,
      };
    }

    if (facet.freeShipping) {
      const refinedFreeShippingSearchFilter =
        refinedFacet?.__typename === 'OtherSearchFilter' && refinedFacet.freeShipping
          ? refinedFacet
          : null;
      const isSelected = filters.isFreeShipping === true;

      return {
        type: 'toggle-group' as const,
        paramName: `shipping`,
        label: t('freeShippingLabel'),
        defaultCollapsed: facet.isCollapsedByDefault,
        options: [
          {
            label: t('freeShippingLabel'),
            value: 'free_shipping',
            disabled: refinedFreeShippingSearchFilter == null && !isSelected,
          },
        ],
      };
    }

    if (facet.isFeatured) {
      return null;
      // uncomment below to show isFeatured filter in UI
      /**
      const refinedIsFeaturedSearchFilter =
        refinedFacet.__typename === 'OtherSearchFilter' && refinedFacet.isFeatured
          ? refinedFacet
          : null;
      const isSelected = filters.isFeatured === true;

      return {
        type: 'toggle-group' as const,
        paramName: `isFeatured`,
        label: t('isFeaturedLabel'),
        defaultCollapsed: facet.isCollapsedByDefault,
        options: [
          {
            label: t('isFeaturedLabel'),
            value: 'on',
            disabled: refinedIsFeaturedSearchFilter == null && !isSelected,
          },
        ],
      };
      */
    }

    if (facet.isInStock) {
      const refinedIsInStockSearchFilter =
        refinedFacet?.__typename === 'OtherSearchFilter' && refinedFacet.isInStock
          ? refinedFacet
          : null;
      const isSelected = filters.hideOutOfStock === true;

      return {
        type: 'toggle-group' as const,
        paramName: `stock`,
        label: t('inStockLabel'),
        defaultCollapsed: facet.isCollapsedByDefault,
        options: [
          {
            label: t('inStockLabel'),
            value: 'in_stock',
            disabled: refinedIsInStockSearchFilter == null && !isSelected,
          },
        ],
      };
    }

    return null;
  });

  const hasSaleFilter = transformedFacets.some(
    (facet) => facet?.type === 'toggle-group' && facet.paramName === SALE_FILTER_PARAM_NAME,
  );

  return hasSaleFilter ? transformedFacets : [...transformedFacets, syntheticSaleFilter];
};
