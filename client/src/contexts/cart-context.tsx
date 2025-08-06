import { createContext, useContext, useReducer, ReactNode } from "react";
import { CartItem, Cart } from "@/lib/types";

interface CartAction {
  type: "ADD_ITEM" | "REMOVE_ITEM" | "UPDATE_QUANTITY" | "CLEAR_CART";
  payload?: any;
}

interface CartContextType extends Cart {
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "ADD_ITEM": {
      const newItem = action.payload as CartItem;
      const existingItemIndex = state.items.findIndex(
        item => item.productId === newItem.productId && 
                item.size === newItem.size && 
                item.color === newItem.color
      );

      let updatedItems: CartItem[];
      if (existingItemIndex >= 0) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, newItem];
      }

      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: updatedItems, total, itemCount };
    }

    case "REMOVE_ITEM": {
      const productId = action.payload as string;
      const updatedItems = state.items.filter(item => item.productId !== productId);
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: updatedItems, total, itemCount };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: "REMOVE_ITEM", payload: productId });
      }

      const updatedItems = state.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

      return { items: updatedItems, total, itemCount };
    }

    case "CLEAR_CART":
      return { items: [], total: 0, itemCount: 0 };

    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, { items: [], total: 0, itemCount: 0 });

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: productId });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider value={{
      ...cart,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
