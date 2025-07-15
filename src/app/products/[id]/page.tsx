'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

// Mock product data - same as in products page
const products = [
  {
    id: 1,
    name: 'Umxube wabantwana',
    traditional_name: 'Umxube wabantwana (0-3 years)',
    description: 'Traditional indigenous medicine specially formulated for children aged 0-3 years. Made from carefully selected herbs from the Eastern Cape region, this medicine supports healthy growth and development in infants and toddlers.',
    base_price: 89.99,
    current_price: 89.99,
    size: '500ml',
    inventory_count: 50,
    category: 'children-wellness',
    section: 'wellness',
    origin: 'Eastern Cape, South Africa',
    image_url: null,
    usage: 'Give 5ml three times daily after meals. Shake well before use.',
    ingredients: 'Traditional herbs blend (proprietary formula)',
    benefits: [
      'Supports healthy digestion',
      'Boosts immune system',
      'Promotes peaceful sleep',
      'Aids in proper growth',
    ],
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  
  const productId = Number(params.id);
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Product not found</p>
          <Link
            href="/products"
            className="text-green-600 hover:text-green-700"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }
  
  const handleAddToCart = async () => {
    setIsAdding(true);
    addToCart({
      id: product.id,
      name: product.name,
      traditional_name: product.traditional_name,
      price: product.current_price,
      size: product.size,
      image_url: product.image_url || undefined,
    }, quantity);
    
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };
  
  const incrementQuantity = () => {
    if (quantity < product.inventory_count) {
      setQuantity(quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Back Navigation */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-lg p-8 flex items-center justify-center">
            <div className="text-8xl">🌿</div>
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-lg text-gray-600 mb-4">{product.traditional_name}</p>
            
            <div className="mb-6">
              <p className="text-3xl font-bold text-green-600">R {product.current_price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{product.size}</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 mb-6">
              <p className="text-gray-700 mb-4">{product.description}</p>
              
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold mb-1">Origin</h3>
                  <p className="text-sm text-gray-600">{product.origin}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-1">Usage</h3>
                  <p className="text-sm text-gray-600">{product.usage}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-1">Benefits</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {product.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Quantity and Add to Cart */}
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2 hover:bg-gray-100"
                    disabled={quantity >= product.inventory_count}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.inventory_count} available
                </span>
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={isAdding || product.inventory_count === 0}
                className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
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
                  ? 'Adding to Cart...'
                  : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}