import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { CartItem, Item, Product } from '../types';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD'; item: Item; product: Product }
  | { type: 'REMOVE'; itemId: string }
  | { type: 'INCREMENT'; itemId: string }
  | { type: 'DECREMENT'; itemId: string }
  | { type: 'CLEAR' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((ci) => ci.item.id === action.item.id);
      if (existing) {
        return {
          items: state.items.map((ci) =>
            ci.item.id === action.item.id
              ? { ...ci, quantity: ci.quantity + 1 }
              : ci
          ),
        };
      }
      return {
        items: [...state.items, { item: action.item, product: action.product, quantity: 1 }],
      };
    }
    case 'REMOVE':
      return { items: state.items.filter((ci) => ci.item.id !== action.itemId) };
    case 'INCREMENT':
      return {
        items: state.items.map((ci) =>
          ci.item.id === action.itemId ? { ...ci, quantity: ci.quantity + 1 } : ci
        ),
      };
    case 'DECREMENT':
      return {
        items: state.items
          .map((ci) =>
            ci.item.id === action.itemId ? { ...ci, quantity: ci.quantity - 1 } : ci
          )
          .filter((ci) => ci.quantity > 0),
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (item: Item, product: Product) => void;
  removeFromCart: (itemId: string) => void;
  increment: (itemId: string) => void;
  decrement: (itemId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  const addToCart = useCallback((item: Item, product: Product) => {
    dispatch({ type: 'ADD', item, product });
  }, []);
  const removeFromCart = useCallback((itemId: string) => {
    dispatch({ type: 'REMOVE', itemId });
  }, []);
  const increment = useCallback((itemId: string) => {
    dispatch({ type: 'INCREMENT', itemId });
  }, []);
  const decrement = useCallback((itemId: string) => {
    dispatch({ type: 'DECREMENT', itemId });
  }, []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR' }), []);

  const totalItems = state.items.reduce((s, ci) => s + ci.quantity, 0);
  const totalPrice = state.items.reduce(
    (s, ci) => s + ci.item.price * ci.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items: state.items, totalItems, totalPrice, addToCart, removeFromCart, increment, decrement, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}

