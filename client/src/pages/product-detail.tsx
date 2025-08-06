import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Heart, ShoppingBag, Star, Minus, Plus, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@shared/schema";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const productId = params?.id;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      return response.json();
    },
    enabled: !!productId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-12 animate-pulse">
            <div>
              <div className="aspect-square bg-gray-300 rounded-xl mb-4"></div>
              <div className="grid grid-cols-4 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gray-300 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-6 bg-gray-300 rounded w-1/3"></div>
              <div className="h-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {error ? 'Shopify Configuration Required' : 'Product Not Found'}
          </h1>
          <p className="text-gray-600 mb-4">
            {error 
              ? 'This application requires Shopify credentials to load products. Please configure your Shopify store URL and Storefront API access token.'
              : 'The product you\'re looking for doesn\'t exist in the Shopify store.'
            }
          </p>
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left mb-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Required Environment Variables:</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• SHOPIFY_STORE_URL</li>
                <li>• SHOPIFY_STOREFRONT_ACCESS_TOKEN</li>
              </ul>
            </div>
          )}
          <Link href="/products">
            <Button data-testid="button-back-to-products">Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.imageUrls.length > 0 ? product.imageUrls : [product.imageUrl];
  const isOnSale = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      imageUrl: product.imageUrl,
      quantity,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-neutral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-primary" data-testid="link-breadcrumb-home">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary" data-testid="link-breadcrumb-products">Products</Link>
          <span>/</span>
          <span className="text-primary" data-testid="text-breadcrumb-current">{product.name}</span>
        </div>

        {/* Back button */}
        <Link href="/products">
          <Button variant="outline" className="mb-8" data-testid="button-back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-white">
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="img-product-main"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${product.name} view ${index + 1}`}
                    className={`w-full aspect-square object-cover rounded-lg cursor-pointer border-2 transition-colors ${
                      selectedImage === index ? 'border-accent' : 'border-transparent hover:border-accent'
                    }`}
                    onClick={() => setSelectedImage(index)}
                    data-testid={`img-product-thumbnail-${index}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-2" data-testid="text-product-name">
                  {product.name}
                </h1>
                <p className="text-gray-600" data-testid="text-product-category">
                  {product.subcategory || product.category}
                </p>
              </div>
              <Button variant="outline" size="icon" data-testid="button-share">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Badges */}
            <div className="flex gap-2 mb-4">
              {product.tags.includes("new") && (
                <Badge className="bg-secondary text-white" data-testid="badge-new">New</Badge>
              )}
              {isOnSale && (
                <Badge className="bg-red-500 text-white" data-testid="badge-sale">Sale</Badge>
              )}
              <Badge variant="outline" data-testid="badge-stock">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </Badge>
            </div>

            {/* Price and Rating */}
            <div className="flex items-center space-x-6 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-4xl font-bold text-primary" data-testid="text-product-price">
                  ${product.price}
                </span>
                {isOnSale && (
                  <span className="text-xl text-gray-400 line-through" data-testid="text-product-original-price">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm">
                <div className="flex text-secondary mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="font-medium mr-2" data-testid="text-product-rating">{product.rating}</span>
                <span className="text-gray-600">
                  (<span data-testid="text-product-reviews">{product.reviewCount}</span> reviews)
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="font-semibold mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed" data-testid="text-product-description">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      className={`${selectedSize === size ? 'bg-accent border-accent' : ''}`}
                      onClick={() => setSelectedSize(size)}
                      data-testid={`button-size-${size}`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Color</h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      className={`${selectedColor === color ? 'bg-accent border-accent' : ''}`}
                      onClick={() => setSelectedColor(color)}
                      data-testid={`button-color-${color.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center space-x-3">
                <span className="font-medium">Quantity:</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  data-testid="button-decrease-quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium" data-testid="text-quantity">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  data-testid="button-increase-quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="outline" className="text-gray-600 hover:text-accent" data-testid="button-add-to-wishlist">
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                className="w-full bg-primary text-white hover:bg-gray-800 py-3"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                data-testid="button-add-to-cart"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button 
                className="w-full bg-accent text-white hover:bg-pink-600 py-3"
                disabled={product.stock === 0}
                data-testid="button-buy-now"
              >
                Buy Now
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">SKU:</span>
                  <span className="ml-2 text-gray-600" data-testid="text-product-sku">{product.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div>
                  <span className="font-medium">Category:</span>
                  <span className="ml-2 text-gray-600" data-testid="text-product-full-category">{product.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
