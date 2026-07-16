import { graphql } from '~/client/graphql';

export const ProductViewedFragment = graphql(`
  fragment ProductViewedFragment on Product {
    entityId
    name
    brand {
      name
    }
    sku
    description
    plainTextDescription(characterLimit: 1200)
    path
    defaultImage {
      url: urlTemplate(lossy: true)
    }
    categories(first: 10) {
      edges {
        node {
          name
        }
      }
    }
    variants {
      edges {
        node {
          entityId
        }
      }
    }
  }
`);
