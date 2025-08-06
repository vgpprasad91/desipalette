import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/cart-context";
import { Link } from "wouter";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function CartSidebar({ open, onClose }: CartSidebarProps) {
  const { items, total, itemCount, updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-96 flex flex-col h-full" data-testid="cart-sidebar">
        <SheetHeader className="border-b border-gray-200 pb-4">
          <SheetTitle className="flex items-center justify-between">
            <span data-testid="text-cart-title">Shopping Cart</span>
            <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-cart">
              <X className="h-4 w-4" />
            </Button>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-12" data-testid="empty-cart">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-600 mb-2">Your cart is empty</h4>
              <p className="text-gray-500 mb-6">Add some products to get started</p>
              <Button onClick={onClose} data-testid="button-continue-shopping">
                Continue Shopping
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center space-x-4 py-4 border-b border-gray-100 last:border-b-0" data-testid={`cart-item-${index}`}>
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      data-testid={`img-cart-item-${index}`}
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-primary" data-testid={`text-cart-item-name-${index}`}>
                        {item.name}
                      </h4>
                      {item.size && (
                        <p className="text-sm text-gray-600" data-testid={`text-cart-item-size-${index}`}>
                          Size: {item.size}
                        </p>
                      )}
                      {item.color && (
                        <p className="text-sm text-gray-600" data-testid={`text-cart-item-color-${index}`}>
                          Color: {item.color}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="w-6 h-6"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            data-testid={`button-decrease-quantity-${index}`}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span data-testid={`text-cart-item-quantity-${index}`}>{item.quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="w-6 h-6"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            data-testid={`button-increase-quantity-${index}`}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <span className="font-semibold text-primary" data-testid={`text-cart-item-total-${index}`}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-gray-400 hover:text-red-500"
                      onClick={() => handleRemoveItem(item.productId)}
                      data-testid={`button-remove-item-${index}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-primary">Total:</span>
                <span className="text-xl font-bold text-primary" data-testid="text-cart-total">
                  ${total.toFixed(2)}
                </span>
              </div>
              <div className="space-y-3">
                <Link href="/checkout" onClick={onClose}>
                  <Button className="w-full bg-accent text-white hover:bg-pink-600" data-testid="button-checkout">
                    Proceed to Checkout
                  </Button>
                </Link>
                <Link href="/cart" onClick={onClose}>
                  <Button variant="outline" className="w-full" data-testid="button-view-cart">
                    View Cart Details
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
