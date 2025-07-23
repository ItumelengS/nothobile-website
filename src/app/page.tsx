'use client';

import Link from 'next/link';
import { SectionCard } from '@/components/SectionCard';
import { useWeather } from '@/context/WeatherContext';
import { easternCapeElements } from '@/lib/weather';

export default function Home() {
  const { condition, themeName, isLoading } = useWeather();
  
  const humanWellnessCategories = [
    { icon: '👶', name: 'Children Wellness', status: '1 item' },
    { icon: '🌱', name: 'Digestive Health', status: 'Coming soon' },
    { icon: '🛡️', name: 'Immune Support', status: 'Coming soon' },
    { icon: '🌿', name: 'Traditional Healing', status: 'Coming soon' },
  ];

  const animalWellnessCategories = [
    { icon: '🐕', name: 'Pet Care', status: 'Coming soon' },
    { icon: '🐄', name: 'Livestock Health', status: 'Coming soon' },
    { icon: '🦌', name: 'Wildlife Care', status: 'Coming soon' },
    { icon: '🥕', name: 'Animal Nutrition', status: 'Coming soon' },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Plants */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        {/* Top Left Corner - Fern */}
        <div className="absolute -top-20 -left-20 text-6xl text-nature rotate-12 animate-pulse">
          🌿
        </div>
        {/* Top Right Corner - Aloe */}
        <div className="absolute top-10 -right-10 text-5xl text-nature-dark -rotate-12">
          🪴
        </div>
        {/* Bottom Left - Wild Herbs */}
        <div className="absolute -bottom-10 -left-10 text-4xl text-earth rotate-45">
          🌾
        </div>
        {/* Bottom Right - Spekboom */}
        <div className="absolute -bottom-16 -right-16 text-7xl text-nature rotate-12 animate-pulse">
          🌿
        </div>
        {/* Center Background - Scattered leaves */}
        <div className="absolute top-1/4 left-1/4 text-3xl text-nature/50 rotate-45">🍃</div>
        <div className="absolute top-3/4 right-1/4 text-2xl text-earth/50 -rotate-45">🍃</div>
        <div className="absolute top-1/2 left-1/3 text-4xl text-nature/30 rotate-12">🌱</div>
      </div>
      
      <div className="flex-1 container max-w-7xl mx-auto px-4 py-2 flex flex-col relative z-10">
        {/* Hero Section - Compact */}
        <div className="text-center py-1">
          <h1 className="text-3xl font-bold text-earth drop-shadow-sm flex items-center justify-center gap-2">
            <span className="text-2xl">🌿</span>
            Nothobile
            <span className="text-2xl">🏔️</span>
          </h1>
          <p className="text-sm text-nature font-medium">Organic Indigenous Medicine</p>
          <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            <span>🌊</span>
            <span>Eastern Cape, South Africa</span>
            <span>☀️</span>
          </div>
          {!isLoading && (
            <p className="text-xs font-medium mt-1" style={{ color: easternCapeElements.colors.ochre }}>
              {themeName} • Inspired by our {condition} weather
            </p>
          )}
        </div>

        {/* Explore Products Button */}
        <div>
          <Link
            href="/products"
            className="block w-full bg-amber text-earth-dark font-semibold text-center py-3 rounded-md hover:bg-amber-light transform hover:scale-105 transition-all shadow-md"
          >
            Explore Products
          </Link>
        </div>

        {/* Shop by Section */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-earth">Shop by Section</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            <SectionCard
              title="Human Wellness"
              icon={<span className="text-2xl">🧘‍♀️</span>}
              href="/products?section=wellness"
              gradient="from-nature-dark/90 to-nature/80"
              image="humanW.jpg"
              moveDown="30%"
              categories={humanWellnessCategories}
            />
            
            <SectionCard
              title="Animal Wellness"
              icon={<span className="text-2xl">🐾</span>}
              href="/products?section=animal"
              gradient="from-earth-dark/90 to-amber-dark/80"
              image="animalW.jpg"
              moveDown="20%"
              categories={animalWellnessCategories}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
