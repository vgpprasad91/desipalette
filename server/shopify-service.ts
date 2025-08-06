import { shopifyClient, hasShopifyCredentials, PRODUCTS_QUERY, PRODUCT_BY_ID_QUERY, CHECKOUT_CREATE_MUTATION, COLLECTIONS_QUERY } from './shopify-client';

// Re-export hasShopifyCredentials for use in other modules
export { hasShopifyCredentials };
import { Product, InsertOrder } from '@shared/schema';

// Transform Shopify product data to our schema
function transformShopifyProduct(shopifyProduct: any): Product {
  const images = shopifyProduct.images?.edges?.map((edge: any) => edge.node.url) || [];
  const variants = shopifyProduct.variants?.edges || [];
  
  // Extract size and color options
  const sizes = new Set<string>();
  const colors = new Set<string>();
  
  variants.forEach((variant: any) => {
    variant.node.selectedOptions?.forEach((option: any) => {
      if (option.name.toLowerCase() === 'size') {
        sizes.add(option.value);
      } else if (option.name.toLowerCase() === 'color') {
        colors.add(option.value);
      }
    });
  });

  const minPrice = shopifyProduct.priceRange?.minVariantPrice?.amount || '0';
  const compareAtPrice = shopifyProduct.compareAtPriceRange?.minVariantPrice?.amount;

  return {
    id: shopifyProduct.id,
    name: shopifyProduct.title,
    description: shopifyProduct.description || '',
    price: minPrice,
    originalPrice: compareAtPrice || null,
    category: shopifyProduct.productType || 'General',
    subcategory: shopifyProduct.vendor || null,
    imageUrl: images[0] || '',
    imageUrls: images,
    rating: '4.5', // Default rating since Shopify doesn't provide this
    reviewCount: Math.floor(Math.random() * 200) + 10, // Mock review count
    stock: shopifyProduct.totalInventory || 0,
    isActive: shopifyProduct.availableForSale,
    tags: shopifyProduct.tags || [],
    sizes: Array.from(sizes),
    colors: Array.from(colors),
    createdAt: new Date(shopifyProduct.createdAt),
  };
}

export class ShopifyService {
  async getProducts(category?: string, search?: string): Promise<Product[]> {
    if (!hasShopifyCredentials() || !shopifyClient) {
      throw new Error('Shopify credentials not configured');
    }

    let query = '';
    if (category) {
      query += `product_type:${category}`;
    }
    if (search) {
      query += query ? ` AND title:*${search}*` : `title:*${search}*`;
    }

    try {
      const response = await shopifyClient.request(PRODUCTS_QUERY, {
        variables: {
          first: 50,
          query: query || undefined,
        },
      });

      const products = response.data?.products?.edges?.map((edge: any) => 
        transformShopifyProduct(edge.node)
      ) || [];

      return products;
    } catch (error) {
      console.error('Error fetching products from Shopify:', error);
      throw new Error('Failed to fetch products from Shopify');
    }
  }

  async getProduct(id: string): Promise<Product | null> {
    if (!hasShopifyCredentials() || !shopifyClient) {
      throw new Error('Shopify credentials not configured');
    }

    try {
      // Convert our internal ID format to Shopify GID if needed
      const shopifyId = id.startsWith('gid://') ? id : `gid://shopify/Product/${id}`;
      
      const response = await shopifyClient.request(PRODUCT_BY_ID_QUERY, {
        variables: { id: shopifyId },
      });

      if (!response.data?.product) {
        return null;
      }

      return transformShopifyProduct(response.data.product);
    } catch (error) {
      console.error('Error fetching product from Shopify:', error);
      return null;
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.getProducts(category);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.getProducts(undefined, query);
  }

  async createCheckout(orderData: InsertOrder, cartItems: any[]): Promise<{ checkoutUrl: string; checkoutId: string }> {
    if (!hasShopifyCredentials() || !shopifyClient) {
      throw new Error('Shopify credentials not configured');
    }

    try {
      // Transform cart items to Shopify line items format
      const lineItems = cartItems.map(item => ({
        variantId: item.variantId || `gid://shopify/ProductVariant/${item.productId}`,
        quantity: item.quantity,
      }));

      const response = await shopifyClient.request(CHECKOUT_CREATE_MUTATION, {
        variables: {
          input: {
            lineItems,
            email: orderData.customerEmail,
            shippingAddress: {
              firstName: orderData.customerName.split(' ')[0],
              lastName: orderData.customerName.split(' ').slice(1).join(' '),
              address1: orderData.shippingAddress,
              phone: orderData.customerPhone,
            },
          },
        },
      });

      const checkout = response.data?.checkoutCreate?.checkout;
      const errors = response.data?.checkoutCreate?.checkoutUserErrors;

      if (errors && errors.length > 0) {
        throw new Error(`Checkout creation failed: ${errors[0].message}`);
      }

      if (!checkout) {
        throw new Error('Failed to create checkout');
      }

      return {
        checkoutUrl: checkout.webUrl,
        checkoutId: checkout.id,
      };
    } catch (error) {
      console.error('Error creating Shopify checkout:', error);
      throw new Error('Failed to create checkout');
    }
  }

  async getCollections(): Promise<any[]> {
    if (!hasShopifyCredentials() || !shopifyClient) {
      throw new Error('Shopify credentials not configured');
    }

    try {
      const response = await shopifyClient.request(COLLECTIONS_QUERY, {
        variables: { first: 20 },
      });

      return response.data?.collections?.edges?.map((edge: any) => ({
        id: edge.node.id,
        title: edge.node.title,
        handle: edge.node.handle,
        description: edge.node.description,
        image: edge.node.image?.url,
      })) || [];
    } catch (error) {
      console.error('Error fetching collections from Shopify:', error);
      throw new Error('Failed to fetch collections');
    }
  }
}

export const shopifyService = new ShopifyService();