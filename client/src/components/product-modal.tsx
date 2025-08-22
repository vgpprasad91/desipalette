import { useState } from "react";
import { X, Heart, ShoppingBag, Star, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCart } from "@/contexts/cart-context";
import { Product } from "@shared/schema";
import { formatINR } from "@/lib/utils";

interface ProductModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export function ProductModal({ product, open, onClose }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCart();

  if (!product) return null;

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
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0" data-testid="product-modal">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Product images */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden mb-4">
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
                data-testid="img-modal-main"
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
                    data-testid={`img-modal-thumbnail-${index}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product details */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold font-serif mb-2 gold-shimmer" data-testid="text-modal-product-name">{product.name}</h2>
                <p className="text-gray-600" data-testid="text-modal-product-category">
                  {product.subcategory || product.category}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-modal">
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-medium text-foreground/90 tracking-wide" data-testid="text-modal-product-price">
                  {formatINR(parseFloat(product.price))}
                </span>
                {isOnSale && (
                  <span className="text-sm text-muted-foreground line-through" data-testid="text-modal-product-original-price">
                    {formatINR(parseFloat(product.originalPrice!))}
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm">
                <div className="flex text-secondary mr-2">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <span data-testid="text-modal-product-rating">{product.rating}</span>
                <span className="text-gray-600 ml-2">
                  (<span data-testid="text-modal-product-reviews">{product.reviewCount}</span> reviews)
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold mb-2">Description</h4>
              <p className="text-muted-foreground leading-relaxed" data-testid="text-modal-product-description">
                {product.description}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                {(() => {
                  const key = (product.category || '').toLowerCase();
                  if (key.includes('saree') || key.includes('silk'))
                    return 'Handloom silk with heritage zari work—each piece finished by seasoned karigars.';
                  if (key.includes('jewel'))
                    return 'Temple-inspired motifs with hand-set stones and antique patina detailing.';
                  if (key.includes('kurta') || key.includes('tailor'))
                    return 'Precision tailoring, soft interlinings, and calibrated ease for drape and movement.';
                  if (key.includes('handicraft') || key.includes('home'))
                    return 'Carved, cast, or woven by artisans—functional heirlooms for contemporary living.';
                  return 'Crafted in limited batches by Indian ateliers, refined for modern wardrobes.';
                })()}
              </p>
            </div>

            {/* Size selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Size</h4>
                <div className="flex space-x-2">
                  {product.sizes.map(size => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      className={selectedSize === size ? "border-accent bg-accent/10" : ""}
                      onClick={() => setSelectedSize(size)}
                      data-testid={`button-size-${size}`}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Color selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Color</h4>
                <div className="flex space-x-2">
                  {product.colors.map(color => (
                    <Button
                      key={color}
                      variant={selectedColor === color ? "default" : "outline"}
                      className={selectedColor === color ? "border-accent" : ""}
                      onClick={() => setSelectedColor(color)}
                      data-testid={`button-color-${color}`}
                    >
                      {color}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and actions */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Qty:</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  data-testid="button-decrease-modal-quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center" data-testid="text-modal-quantity">{quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => setQuantity(quantity + 1)}
                  data-testid="button-increase-modal-quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" className="text-gray-600 hover:text-accent" data-testid="button-add-to-wishlist-modal">
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <Button 
                className="w-full bg-primary text-white hover:bg-gray-800"
                onClick={handleAddToCart}
                data-testid="button-add-to-cart-modal"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button className="w-full bg-accent text-white hover:bg-pink-600" data-testid="button-buy-now-modal">
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
