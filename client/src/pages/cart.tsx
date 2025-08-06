import { Link } from "wouter";
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/cart-context";

export default function Cart() {
  const { items, total, updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16" data-testid="empty-cart">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-8" />
            <h1 className="text-3xl font-bold text-primary mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Add some amazing products to get started</p>
            <Link href="/products">
              <Button className="bg-primary text-white hover:bg-gray-800" data-testid="button-shop-now">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2" data-testid="text-cart-title">Shopping Cart</h1>
            <p className="text-gray-600" data-testid="text-cart-item-count">
              {items.length} item{items.length !== 1 ? 's' : ''} in your cart
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" data-testid="button-continue-shopping">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <Card key={`${item.productId}-${item.size}-${item.color}`} data-testid={`cart-item-card-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Link href={`/product/${item.productId}`}>
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg hover:opacity-75 transition-opacity cursor-pointer"
                        data-testid={`img-cart-item-${index}`}
                      />
                    </Link>
                    
                    <div className="flex-1">
                      <Link href={`/product/${item.productId}`}>
                        <h3 className="font-semibold text-primary hover:text-accent cursor-pointer" data-testid={`text-cart-item-name-${index}`}>
                          {item.name}
                        </h3>
                      </Link>
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
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-3">
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            data-testid={`button-decrease-cart-quantity-${index}`}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-medium w-8 text-center" data-testid={`text-cart-item-quantity-${index}`}>
                            {item.quantity}
                          </span>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            data-testid={`button-increase-cart-quantity-${index}`}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-primary" data-testid={`text-cart-item-total-${index}`}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="text-gray-400 hover:text-red-500"
                            onClick={() => handleRemoveItem(item.productId)}
                            data-testid={`button-remove-cart-item-${index}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4" data-testid="order-summary-card">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span data-testid="text-subtotal">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-green-600" data-testid="text-shipping">
                    {total >= 100 ? 'Free' : '$9.99'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span data-testid="text-tax">${(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span data-testid="text-total">
                      ${(total + (total >= 100 ? 0 : 9.99) + (total * 0.08)).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                {total < 100 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-700" data-testid="text-free-shipping-notice">
                      Add ${(100 - total).toFixed(2)} more to get free shipping!
                    </p>
                  </div>
                )}

                <Link href="/checkout">
                  <Button className="w-full bg-accent text-white hover:bg-pink-600 py-3" data-testid="button-proceed-to-checkout">
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <div className="text-center text-sm text-gray-500">
                  <p data-testid="text-security-notice">🔒 Secure checkout with 256-bit SSL encryption</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
