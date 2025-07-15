import Link from 'next/link';
import { SectionCard } from '@/components/SectionCard';

export default function Home() {
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
    <div className="h-screen flex flex-col">
      <div className="flex-1 container max-w-7xl mx-auto px-4 py-1 flex flex-col">
        {/* Hero Section - Ultra Compact */}
        <div className="text-center py-2">
          <h1 className="text-2xl font-bold text-gray-900">Nothobile</h1>
          <p className="text-sm text-gray-600">Organic Indigenous Medicine</p>
          <p className="text-xs text-gray-500">Eastern Cape, South Africa</p>
        </div>

        {/* Explore Products Button */}
        <div className="py-1">
          <Link
            href="/products"
            className="block w-full bg-gray-900 text-white text-center py-2 rounded-md hover:bg-gray-800 transition-colors"
          >
            Explore Products
          </Link>
        </div>

        {/* Shop by Section */}
        <div className="py-1">
          <h2 className="text-lg font-semibold mb-1">Shop by Section</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-1">
            <SectionCard
              title="Human Wellness"
              icon={<span className="text-2xl">🧘‍♀️</span>}
              href="/products?section=wellness"
              gradient="from-green-500 to-green-600"
              categories={humanWellnessCategories}
            />
            
            <SectionCard
              title="Animal Wellness"
              icon={<span className="text-2xl">🐾</span>}
              href="/products?section=animal"
              gradient="from-blue-500 to-blue-600"
              categories={animalWellnessCategories}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
