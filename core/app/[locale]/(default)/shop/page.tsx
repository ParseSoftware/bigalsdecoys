import type { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';
import { createLoader, SearchParams } from 'nuqs/server';
import { cache } from 'react';

import { Streamable } from '@/vibes/soul/lib/streamable';
import { createCompareLoader } from '@/vibes/soul/primitives/compare-drawer/loader';
import { ProductsListSection } from '@/vibes/soul/sections/products-list-section';
import { getFilterParsers } from '@/vibes/soul/sections/products-list-section/filter-parsers';
import { getSessionCustomerAccessToken } from '~/auth';
import { facetsTransformer } from '~/data-transformers/facets-transformer';
import { pageInfoTransformer } from '~/data-transformers/page-info-transformer';
import { productCardTransformer } from '~/data-transformers/product-card-transformer';
import { getPreferredCurrencyCode } from '~/lib/currency';

import { getCompareProducts } from '../(faceted)/fetch-compare-products';
import { fetchFacetedSearch } from '../(faceted)/fetch-faceted-search';
import { getSearchPageData } from '../(faceted)/search/page-data';
import { MAX_COMPARE_LIMIT } from '../compare/page-data';

const compareLoader = createCompareLoader();

const createShopSearchParamsLoader = cache(async (customerAccessToken?: string) => {
  const shopSearch = await fetchFacetedSearch({}, undefined, customerAccessToken);
  const shopFacets = shopSearch.facets.items;
  const transformedShopFacets = await facetsTransformer({
    refinedFacets: shopFacets,
    allFacets: shopFacets,
    searchParams: {},
  });
  const shopFilters = transformedShopFacets.filter((facet) => facet != null);
  const filterParsers = getFilterParsers(shopFilters);

  // If there are no filters, return `null`, since calling `createLoader` with an empty
  // object will throw the following cryptic error:
  //
  // ```
  // Error: [nuqs] Empty search params cache. Search params can't be accessed in Layouts.
  //   See https://err.47ng.com/NUQS-500
  // ```
  if (Object.keys(filterParsers).length === 0) {
    return null;
  }

  return createLoader(filterParsers);
});

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'Faceted.Shop' });

  return {
    title: t('title'),
  };
}

export default async function ShopPage(props: Props) {
  const { locale } = await props.params;
  const customerAccessToken = await getSessionCustomerAccessToken();

  setRequestLocale(locale);

  const t = await getTranslations('Faceted');

  const { settings } = await getSearchPageData();

  const showRating = Boolean(settings?.reviews.enabled && settings.display.showProductRating);

  const productComparisonsEnabled =
    settings?.storefront.catalog?.productComparisonsEnabled ?? false;

  const streamableFacetedSearch = Streamable.from(async () => {
    const searchParams = await props.searchParams;
    const currencyCode = await getPreferredCurrencyCode();

    const loadSearchParams = await createShopSearchParamsLoader(customerAccessToken);
    const parsedSearchParams = loadSearchParams?.(searchParams) ?? {};

    const search = await fetchFacetedSearch(
      {
        ...searchParams,
        ...parsedSearchParams,
      },
      currencyCode,
      customerAccessToken,
    );

    return search;
  });

  const streamableProducts = Streamable.from(async () => {
    const format = await getFormatter();

    const search = await streamableFacetedSearch;
    const products = search.products.items;

    const { defaultOutOfStockMessage, showOutOfStockMessage, showBackorderMessage } =
      settings?.inventory ?? {};

    return productCardTransformer(
      products,
      format,
      showOutOfStockMessage ? defaultOutOfStockMessage : undefined,
      showBackorderMessage,
    );
  });

  const streamableTotalCount = Streamable.from(async () => {
    const format = await getFormatter();
    const search = await streamableFacetedSearch;

    return format.number(search.products.collectionInfo?.totalItems ?? 0);
  });

  const streamablePagination = Streamable.from(async () => {
    const search = await streamableFacetedSearch;

    return pageInfoTransformer(search.products.pageInfo);
  });

  const streamableFilters = Streamable.from(async () => {
    const searchParams = await props.searchParams;

    const loadSearchParams = await createShopSearchParamsLoader(customerAccessToken);
    const parsedSearchParams = loadSearchParams?.(searchParams) ?? {};

    const shopSearch = await fetchFacetedSearch({}, undefined, customerAccessToken);
    const refinedSearch = await streamableFacetedSearch;

    const allFacets = shopSearch.facets.items;
    const refinedFacets = refinedSearch.facets.items;

    const transformedFacets = await facetsTransformer({
      refinedFacets,
      allFacets,
      searchParams: { ...searchParams, ...parsedSearchParams },
    });

    return transformedFacets.filter((facet) => facet != null);
  });

  const streamableCompareProducts = Streamable.from(async () => {
    const searchParams = await props.searchParams;

    if (!productComparisonsEnabled) {
      return [];
    }

    const { compare } = compareLoader(searchParams);

    const compareIds = { entityIds: compare ? compare.map((id: string) => Number(id)) : [] };

    const products = await getCompareProducts(compareIds, customerAccessToken);

    return products.map((product) => ({
      id: product.entityId.toString(),
      title: product.name,
      image: product.defaultImage
        ? { src: product.defaultImage.url, alt: product.defaultImage.altText }
        : undefined,
      href: product.path,
    }));
  });

  return (
    <ProductsListSection
      breadcrumbs={[
        { label: t('Shop.Breadcrumbs.home'), href: '/' },
        { label: t('Shop.Breadcrumbs.shop'), href: '/shop' },
      ]}
      compareLabel={t('Compare.compare')}
      compareProducts={streamableCompareProducts}
      emptyStateSubtitle={t('Shop.Empty.subtitle')}
      emptyStateTitle={t('Shop.Empty.title')}
      filterLabel={t('FacetedSearch.filters')}
      filters={streamableFilters}
      filtersPanelTitle={t('FacetedSearch.filters')}
      maxCompareLimitMessage={t('Compare.maxCompareLimit')}
      maxItems={MAX_COMPARE_LIMIT}
      paginationInfo={streamablePagination}
      products={streamableProducts}
      rangeFilterApplyLabel={t('FacetedSearch.Range.apply')}
      removeLabel={t('Compare.remove')}
      resetFiltersLabel={t('FacetedSearch.resetFilters')}
      showCompare={productComparisonsEnabled}
      showRating={showRating}
      sortDefaultValue="featured"
      sortLabel={t('SortBy.sortBy')}
      sortOptions={[
        { value: 'featured', label: t('SortBy.featuredItems') },
        { value: 'newest', label: t('SortBy.newestItems') },
        { value: 'best_selling', label: t('SortBy.bestSellingItems') },
        { value: 'a_to_z', label: t('SortBy.aToZ') },
        { value: 'z_to_a', label: t('SortBy.zToA') },
        { value: 'best_reviewed', label: t('SortBy.byReview') },
        { value: 'lowest_price', label: t('SortBy.priceAscending') },
        { value: 'highest_price', label: t('SortBy.priceDescending') },
        { value: 'relevance', label: t('SortBy.relevance') },
      ]}
      sortParamName="sort"
      title={t('Shop.title')}
      totalCount={streamableTotalCount}
    />
  );
}
