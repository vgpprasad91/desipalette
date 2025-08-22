import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, CreditCard, Lock, CheckCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatINR } from "@/lib/utils";

const checkoutSchema = z.object({
  customerEmail: z.string().email("Please enter a valid email address"),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerPhone: z.string().min(10, "Please enter a valid phone number"),
  shippingAddress: z.string().min(10, "Please enter a complete address"),
  cardNumber: z.string().min(16, "Please enter a valid card number"),
  expiryDate: z.string().min(5, "Please enter expiry date (MM/YY)"),
  cvv: z.string().min(3, "Please enter CVV"),
  cardholderName: z.string().min(2, "Please enter cardholder name"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, navigate] = useLocation();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();

  // Check Shopify status
  const { data: shopifyStatus } = useQuery({
    queryKey: ['/api/shopify/status'],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  // Shopify checkout mutation
  const createShopifyCheckoutMutation = useMutation({
    mutationFn: async (data: CheckoutFormData) => {
      const customerInfo = {
        email: data.customerEmail,
        name: data.customerName,
        phone: data.customerPhone,
        address: data.shippingAddress,
      };

      const cartItems = items.map(item => ({
        productId: item.product.id,
        variantId: item.product.id, // Use product ID as variant ID for now
        quantity: item.quantity,
        title: item.product.name,
        price: item.product.price,
      }));

      const response = await apiRequest("POST", "/api/shopify/checkout", {
        customerInfo,
        cartItems,
      });
      return response.json();
    },
    onSuccess: (result) => {
      if (result.success && result.checkoutUrl) {
        clearCart();
        toast({
          title: "Redirecting to Shopify Checkout",
          description: "You'll be redirected to complete your purchase on Shopify.",
        });
        // Redirect to Shopify checkout
        window.location.href = result.checkoutUrl;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Shopify Checkout Failed",
        description: error.message || "There was an error creating the checkout. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Regular order mutation for non-Shopify checkout
  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutFormData) => {
      const orderData = {
        customerEmail: data.customerEmail,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        totalAmount: (total + (total >= 999 ? 0 : 99) + (total * 0.18)).toFixed(0),
        items: JSON.stringify(items),
        status: "confirmed",
      };

      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: (order) => {
      setOrderId(order.id);
      setOrderPlaced(true);
      clearCart();
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${order.id.slice(0, 8)} has been confirmed.`,
      });
    },
    onError: () => {
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-neutral">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-primary mb-4" data-testid="text-empty-cart-title">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600 mb-8">Add some products before proceeding to checkout</p>
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

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-neutral">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16" data-testid="order-success">
            <CheckCircle className="h-24 w-24 text-green-500 mx-auto mb-8" />
            <h1 className="text-4xl font-bold text-primary mb-4">Order Confirmed!</h1>
            <p className="text-xl text-gray-600 mb-4">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
            <p className="text-gray-600 mb-8" data-testid="text-order-id">
              Order ID: <span className="font-semibold">#{orderId.slice(0, 8).toUpperCase()}</span>
            </p>
            <div className="space-y-4 max-w-md mx-auto">
              <p className="text-gray-600">
                You will receive an email confirmation shortly with tracking information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <Button className="bg-primary text-white hover:bg-gray-800" data-testid="button-continue-shopping">
                    Continue Shopping
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" data-testid="button-home">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = total;
  const shipping = total >= 999 ? 0 : 99;
  const tax = total * 0.18;
  const finalTotal = subtotal + shipping + tax;

  const onSubmit = (data: CheckoutFormData) => {
    // Always use Shopify checkout
    createShopifyCheckoutMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-neutral">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2" data-testid="text-checkout-title">
              Secure Checkout
            </h1>
            <div className="flex items-center text-sm text-gray-600">
              <Lock className="h-4 w-4 mr-2" />
              <span>256-bit SSL encrypted checkout</span>
              <span className="ml-4 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                <ExternalLink className="h-3 w-3 inline mr-1" />
                Shopify Powered
              </span>
            </div>
          </div>
          <Link href="/cart">
            <Button variant="outline" data-testid="button-back-to-cart">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card data-testid="contact-info-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                      1
                    </span>
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        {...register("customerName")}
                        placeholder="Enter your full name"
                        data-testid="input-customer-name"
                      />
                      {errors.customerName && (
                        <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Email Address *</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        {...register("customerEmail")}
                        placeholder="Enter your email"
                        data-testid="input-customer-email"
                      />
                      {errors.customerEmail && (
                        <p className="text-red-500 text-sm mt-1">{errors.customerEmail.message}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Phone Number *</Label>
                    <Input
                      id="customerPhone"
                      {...register("customerPhone")}
                      placeholder="Enter your phone number"
                      data-testid="input-customer-phone"
                    />
                    {errors.customerPhone && (
                      <p className="text-red-500 text-sm mt-1">{errors.customerPhone.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card data-testid="shipping-address-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                      2
                    </span>
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="shippingAddress">Complete Address *</Label>
                    <Textarea
                      id="shippingAddress"
                      {...register("shippingAddress")}
                      placeholder="Enter your complete shipping address including street, city, state, and postal code"
                      className="min-h-[100px]"
                      data-testid="input-shipping-address"
                    />
                    {errors.shippingAddress && (
                      <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card data-testid="payment-info-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">
                      3
                    </span>
                    Payment Information
                    <CreditCard className="h-5 w-5 ml-auto" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name *</Label>
                    <Input
                      id="cardholderName"
                      {...register("cardholderName")}
                      placeholder="Name on card"
                      data-testid="input-cardholder-name"
                    />
                    {errors.cardholderName && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardholderName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      {...register("cardNumber")}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      data-testid="input-card-number"
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        {...register("expiryDate")}
                        placeholder="MM/YY"
                        maxLength={5}
                        data-testid="input-expiry-date"
                      />
                      {errors.expiryDate && (
                        <p className="text-red-500 text-sm mt-1">{errors.expiryDate.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        {...register("cvv")}
                        placeholder="123"
                        maxLength={4}
                        data-testid="input-cvv"
                      />
                      {errors.cvv && (
                        <p className="text-red-500 text-sm mt-1">{errors.cvv.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center text-sm text-blue-700">
                      <Lock className="h-4 w-4 mr-2" />
                      <span>Your payment information is secure and encrypted</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4" data-testid="order-summary">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center space-x-3" data-testid={`order-item-${index}`}>
                        <img 
                          src={item.imageUrl} 
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                        </div>
                        <p className="text-sm font-medium">{formatINR(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span data-testid="text-checkout-subtotal">{formatINR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? "text-green-600" : ""} data-testid="text-checkout-shipping">
                        {shipping === 0 ? 'Free' : formatINR(shipping)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax</span>
                      <span data-testid="text-checkout-tax">{formatINR(tax)}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span data-testid="text-checkout-total">{formatINR(finalTotal)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accent text-white hover:bg-pink-600 py-3"
                    disabled={createOrderMutation.isPending}
                    data-testid="button-place-order"
                  >
                    {createOrderMutation.isPending ? 'Processing...' : `Place Order • ${formatINR(finalTotal)}`}
                  </Button>

                  <div className="text-center text-xs text-gray-500">
                    <p>By placing your order, you agree to our Terms of Service and Privacy Policy</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
