'use client';

import Link from 'next/link';
import { Menu, ShoppingCart, Cloud, Sun, CloudRain, Wind, Zap, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useWeather } from '@/context/WeatherContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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
  const { user, logout } = useAuth();
  const router = useRouter();
  const WeatherIcon = weatherIcons[condition];
  
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

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
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="text-sm text-white/90 hover:text-amber-light transition-colors flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span className="hidden lg:inline">{user.email?.split('@')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm text-white/90 hover:text-amber-light transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="text-sm text-white/90 hover:text-amber-light transition-colors">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="bg-amber text-earth-dark px-3 py-1 rounded text-sm font-medium hover:bg-amber-light transition-colors">
                  Sign Up
                </Link>
              </div>
            )}
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
            {user ? (
              <Link href="/profile" className="p-2 text-white hover:text-amber-light transition-colors">
                <User className="h-5 w-5" />
              </Link>
            ) : (
              <Link href="/auth/login" className="p-2 text-white hover:text-amber-light transition-colors">
                <User className="h-5 w-5" />
              </Link>
            )}
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
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="block py-2 text-sm text-white/90 hover:text-amber-light transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left py-2 text-sm text-white/90 hover:text-amber-light transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block py-2 text-sm text-white/90 hover:text-amber-light transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block py-2 text-sm text-white/90 hover:text-amber-light transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}