import { cache } from 'react';

import { client } from '~/client';
import { graphql } from '~/client/graphql';

export const BYOS_CATEGORY_SLUG = 'build-your-spread';

export const getByosCategoryAnchor = (categoryId: number) => `byos-category-${categoryId}`;

interface CategoryTreeItem {
  entityId: number;
  path: string;
}

const GetRootCategoriesQuery = graphql(`
  query GetRootCategoriesQuery {
    site {
      categoryTree {
        entityId
        path
      }
    }
  }
`);

const GetCategoryChildrenQuery = graphql(`
  query GetCategoryChildrenQuery($entityId: Int!) {
    site {
      categoryTree(rootEntityId: $entityId) {
        children {
          entityId
          path
        }
      }
    }
  }
`);

export const isByosCategory = (path: string) =>
  path.replace(/\/$/, '').split('/').at(-1) === BYOS_CATEGORY_SLUG;

const getCategoryChildren = cache(async (entityId: number, customerAccessToken?: string) => {
  const { data } = await client.fetch({
    document: GetCategoryChildrenQuery,
    variables: { entityId },
    customerAccessToken,
    fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate: 300 } },
  });

  return data.site.categoryTree[0]?.children ?? [];
});

const collectCategoryIds = async (
  category: CategoryTreeItem,
  customerAccessToken?: string,
): Promise<number[]> => {
  if (isByosCategory(category.path)) {
    return [];
  }

  const children = await getCategoryChildren(category.entityId, customerAccessToken);
  const childCategoryIds = await Promise.all(
    children.map((child) => collectCategoryIds(child, customerAccessToken)),
  );

  return [category.entityId, ...childCategoryIds.flat()];
};

export const getOrdinaryCategoryIds = cache(async (customerAccessToken?: string) => {
  const { data } = await client.fetch({
    document: GetRootCategoriesQuery,
    customerAccessToken,
    fetchOptions: customerAccessToken ? { cache: 'no-store' } : { next: { revalidate: 300 } },
  });

  const categoryIds = await Promise.all(
    data.site.categoryTree.map((category) => collectCategoryIds(category, customerAccessToken)),
  );

  return categoryIds.flat();
});

export const isByosEnabled = () =>
  process.env.NODE_ENV !== 'production' || process.env.VERCEL_ENV === 'preview';

export const shouldShowByosNavigation = isByosEnabled;
