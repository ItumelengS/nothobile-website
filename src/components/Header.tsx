'use client';

import Link from 'next/link';
import { ShoppingCart, Menu } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

export function Header() {
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Nothobile
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm hover:text-gray-600">
              Home
            </Link>
            <Link href="/products" className="text-sm hover:text-gray-600">
              Products
            </Link>
            <Link href="/cart" className="relative text-sm hover:text-gray-600">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-3 md:hidden">
            <Link href="/cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
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
        <nav className="md:hidden bg-white border-t">
          <div className="container max-w-7xl mx-auto px-4 py-2">
            <Link
              href="/"
              className="block py-2 text-sm hover:text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block py-2 text-sm hover:text-gray-600"
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