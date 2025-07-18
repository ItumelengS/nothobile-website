import Link from 'next/link';
import { ReactNode } from 'react';
// Using regular img tag to avoid Next.js Image component issues

interface SectionCardProps {
  title: string;
  icon: ReactNode;
  href: string;
  gradient: string;
  image: string;
  moveDown?: string;
  zoom?: number;
  categories: {
    icon: string;
    name: string;
    status: string;
  }[];
}

export function SectionCard({ title, icon, href, gradient, image, moveDown = '0', zoom = 1, categories }: SectionCardProps) {
  return (
    <div className="relative rounded-lg overflow-hidden h-full">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="w-full h-full relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              <img
                src={`/img/${image}`}
                alt={title}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: `center ${moveDown}`,
                  transform: `scale(${zoom})`,
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Gradient Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-90`} />
      
      {/* Content */}
      <div className="relative z-10 p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h2 className="text-lg font-bold text-white drop-shadow-md">{title}</h2>
        </div>
        
        <div className="space-y-1 mb-3 flex-1">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-white/90 drop-shadow-sm">
              <span>{category.icon}</span>
              <span>{category.name}</span>
              <span className="text-xs opacity-80">({category.status})</span>
            </div>
          ))}
        </div>
        
        <Link
          href={href}
          className="block w-full bg-white/20 hover:bg-white/30 text-center py-2 rounded-md font-medium text-white transition-colors backdrop-blur-sm"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}