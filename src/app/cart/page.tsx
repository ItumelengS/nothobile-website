'use client';

import Link from 'next/link';
import { ArrowLeft, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const { cartItems, updateCartItem, removeFromCart, getTotalAmount, clearCart } = useCart();
  
  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateCartItem(itemId, newQuantity);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold mb-2 text-earth">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add some products to get started</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-nature text-white px-6 py-2 rounded-md hover:bg-nature-dark transition-all transform hover:scale-105 shadow-md"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-earth">Shopping Cart</h1>
          <Link
            href="/"
            className="text-sm text-earth hover:text-amber transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-md border border-earth-light/30">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 border-b last:border-b-0">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-nature/10 rounded-md flex items-center justify-center flex-shrink-0 border border-nature/20">
                      <span className="text-2xl text-nature">🌿</span>
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-card-foreground">{item.name}</h3>
                      <p className="text-xs text-nature">{item.traditional_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.size}</p>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-earth/30 rounded-md">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-earth/10 transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 py-1 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-earth/10 transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-amber-dark">R {(item.price * item.quantity).toFixed(2)}</p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-destructive hover:text-destructive/80 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={clearCart}
              className="mt-4 text-sm text-destructive hover:text-destructive/80 transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-md p-6 border border-earth-light/30">
              <h2 className="text-lg font-semibold mb-4 text-earth">Order Summary</h2>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>R {getTotalAmount().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span className="text-nature">Free</span>
                </div>
                <div className="border-t border-earth/20 pt-2 flex justify-between font-semibold text-earth">
                  <span>Total</span>
                  <span className="text-amber-dark">R {getTotalAmount().toFixed(2)}</span>
                </div>
              </div>
              
              <button className="w-full bg-amber text-earth-dark py-3 rounded-md hover:bg-amber-light font-semibold transition-all transform hover:scale-105 shadow-md">
                Proceed to Checkout
              </button>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                Secure checkout powered by Nothobile
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}