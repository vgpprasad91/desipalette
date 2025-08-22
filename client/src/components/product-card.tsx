import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@shared/schema";
import { formatINR } from "@/lib/utils";
import { gsap } from "gsap";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (!cardRef.current || !imageRef.current) return;
    
    const card = cardRef.current;
    const image = imageRef.current;
    
    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -4,
        boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(image, {
        scale: 1.05,
        duration: 0.6,
        ease: "power2.out"
      });
    };
    
    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        duration: 0.3,
        ease: "power2.out"
      });
      
      gsap.to(image, {
        scale: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    };
    
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const heritageBlurb = (category?: string) => {
    const key = (category || '').toLowerCase();
    if (key.includes('saree') || key.includes('silk')) {
      return 'Woven on South Indian looms with lustrous zari borders. Each yard honors centuries of temple craft.';
    }
    if (key.includes('jewel')) {
      return 'Hand-set granulation and antique finishes echo the sanctum—crafted in the tradition of temple gold.';
    }
    if (key.includes('kurta') || key.includes('tailor')) {
      return 'Clean lines, fine facings, and calibrated proportions—cut for quiet luxury and enduring wear.';
    }
    if (key.includes('handicraft') || key.includes('home')) {
      return 'Carved woods, hammered brass, and artisanal textiles—objects with soul for the modern home.';
    }
    return 'Crafted by Indian ateliers using time-honored techniques, refined with modern precision.';
  };

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
  const isLimited = product.tags.some?.((t: string) => /limited/.test(t)) || product.tags.includes("limited");

  return (
    <div 
      ref={cardRef}
      className="bg-card rounded-xl border border-border overflow-hidden group cursor-pointer hover-golden-border gold-glow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-product-${product.id}`}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative opulent-photo">
          <img 
            ref={imageRef}
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-64 object-cover"
            data-testid={`img-product-${product.id}`}
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isNew && (
              <Badge className="bg-white/90 text-foreground border border-border backdrop-blur-sm" data-testid={`badge-new-${product.id}`}>
                New Arrival
              </Badge>
            )}
            {isLimited && (
              <Badge className="bg-secondary text-secondary-foreground" data-testid={`badge-limited-${product.id}`}>
                Limited Edition
              </Badge>
            )}
            {isOnSale && (
              <Badge className="bg-accent text-accent-foreground" data-testid={`badge-sale-${product.id}`}>
                Limited Offer
              </Badge>
            )}
          </div>

          {/* Hover actions */}
          <div className={`absolute top-3 right-3 transition-opacity lux-transition ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-white border border-border hover:bg-accent/10 hover:text-accent hover-golden-border"
              data-testid={`button-wishlist-${product.id}`}
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick view button */}
          {onQuickView && (
            <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity lux-transition ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              <Button 
                variant="outline" 
                onClick={handleQuickView}
                className="bg-white text-foreground hover:bg-accent/10 hover:text-accent hover-golden-border"
                data-testid={`button-quick-view-${product.id}`}
              >
                Quick View
              </Button>
            </div>
          )}
        </div>

        <div className="p-4">
          <h4 className="font-serif text-foreground mb-1 tracking-tight font-semibold" data-testid={`text-product-name-${product.id}`}>
            {product.name}
          </h4>
          <p className="text-sm text-muted-foreground mb-2 font-light tracking-[0.01em]" data-testid={`text-product-category-${product.id}`}>
            {product.subcategory || product.category}
          </p>
          {/* Heritage storytelling */}
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed tracking-[0.01em]">
            {heritageBlurb(product.category)}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-light tracking-wide text-foreground/90" data-testid={`text-product-price-${product.id}`}>
                {formatINR(parseFloat(product.price))}
              </span>
              {isOnSale && (
                <span className="text-xs text-muted-foreground line-through" data-testid={`text-product-original-price-${product.id}`}>
                  {formatINR(parseFloat(product.originalPrice!))}
                </span>
              )}
            </div>
            {/* Rating intentionally omitted for a cleaner card */}
            <div />
          </div>

          <Button 
            className={`w-full mt-4 bg-primary text-primary-foreground hover:opacity-90 transition-all lux-transition hover-golden-border`}
            onClick={handleAddToCart}
            data-testid={`button-add-to-cart-${product.id}`}
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Bag
          </Button>
        </div>
      </Link>
    </div>
  );
}
