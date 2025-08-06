export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface CheckoutFormData {
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
}
