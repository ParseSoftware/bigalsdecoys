import { cache } from 'react';

import { client } from '~/client';
import { graphql } from '~/client/graphql';
import { revalidate } from '~/client/revalidate-target';

const ContactRouteQuery = graphql(`
  query ContactRouteQuery($path: String!) {
    site {
      route(path: $path) {
        node {
          __typename
          ... on ContactPage {
            entityId
            contactFields
          }
        }
      }
    }
  }
`);

export interface ContactPageData {
  entityId: number;
  contactFields: string[];
}

// Resolves the BigCommerce ContactPage backing the custom /contact route so we can
// reuse the storefront submitContactUs flow (which requires a pageEntityId).
export const getContactPageData = cache(
  async (path = '/contact'): Promise<ContactPageData | null> => {
    const { data } = await client.fetch({
      document: ContactRouteQuery,
      variables: { path },
      fetchOptions: { next: { revalidate } },
    });

    const node = data.site.route.node;

    if (node?.__typename !== 'ContactPage') {
      return null;
    }

    return {
      entityId: node.entityId,
      contactFields: node.contactFields,
    };
  },
);
