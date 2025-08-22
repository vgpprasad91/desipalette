import { useState } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Heart, ShoppingBag, Star, Minus, Plus, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@shared/schema";
import { formatINR } from "@/lib/utils";

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid md:grid-cols-2 gap-14 animate-pulse">
            <div>
              <div className="aspect-square bg-muted rounded-2xl mb-4 border border-border"></div>
              <div className="grid grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-muted rounded-lg border border-border"></div>
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="h-20 bg-muted rounded"></div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground" data-testid="link-breadcrumb-home">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-foreground" data-testid="link-breadcrumb-products">Products</Link>
          <span>/</span>
          <span className="text-foreground" data-testid="text-breadcrumb-current">{product.name}</span>
        </div>

        {/* Back link */}
        <Link href="/products">
          <span className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </span>
        </Link>

        <div className="grid md:grid-cols-2 gap-14">
          {/* Product Images */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-card border border-border opulent-photo">
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="img-product-main"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${product.name} view ${index + 1}`}
                    className={`w-full aspect-square object-cover rounded-lg cursor-pointer border transition-all ${
                      selectedImage === index ? 'border-accent ring-1 ring-accent/30' : 'border-border hover:border-accent/60'
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
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-semibold text-foreground mb-3 font-serif leading-tight gold-foil embossed-title" data-testid="text-product-name">
                  {product.name}
                </h1>
                <p className="text-muted-foreground" data-testid="text-product-category">
                  {product.subcategory || product.category}
                </p>
              </div>
              <Button variant="outline" size="icon" className="border-border" data-testid="button-share">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Badges */}
            <div className="flex gap-2 mb-6">
              {product.tags.includes("new") && (
                <Badge className="bg-white/90 text-foreground border border-border backdrop-blur-sm" data-testid="badge-new">New Arrival</Badge>
              )}
              {product.tags.some?.((t: string) => /limited/.test(t)) || product.tags.includes("limited") ? (
                <Badge className="bg-secondary text-secondary-foreground" data-testid="badge-limited">Limited Edition</Badge>
              ) : null}
              {isOnSale && (
                <Badge className="bg-accent text-accent-foreground" data-testid="badge-sale">Limited Offer</Badge>
              )}
              <Badge variant="outline" className="border-border" data-testid="badge-stock">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </Badge>
            </div>

            {/* Price and Rating */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-medium text-foreground/90 tracking-wide" data-testid="text-product-price">
                  {formatINR(parseFloat(product.price))}
                </span>
                {isOnSale && (
                  <span className="text-sm text-muted-foreground line-through" data-testid="text-product-original-price">
                    {formatINR(parseFloat(product.originalPrice!))}
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 mr-1 text-accent fill-current" />
                <span className="mr-1" data-testid="text-product-rating">{product.rating}</span>
                <span>(<span data-testid="text-product-reviews">{product.reviewCount}</span> reviews)</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-10">
              <h3 className="font-medium mb-3 text-foreground">Description</h3>
              <p className="text-foreground/80 leading-relaxed" data-testid="text-product-description">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3">Size</h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      className={`${selectedSize === size ? 'bg-accent border-accent' : 'border-border'} rounded-full`}
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
                <h4 className="font-medium mb-3">Color</h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      className={`${selectedColor === color ? 'bg-accent border-accent' : 'border-border'} rounded-full`}
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
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center border border-input rounded-lg overflow-hidden">
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
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground" data-testid="button-add-to-wishlist">
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                className="w-full bg-primary text-primary-foreground hover:opacity-90 py-4 rounded-lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                data-testid="button-add-to-cart"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
              </Button>
              <Button 
                className="w-full bg-accent text-accent-foreground hover:opacity-90 py-4 rounded-lg"
                disabled={product.stock === 0}
                data-testid="button-buy-now"
              >
                Buy Now
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-10 pt-8 border-t border-border">
              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">SKU:</span>
                  <span className="ml-2" data-testid="text-product-sku">{product.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Category:</span>
                  <span className="ml-2" data-testid="text-product-full-category">{product.category}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
