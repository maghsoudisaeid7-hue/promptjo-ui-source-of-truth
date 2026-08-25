import React, { useMemo } from 'react';
import { TrendingSearchItem, PopularSearchBarConfig } from '../types';

interface TrendingSearchBarProps {
  items: TrendingSearchItem[];
  config?: PopularSearchBarConfig;
  onSelectTag: (tagTitle: string) => void;
  selectedTag?: string;
}

export const TrendingSearchBar: React.FC<TrendingSearchBarProps> = ({
  items,
  config,
  onSelectTag,
  selectedTag,
}) => {
  const displayItems = useMemo(() => {
    let list: TrendingSearchItem[] = [];

    if (config?.mode === 'user_searches') {
      list = [
        { id: 'us1', title: 'کدنویسی پایتون', isHot: true },
        { id: 'us2', title: 'لوگو v6 Midjourney', isHot: true },
        { id: 'us3', title: 'مقاله تولید محتوا' },
        { id: 'us4', title: 'ChatGPT پرامپت' },
        { id: 'us5', title: 'تحلیل داده مشتریان' },
        { id: 'us6', title: 'استراتژی دیجیتال مارکتینگ' },
        { id: 'us7', title: 'تولید تصویر DALL-E' },
      ];
    } else if (config?.mode === 'external') {
      list = [
        { id: 'ext1', title: 'Claude 3.5 Sonnet', isHot: true },
        { id: 'ext2', title: 'Stable Diffusion XL' },
        { id: 'ext3', title: 'Sora Video Prompt' },
        { id: 'ext4', title: 'پست اینستاگرام HOOK' },
        { id: 'ext5', title: 'طراحی UI با هوش مصنوعی' },
      ];
    } else {
      list = items && items.length > 0 ? items : [
        { id: 't1', title: 'هوش مصنوعی', isHot: true },
        { id: 't2', title: 'تولید مارکتینگ' },
        { id: 't3', title: 'Midjourney', isHot: true },
        { id: 't4', title: 'تحلیل داده' },
        { id: 't5', title: 'تولید محتوا' },
        { id: 't6', title: 'برنامه‌نویسی' },
      ];
    }

    if (config?.randomize) {
      list = [...list].sort(() => 0.5 - Math.random());
    }

    const limit = config?.count || 8;
    return list.slice(0, limit);
  }, [items, config]);

  return (
    <section className="w-full bg-[#1C1F26] border-b border-[#3A4150] py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
        
        {/* Label on Right */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#A8B0C0] shrink-0 select-none">
          <svg className="w-4 h-4 text-[#D97757]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <span className="whitespace-nowrap">محبوب‌ترین جستجوها:</span>
          {config?.mode === 'user_searches' && (
            <span className="text-[10px] bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/20 font-sans">🔥 سرچ کاربران</span>
          )}
          {config?.mode === 'external' && (
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 font-sans">🌐 API / کد</span>
          )}
        </div>

        {/* Scrollable Horizontal Inline Text Links Container with Thin Dividers */}
        <div className="flex items-center overflow-x-auto no-scrollbar py-0.5 scroll-smooth">
          {displayItems.map((item, index) => {
            const isSelected = selectedTag === item.title;
            return (
              <React.Fragment key={item.id || index}>
                <button
                  onClick={() => onSelectTag(item.title)}
                  className={`text-xs font-medium whitespace-nowrap transition-colors duration-150 flex items-center gap-1 ${
                    isSelected
                      ? 'text-[#D97757] font-semibold'
                      : 'text-slate-300 hover:text-[#D97757]'
                  }`}
                >
                  <span>{item.title}</span>
                </button>
                {index < displayItems.length - 1 && (
                  <span className="inline-block w-px h-3 bg-slate-700/60 mx-3 shrink-0 select-none" />
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>
    </section>
  );
};
