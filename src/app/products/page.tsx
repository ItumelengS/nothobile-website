'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { ProductSearch } from '@/components/ProductSearch';
import { ArrowLeft } from 'lucide-react';
import { Suspense, useEffect, useState, useMemo, useCallback } from 'react';

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

interface FilterOptions {
  section?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const section = searchParams.get('section');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  
  const loadProducts = useCallback(async () => {
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
  }, [section]);
  
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  
  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.traditional_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply section filter override
    const activeSection = filters.section || section;
    if (activeSection) {
      filtered = filtered.filter(p => p.section === activeSection);
    }
    
    // Apply price filter
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(p => p.current_price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.current_price <= filters.maxPrice!);
    }
    
    // Apply stock filter
    if (filters.inStock) {
      filtered = filtered.filter(p => p.inventory_count > 0);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-asc':
          filtered.sort((a, b) => a.current_price - b.current_price);
          break;
        case 'price-desc':
          filtered.sort((a, b) => b.current_price - a.current_price);
          break;
        case 'name-asc':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
    }
    
    return filtered;
  }, [products, searchQuery, filters, section]);
  
  const sectionTitle = section === 'wellness' 
    ? 'Human Wellness' 
    : section === 'animal' 
    ? 'Animal Wellness' 
    : 'All Products';
  
  const sectionColor = section === 'wellness'
    ? 'from-nature-dark/90 to-nature/80'
    : section === 'animal'
    ? 'from-earth-dark/90 to-amber-dark/80'
    : 'from-earth/80 to-earth-dark/80';

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Plants - Eastern Cape Flora */}
      <div className="fixed inset-0 pointer-events-none opacity-8">
        {/* Spekboom clusters */}
        <div className="absolute top-20 -left-16 text-8xl text-nature/30 rotate-12">🌿</div>
        <div className="absolute top-60 -right-20 text-6xl text-nature/20 -rotate-12">🌿</div>
        
        {/* Aloe plants */}
        <div className="absolute bottom-40 -left-10 text-7xl text-earth/25 rotate-45">🪴</div>
        <div className="absolute top-1/3 right-10 text-5xl text-nature/15 -rotate-30">🪴</div>
        
        {/* Wild herbs and grasses */}
        <div className="absolute bottom-20 right-1/4 text-6xl text-earth/20 rotate-12">🌾</div>
        <div className="absolute top-1/4 left-1/5 text-4xl text-nature/25 -rotate-45">🌾</div>
        
        {/* Indigenous medicinal plants */}
        <div className="absolute top-3/4 left-1/3 text-5xl text-nature/20 rotate-30">🌱</div>
        <div className="absolute top-1/6 right-1/3 text-3xl text-earth/30 -rotate-15">🌱</div>
        
        {/* Scattered leaves */}
        <div className="absolute top-1/2 left-10 text-4xl text-nature/15 rotate-90">🍃</div>
        <div className="absolute bottom-1/3 right-16 text-3xl text-earth/20 -rotate-45">🍃</div>
        <div className="absolute top-2/3 right-1/2 text-2xl text-nature/25 rotate-60">🍃</div>
      </div>

      {/* Background Image for sections */}
      {section && (
        <div className="absolute inset-0 z-0">
          <img
            src={section === 'wellness' ? '/img/humanW.jpg' : '/img/animalW.jpg'}
            alt={sectionTitle}
            className="w-full h-full object-cover opacity-10"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${sectionColor} opacity-90`} />
        </div>
      )}
      
      {/* Header Banner */}
      <div className={`relative z-10 bg-gradient-to-r ${sectionColor} text-white py-4 shadow-lg`}>
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
      <div className="relative z-10 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-earth hover:text-amber transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <p className="text-xs text-muted-foreground italic">
              To switch sections, go back to home
            </p>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="relative z-10 container max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{sectionTitle}</h1>
          <p className="text-muted-foreground text-sm mb-4">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} 
            {searchQuery || Object.keys(filters).length > 0 ? 'found' : 'available'}
          </p>
          
          <ProductSearch 
            onSearch={setSearchQuery}
            onFilter={setFilters}
          />
        </div>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery || Object.keys(filters).length > 0
                ? 'No products found matching your criteria.'
                : 'No products available in this section yet.'}
            </p>
            {searchQuery || Object.keys(filters).length > 0 ? (
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setFilters({});
                }}
                className="text-nature hover:text-nature-dark underline text-sm"
              >
                Clear filters
              </button>
            ) : (
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-nature hover:text-nature-dark transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Home
              </Link>
            )}
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