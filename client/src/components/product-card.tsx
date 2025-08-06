import { useState } from "react";
import { Link } from "wouter";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      imageUrl: product.imageUrl,
      quantity: 1,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const isOnSale = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);
  const isNew = product.tags.includes("new");

  return (
    <div 
      className="bg-white rounded-xl shadow-md overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-product-${product.id}`}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            data-testid={`img-product-${product.id}`}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isNew && (
              <Badge className="bg-secondary text-white" data-testid={`badge-new-${product.id}`}>
                New
              </Badge>
            )}
            {isOnSale && (
              <Badge className="bg-red-500 text-white" data-testid={`badge-sale-${product.id}`}>
                Sale
              </Badge>
            )}
          </div>

          {/* Hover actions */}
          <div className={`absolute top-3 right-3 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-white shadow-lg hover:bg-gray-50"
              data-testid={`button-wishlist-${product.id}`}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick view button */}
          {onQuickView && (
            <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <Button 
                variant="outline" 
                onClick={handleQuickView}
                className="bg-white text-primary hover:bg-gray-50"
                data-testid={`button-quick-view-${product.id}`}
              >
                Quick View
              </Button>
            </div>
          )}
        </div>

        <div className="p-4">
          <h4 className="font-semibold text-primary mb-2" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h4>
          <p className="text-sm text-gray-600 mb-2" data-testid={`text-product-category-${product.id}`}>
            {product.subcategory || product.category}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
                ${product.price}
              </span>
              {isOnSale && (
                <span className="text-sm text-gray-400 line-through" data-testid={`text-product-original-price-${product.id}`}>
                  ${product.originalPrice}
                </span>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="h-4 w-4 fill-current text-secondary mr-1" />
              <span data-testid={`text-product-rating-${product.id}`}>{product.rating}</span>
            </div>
          </div>

          <Button 
            className={`w-full mt-3 bg-primary text-white hover:bg-gray-800 transition-all duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            onClick={handleAddToCart}
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </Link>
    </div>
  );
}
