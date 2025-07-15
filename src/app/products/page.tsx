'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { ArrowLeft } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';

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

function ProductsContent() {
  const searchParams = useSearchParams();
  const section = searchParams.get('section');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadProducts();
  }, [section]); // loadProducts is stable and doesn't need to be in deps
  
  const loadProducts = async () => {
    try {
      setLoading(true);
      const url = section ? `/api/products?section=${section}` : '/api/products';
      const response = await fetch(url);
      
      if (response.ok) {
        const { products } = await response.json();
        setProducts(products);
      } else {
        console.error('Failed to load products');
        // Fallback to mock data
        setProducts([{
          id: 1,
          name: 'Umxube wabantwana',
          traditional_name: 'Umxube wabantwana (0-3 years)',
          description: 'Traditional indigenous medicine specially formulated for children aged 0-3 years.',
          base_price: 89.99,
          current_price: 89.99,
          size: '500ml',
          inventory_count: 50,
          category: 'children-wellness',
          section: 'wellness',
          origin: 'Eastern Cape, South Africa',
          image_url: null,
        }]);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback to mock data
      setProducts([{
        id: 1,
        name: 'Umxube wabantwana',
        traditional_name: 'Umxube wabantwana (0-3 years)',
        description: 'Traditional indigenous medicine specially formulated for children aged 0-3 years.',
        base_price: 89.99,
        current_price: 89.99,
        size: '500ml',
        inventory_count: 50,
        category: 'children-wellness',
        section: 'wellness',
        origin: 'Eastern Cape, South Africa',
        image_url: null,
      }]);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredProducts = products;
  
  const sectionTitle = section === 'wellness' 
    ? 'Human Wellness' 
    : section === 'animal' 
    ? 'Animal Wellness' 
    : 'All Products';
  
  const sectionColor = section === 'wellness'
    ? 'from-green-500 to-green-600'
    : section === 'animal'
    ? 'from-blue-500 to-blue-600'
    : 'from-gray-500 to-gray-600';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className={`bg-gradient-to-r ${sectionColor} text-white py-4`}>
        <div className="container max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold">{sectionTitle}</h1>
          <p className="text-sm opacity-90 mt-1">
            {section === 'wellness' && 'Natural remedies for human health and wellness'}
            {section === 'animal' && 'Caring for your animals with traditional medicine'}
            {!section && 'Browse all our traditional medicine products'}
          </p>
        </div>
      </div>
      
      {/* Navigation Notice */}
      <div className="bg-white border-b">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <p className="text-xs text-gray-500 italic">
              To switch sections, go back to home
            </p>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="container max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No products available in this section yet.</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  );
}