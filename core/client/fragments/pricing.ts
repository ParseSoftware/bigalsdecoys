import { graphql } from '../graphql';

export const PricingFragment = graphql(`
  fragment PricingFragment on Product {
    pricesIncludingTax: prices(currencyCode: $currencyCode, includeTax: true) {
      price {
        value
        currencyCode
      }
      basePrice {
        value
        currencyCode
      }
      retailPrice {
        value
        currencyCode
      }
      salePrice {
        value
        currencyCode
      }
      priceRange {
        min {
          value
          currencyCode
        }
        max {
          value
          currencyCode
        }
      }
    }
    pricesExcludingTax: prices(currencyCode: $currencyCode, includeTax: false) {
      price {
        value
        currencyCode
      }
      basePrice {
        value
        currencyCode
      }
      retailPrice {
        value
        currencyCode
      }
      salePrice {
        value
        currencyCode
      }
      priceRange {
        min {
          value
          currencyCode
        }
        max {
          value
          currencyCode
        }
      }
    }
  }
`);

export const BulkPricingFragment = graphql(`
  fragment BulkPricingFragment on Product {
    prices(currencyCode: $currencyCode) {
      price {
        value
        currencyCode
      }
      bulkPricing {
        __typename
        minimumQuantity
        maximumQuantity
        ... on BulkPricingFixedPriceDiscount {
          price
        }
        ... on BulkPricingPercentageDiscount {
          percentOff
        }
        ... on BulkPricingRelativePriceDiscount {
          priceAdjustment
        }
      }
    }
  }
`);
