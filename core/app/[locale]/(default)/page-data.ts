import { cache } from 'react';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';
import { FeaturedProductsCarouselFragment } from '~/components/featured-products-carousel/fragment';
import { FeaturedProductsListFragment } from '~/components/featured-products-list/fragment';
import { FooterFragment, FooterSectionsFragment } from '~/components/footer/fragment';
import { CurrencyCode, HeaderFragment, HeaderLinksFragment } from '~/components/header/fragment';

export const LayoutQuery = graphql(
  `
    query LayoutQuery {
      site {
        ...HeaderFragment
        ...FooterFragment
      }
    }
  `,
  [HeaderFragment, FooterFragment],
);

const GiftCertificatesEnabledFragment = graphql(`
  fragment GiftCertificatesEnabledFragment on Settings {
    giftCertificates(currencyCode: $currencyCode) {
      isEnabled
    }
  }
`);

export const GetLinksAndSectionsQuery = graphql(
  `
    query GetLinksAndSectionsQuery($currencyCode: currencyCode) {
      site {
        settings {
          ...GiftCertificatesEnabledFragment
        }
        ...HeaderLinksFragment
        ...FooterSectionsFragment
      }
    }
  `,
  [HeaderLinksFragment, FooterSectionsFragment, GiftCertificatesEnabledFragment],
);

const HomePageQuery = graphql(
  `
    query HomePageQuery($currencyCode: currencyCode) {
      site {
        featuredProducts(first: 12) {
          edges {
            node {
              ...FeaturedProductsListFragment
            }
          }
        }
        newestProducts(first: 12) {
          edges {
            node {
              ...FeaturedProductsCarouselFragment
            }
          }
        }
        settings {
          inventory {
            defaultOutOfStockMessage
            showOutOfStockMessage
            showBackorderMessage
          }
          newsletter {
            showNewsletterSignup
          }
          tax {
            plp
          }
        }
      }
    }
  `,
  [FeaturedProductsCarouselFragment, FeaturedProductsListFragment],
);

const CategoryTreeQuery = graphql(`
  query CategoryTreeQuery {
    site {
      categoryTree {
        name
        path
        image {
          urlTemplate
          altText
        }
      }
    }
  }
`);

export interface CategoryTreeItem {
  name: string;
  path: string;
  image: { urlTemplate: string; altText: string } | null;
}

export const getCategoryTree = cache(async (): Promise<CategoryTreeItem[]> => {
  const { data } = await client.fetch({
    document: CategoryTreeQuery,
    fetchOptions: { next: { revalidate } },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return data.site.categoryTree as CategoryTreeItem[];
});

export const getPageData = cache(
  async (currencyCode?: CurrencyCode, customerAccessToken?: string) => {
    const { data } = await client.fetch({
      document: HomePageQuery,
      customerAccessToken,
      variables: { currencyCode },
      fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate } },
    });

    return data;
  },
);
