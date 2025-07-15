import Link from 'next/link';
import { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  href: string;
  gradient: string;
  categories: {
    icon: string;
    name: string;
    status: string;
  }[];
}

export function SectionCard({ title, icon, href, gradient, categories }: SectionCardProps) {
  return (
    <div className={`rounded-lg p-4 text-white bg-gradient-to-r ${gradient}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      
      <div className="space-y-1 mb-3">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center gap-2 text-sm opacity-90">
            <span>{category.icon}</span>
            <span>{category.name}</span>
            <span className="text-xs opacity-75">({category.status})</span>
          </div>
        ))}
      </div>
      
      <Link
        href={href}
        className="block w-full bg-white/20 hover:bg-white/30 text-center py-2 rounded-md font-medium transition-colors"
      >
        Shop Now
      </Link>
    </div>
  );
}