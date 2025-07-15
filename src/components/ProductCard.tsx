'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

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
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

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
    
    // Show feedback for a bit longer
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {product.image_url && (
        <div className="aspect-square bg-gray-100 rounded-md mb-3">
          {/* Placeholder for image */}
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-3xl">🌿</span>
          </div>
        </div>
      )}
      
      <h3 className="font-semibold text-sm mb-1">{product.name}</h3>
      <p className="text-xs text-gray-600 mb-2">{product.traditional_name}</p>
      
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{product.description}</p>
      
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-lg font-bold">R {product.current_price.toFixed(2)}</p>
          <p className="text-xs text-gray-500">{product.size}</p>
        </div>
        <div className="text-xs text-gray-500">
          Stock: {product.inventory_count}
        </div>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={handleAddToCart}
          disabled={isAdding || product.inventory_count === 0}
          className={`w-full py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            product.inventory_count === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isAdding
              ? 'bg-green-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {product.inventory_count === 0
            ? 'Out of Stock'
            : isAdding
            ? 'Adding...'
            : 'Add to Cart'}
        </button>
        
        <Link
          href={`/products/${product.id}`}
          className="block w-full py-2 px-3 border border-gray-300 rounded-md text-sm text-center hover:bg-gray-50 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}