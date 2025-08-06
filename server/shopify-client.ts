import { createStorefrontApiClient } from '@shopify/storefront-api-client';

const SHOPIFY_STORE_URL = process.env.SHOPIFY_STORE_URL;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export const shopifyClient = SHOPIFY_STORE_URL && SHOPIFY_STOREFRONT_ACCESS_TOKEN
  ? createStorefrontApiClient({
      storeDomain: SHOPIFY_STORE_URL,
      apiVersion: '2024-01',
      accessToken: SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    })
  : null;

export const hasShopifyCredentials = () => {
  return Boolean(SHOPIFY_STORE_URL && SHOPIFY_STOREFRONT_ACCESS_TOKEN);
};

// GraphQL queries for Shopify Storefront API
export const PRODUCTS_QUERY = `
  query Products($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          tags
          productType
          vendor
          createdAt
          updatedAt
          availableForSale
          totalInventory
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                quantityAvailable
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const PRODUCT_BY_ID_QUERY = `
  query ProductById($id: ID!) {
    product(id: $id) {
      id
      title
      description
      handle
      tags
      productType
      vendor
      createdAt
      updatedAt
      availableForSale
      totalInventory
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
            quantityAvailable
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  }
`;

export const CHECKOUT_CREATE_MUTATION = `
  mutation CheckoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
        totalPrice {
          amount
          currencyCode
        }
        subtotalPrice {
          amount
          currencyCode
        }
        totalTax {
          amount
          currencyCode
        }
        lineItems(first: 250) {
          edges {
            node {
              id
              title
              quantity
              unitPrice {
                amount
                currencyCode
              }
              totalPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
      checkoutUserErrors {
        field
        message
      }
    }
  }
`;

export const COLLECTIONS_QUERY = `
  query Collections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
          products(first: 10) {
            edges {
              node {
                id
                title
              }
            }
          }
        }
      }
    }
  }
`;