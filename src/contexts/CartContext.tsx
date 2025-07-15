'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: number;
  product_id: number;
  name: string;
  traditional_name: string;
  price: number;
  quantity: number;
  size: string;
  image_url?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  loading: boolean;
  addToCart: (product: { id: number; name: string; traditional_name: string; price: number; size: string; image_url?: string }, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalAmount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');

  // Generate session ID for non-authenticated users
  useEffect(() => {
    let id = localStorage.getItem('nothobile-session-id');
    if (!id) {
      id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('nothobile-session-id', id);
    }
    setSessionId(id);
  }, []);

  // Load cart from database when session ID is available
  useEffect(() => {
    if (sessionId) {
      loadCart();
    }
  }, [sessionId]); // loadCart is stable and doesn't need to be in deps

  const loadCart = async () => {
    try {
      const response = await fetch(`/api/cart?sessionId=${sessionId}`);
      if (response.ok) {
        const { cartItems: items } = await response.json();
        const formattedItems = items.map((item: { id: number; product_id: number; quantity: number; product: { name: string; traditional_name: string; current_price: number; size: string; image_url?: string } }) => ({
          id: item.id,
          product_id: item.product_id,
          name: item.product.name,
          traditional_name: item.product.traditional_name,
          price: item.product.current_price,
          quantity: item.quantity,
          size: item.product.size,
          image_url: item.product.image_url,
        }));
        setCartItems(formattedItems);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
      // Fallback to localStorage for development
      const savedCart = localStorage.getItem('nothobile-cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    }
  };

  const addToCart = async (product: { id: number; name: string; traditional_name: string; price: number; size: string; image_url?: string }, quantity = 1) => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          quantity,
          sessionId,
        }),
      });

      if (response.ok) {
        await loadCart(); // Reload cart from database
        console.log(`Added ${product.name} to cart`);
      } else {
        throw new Error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // Fallback to localStorage
      setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.product_id === product.id);
        
        if (existingItem) {
          const newItems = prevItems.map(item =>
            item.product_id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          localStorage.setItem('nothobile-cart', JSON.stringify(newItems));
          return newItems;
        }
        
        const newItems = [...prevItems, { 
          id: Date.now(), 
          product_id: product.id, 
          name: product.name,
          traditional_name: product.traditional_name,
          price: product.price,
          size: product.size,
          image_url: product.image_url,
          quantity 
        }];
        localStorage.setItem('nothobile-cart', JSON.stringify(newItems));
        return newItems;
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        await loadCart();
      } else {
        throw new Error('Failed to update cart item');
      }
    } catch (error) {
      console.error('Failed to update cart item:', error);
      // Fallback to localStorage
      if (quantity <= 0) {
        await removeFromCart(itemId);
        return;
      }
      
      const newItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      setCartItems(newItems);
      localStorage.setItem('nothobile-cart', JSON.stringify(newItems));
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadCart();
      } else {
        throw new Error('Failed to remove cart item');
      }
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      // Fallback to localStorage
      const newItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(newItems);
      localStorage.setItem('nothobile-cart', JSON.stringify(newItems));
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(`/api/cart?sessionId=${sessionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCartItems([]);
      } else {
        throw new Error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      // Fallback to localStorage
      setCartItems([]);
      localStorage.removeItem('nothobile-cart');
    }
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        loading,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        getTotalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}