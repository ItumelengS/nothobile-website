import Link from 'next/link';
import { ReactNode } from 'react';
import { easternCapeElements } from '@/lib/weather';

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
    <Link href={href} className="relative block rounded-lg overflow-hidden h-full min-h-[280px] group">
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
      
      {/* Gradient Overlay with Eastern Cape pattern */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-90`} />
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: title.includes('Human') ? 
            easternCapeElements.patterns.aloe : 
            easternCapeElements.patterns.xhosa,
          backgroundSize: '20px 20px'
        }} 
      />
      
      {/* Content */}
      <div className="relative z-10 p-4 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h2 className="text-lg font-bold text-white drop-shadow-md flex items-center gap-1">
            {title}
            <span className="text-sm">{title.includes('Human') ? '🏔️' : '🌊'}</span>
          </h2>
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
        
        <div className="w-full text-center py-2 px-4 font-semibold text-white bg-black/20 hover:bg-black/30 transition-colors backdrop-blur-sm border-t border-white/20">
          View Details
        </div>
      </div>
    </Link>
  );
}