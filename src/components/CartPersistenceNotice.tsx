'use client';

import { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';

export function CartPersistenceNotice() {
  const { cartCount } = useCart();
  const [showNotice, setShowNotice] = useState(false);
  const [hasShownBefore, setHasShownBefore] = useState(false);

  useEffect(() => {
    // Show notice when user first adds items to cart
    const shownBefore = localStorage.getItem('cart-persistence-notice-shown');
    if (!shownBefore && cartCount > 0 && !hasShownBefore) {
      setShowNotice(true);
      setHasShownBefore(true);
      localStorage.setItem('cart-persistence-notice-shown', 'true');
      
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setShowNotice(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [cartCount, hasShownBefore]);

  if (!showNotice || cartCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-amber/95 backdrop-blur-sm text-earth-dark rounded-lg shadow-lg p-4 pr-10 relative border border-amber-dark/20">
        <button
          onClick={() => setShowNotice(false)}
          className="absolute top-2 right-2 p-1 hover:bg-earth-dark/10 rounded-full transition-colors"
          aria-label="Close notice"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-earth-dark/70" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Your cart is saved!</p>
            <p className="text-xs opacity-90">
              Items in your cart will be saved for 30 days, even if you leave the site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}