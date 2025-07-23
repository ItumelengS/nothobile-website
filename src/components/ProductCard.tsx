'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  traditional_name: string;
  description: string;
  base_price: number;
  current_price: number;
  size: string;
  inventory_count: number;
  category: string;
  section: string;
  origin: string;
  image_url?: string | null;
}

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart, cartItems } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    // Check if item is already in cart
    const existingItem = cartItems.find(item => item.product_id === product.id);
    setIsInCart(!!existingItem);
  }, [cartItems, product.id]);

  const handleAddToCart = async () => {
    setIsAdding(true);
    addToCart({
      id: product.id,
      name: product.name,
      traditional_name: product.traditional_name,
      price: product.current_price,
      size: product.size,
      image_url: product.image_url || undefined,
    });
    
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
    }, 1000);
  };

  const handleCheckout = () => {
    router.push('/cart');
  };

  return (
    <div className="bg-card border border-earth-light/30 rounded-lg p-4 shadow-md hover:shadow-xl transition-all hover:transform hover:scale-105">
      {product.image_url && (
        <div className="aspect-square bg-nature/10 rounded-md mb-3 border border-nature/20">
          {/* Placeholder for image */}
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-3xl text-nature">🌿</span>
          </div>
        </div>
      )}
      
      <h3 className="font-semibold text-sm mb-1 text-card-foreground">{product.name}</h3>
      <p className="text-xs text-nature mb-2">{product.traditional_name}</p>
      
      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
      
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xl font-bold text-amber-dark">R {product.current_price.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">{product.size}</p>
        </div>
        <div className="text-xs text-muted-foreground">
          Stock: {product.inventory_count}
        </div>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={isAdded || isInCart ? handleCheckout : handleAddToCart}
          disabled={isAdding || product.inventory_count === 0}
          className={`w-full py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            product.inventory_count === 0
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : isAdding
              ? 'bg-nature text-white'
              : isAdded || isInCart
              ? 'bg-amber hover:bg-amber-dark text-earth-dark'
              : 'bg-nature hover:bg-nature-dark text-white'
          }`}
        >
          {product.inventory_count === 0
            ? 'Out of Stock'
            : isAdding
            ? 'Adding...'
            : isAdded || isInCart
            ? 'View in Cart'
            : 'Add to Cart'}
        </button>
        
        {isInCart && !isAdded && (
          <p className="text-xs text-center text-amber-dark mt-1 font-medium">
            Already in cart - click to adjust quantity
          </p>
        )}
        
        <Link
          href={`/products/${product.id}`}
          className="block w-full py-2 px-3 bg-earth/10 border-2 border-earth/40 rounded-md text-sm text-center text-earth-dark font-semibold hover:bg-earth/20 hover:border-earth/60 hover:shadow-sm transition-all"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}