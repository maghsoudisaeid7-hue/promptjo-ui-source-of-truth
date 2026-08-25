import React from 'react';
import { CategoryCardData } from '../types';
import { DynamicIcon } from './DynamicIcon';

interface CategorySectionProps {
  categories: CategoryCardData[];
  onSelectCategory: (categorySlug: string) => void;
  selectedCategory: string;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  onSelectCategory,
  selectedCategory,
}) => {
  const activeCategories = categories.filter((c) => c.enabled !== false);
  const count = activeCategories.length;

  return (
    <section className="w-full bg-[#1C1F26] py-14 border-b border-[#3A4150]">
      <div 
        className="max-w-[1440px] xl:max-w-[1680px] 2xl:max-w-[1920px] min-[2200px]:max-w-[2200px] mx-auto"
        style={{ paddingInline: 'clamp(20px, 4vw, 48px)' }}
      >
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-7 rounded-full bg-[#D97757]" />
            <span>دسته‌بندی‌های ویژه</span>
          </h2>
        </div>

        {/* Auto-Adjusting Repeater Category Cards Grid */}
        <div className={`grid gap-5 ${
          count <= 2 
            ? 'grid-cols-1 sm:grid-cols-2' 
            : count === 3 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : count === 4
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
        }`}>
          {activeCategories.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            const isImageIcon = cat.iconName && (cat.iconName.startsWith('http://') || cat.iconName.startsWith('https://') || cat.iconName.startsWith('/'));

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.slug)}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-[#282D38] border text-right transition-all duration-300 p-5 min-h-[210px] focus:outline-none w-full ${
                  isSelected
                    ? 'border-[#D97757] shadow-glow-md ring-2 ring-[#D97757]/40'
                    : 'border-[#3A4150] hover:border-[#D97757]/60 hover:shadow-2xl hover:-translate-y-1'
                }`}
              >
                {/* Dark image background with overlay */}
                <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-300">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1F26] via-[#1C1F26]/80 to-transparent" />
                </div>

                {/* Top Row: Icon emblem (Left) and Active Badge (Top Right) */}
                <div className="relative z-10 flex items-center justify-between" dir="ltr">
                  <div className="w-10 h-10 rounded-xl bg-[#232833]/88 backdrop-blur-md border border-[#3A4150] flex items-center justify-center text-[#D97757] group-hover:scale-110 group-hover:border-[#D97757] group-hover:bg-[#D97757]/20 transition-all duration-300">
                    {isImageIcon ? (
                      <img src={cat.iconName} alt={cat.name} className="w-6 h-6 object-contain" />
                    ) : (
                      <DynamicIcon name={cat.iconName} size={20} />
                    )}
                  </div>

                  {/* Active Category State Indicator Badge */}
                  {isSelected && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1C1F26]/90 border border-[#D97757]/40 text-[#D97757] text-[10px] sm:text-[11px] font-bold shadow-md backdrop-blur-md" dir="rtl">
                      <span className="w-2 h-2 rounded-full bg-[#D97757] shadow-[0_0_8px_#D97757] animate-active-pulse" />
                      <span>فعال</span>
                    </div>
                  )}
                </div>

                {/* Bottom Content: Name, Subtitle & Description */}
                <div className="relative z-10 pt-8">
                  {cat.subtitle && (
                    <span className="text-[10px] font-semibold text-[#D97757] uppercase tracking-wider block mb-1">
                      {cat.subtitle}
                    </span>
                  )}
                  <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#D97757] transition-colors mb-1.5">
                    {cat.name}
                  </h3>
                  <p className="text-xs font-normal text-[#A8B0C0] leading-relaxed line-clamp-2">
                    {cat.description || cat.promptCount}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
