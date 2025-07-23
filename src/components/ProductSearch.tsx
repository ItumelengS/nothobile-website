'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onFilter: (filters: FilterOptions) => void;
}

interface FilterOptions {
  section?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
}

export function ProductSearch({ onSearch, onFilter }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilter({});
    setSearchQuery('');
    onSearch('');
  };

  const activeFilterCount = Object.keys(filters).filter(key => filters[key as keyof FilterOptions] !== undefined).length;

  return (
    <div className="mb-6">
      {/* Search Bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or traditional name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-earth/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-nature/50 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                onSearch('');
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors text-sm ${
            showFilters || activeFilterCount > 0
              ? 'bg-nature text-white border-nature'
              : 'border-earth/30 hover:bg-earth/10'
          }`}
        >
          <Filter className="h-4 w-4" />
          Filter
          {activeFilterCount > 0 && (
            <span className="bg-white text-nature text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-card border border-earth/30 rounded-lg p-4 space-y-4">
          {/* Section Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Section</label>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange({ ...filters, section: undefined })}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  !filters.section
                    ? 'bg-nature text-white'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange({ ...filters, section: 'wellness' })}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  filters.section === 'wellness'
                    ? 'bg-nature text-white'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Human Wellness
              </button>
              <button
                onClick={() => handleFilterChange({ ...filters, section: 'animal' })}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  filters.section === 'animal'
                    ? 'bg-nature text-white'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                Animal Wellness
              </button>
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">Price Range</label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => handleFilterChange({ 
                  ...filters, 
                  minPrice: e.target.value ? Number(e.target.value) : undefined 
                })}
                className="w-24 px-2 py-1 border border-earth/30 rounded text-sm"
              />
              <span className="text-sm">to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => handleFilterChange({ 
                  ...filters, 
                  maxPrice: e.target.value ? Number(e.target.value) : undefined 
                })}
                className="w-24 px-2 py-1 border border-earth/30 rounded text-sm"
              />
              <span className="text-sm text-muted-foreground">Rand</span>
            </div>
          </div>

          {/* Stock Filter */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.inStock || false}
                onChange={(e) => handleFilterChange({ 
                  ...filters, 
                  inStock: e.target.checked || undefined 
                })}
                className="rounded border-earth/30"
              />
              <span className="text-sm">In Stock Only</span>
            </label>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sort By</label>
            <select
              value={filters.sortBy || ''}
              onChange={(e) => handleFilterChange({ 
                ...filters, 
                sortBy: e.target.value as FilterOptions['sortBy'] || undefined 
              })}
              className="w-full px-3 py-1 border border-earth/30 rounded text-sm"
            >
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-earth hover:text-earth-dark underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}