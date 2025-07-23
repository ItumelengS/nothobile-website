'use client';

import Link from 'next/link';
import { Menu, ShoppingCart, Cloud, Sun, CloudRain, Wind, Zap } from 'lucide-react';
import { useState } from 'react';
import { useWeather } from '@/context/WeatherContext';
import { useCart } from '@/contexts/CartContext';

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  windy: Wind,
  stormy: Zap,
};

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { condition, isLoading } = useWeather();
  const { cartCount } = useCart();
  const WeatherIcon = weatherIcons[condition];

  return (
    <header className="sticky top-0 z-50 bg-earth/95 backdrop-blur-sm border-b border-earth-dark shadow-sm">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-xl font-bold text-white drop-shadow-md flex items-center gap-2">
            <span className="text-lg">🌿</span>
            Nothobile
            {!isLoading && <WeatherIcon className="h-4 w-4 text-amber-light" />}
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm text-white/90 hover:text-amber-light transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-sm text-white/90 hover:text-amber-light transition-colors">
              Products
            </Link>
            <Link href="/cart" className="relative p-2 text-white hover:text-amber-light transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber text-earth-dark text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 md:hidden">
            <Link href="/cart" className="relative p-2 text-white hover:text-amber-light transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber text-earth-dark text-xs rounded-full h-4 w-4 flex items-center justify-center text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav className="md:hidden bg-earth/95 backdrop-blur-sm border-t border-earth-dark">
          <div className="container max-w-7xl mx-auto px-4 py-2">
            <Link
              href="/"
              className="block py-2 text-sm text-white/90 hover:text-amber-light transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block py-2 text-sm text-white/90 hover:text-amber-light transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Products
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}