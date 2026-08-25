import React from 'react';
import { BannerItem } from '../types';
import { ArrowLeft, Megaphone } from 'lucide-react';

interface BannerSlotProps {
  banners?: BannerItem[];
  position: 'after_hero' | 'after_categories' | 'between_prompts' | 'before_newsletter' | 'before_footer';
  currentPage?: string;
}

export const BannerSlot: React.FC<BannerSlotProps> = ({
  banners = [],
  position,
  currentPage = 'home',
}) => {
  // Find matching active banners for this position and page
  const activeBanners = banners
    .filter((b) => {
      if (!b.enabled) return false;
      const matchesPosition =
        b.position === position || (Array.isArray(b.positions) && b.positions.includes(position));
      if (!matchesPosition) return false;
      if (b.pages && b.pages.length > 0 && !b.pages.includes(currentPage)) return false;
      return true;
    })
    .sort((a, b) => (a.priority || 1) - (b.priority || 1));

  // If no banner is assigned/enabled, render NOTHING
  if (activeBanners.length === 0) {
    return null;
  }

  const firstBanner = activeBanners[0];
  const is2Col = firstBanner.columns === '2' && activeBanners.length >= 2;
  const bannersToRender = is2Col ? activeBanners.slice(0, 2) : [firstBanner];

  return (
    <section className="w-full bg-[#1C1F26] py-6 border-b border-[#3A4150]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid ${is2Col ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-6`}>
          {bannersToRender.map((activeBanner) => {
            const size = activeBanner.size || 'standard';
            const paddingClass =
              size === 'compact'
                ? 'p-4 sm:p-5'
                : size === 'tall'
                ? 'p-8 sm:p-12'
                : 'p-6 sm:p-8';
            
            const titleClass =
              size === 'compact'
                ? 'text-lg sm:text-xl font-bold'
                : size === 'tall'
                ? 'text-2xl sm:text-3xl font-black'
                : 'text-xl sm:text-2xl font-extrabold';

            const desktopImg = activeBanner.desktopImage || activeBanner.imageUrl;
            const mobileImg = activeBanner.mobileImage || activeBanner.mobileImageUrl || desktopImg;
            const badge = activeBanner.badgeText || '📢 تبلیغات و پیام ویژه';
            const buttonText = activeBanner.buttonText || 'ثبت‌نام در دوره ←';

            return (
              <div
                key={activeBanner.id || activeBanner.title}
                className="relative rounded-2xl overflow-hidden border border-[#3A4150] bg-[#282D38] group shadow-xl hover:border-[#D97757]/50 transition-all duration-300"
              >
                {/* Background Images for Responsive Desktop vs Mobile */}
                {desktopImg && (
                  <div className="absolute inset-0 z-0 opacity-25 group-hover:opacity-35 transition-opacity duration-500">
                    <picture>
                      {mobileImg && (
                        <source media="(max-width: 640px)" srcSet={mobileImg} />
                      )}
                      <img
                        src={desktopImg}
                        alt={activeBanner.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#282D38] via-[#282D38]/80 to-transparent" />
                  </div>
                )}

                {/* Banner Content */}
                <div className={`relative z-10 ${paddingClass} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6`}>
                  
                  <div className="space-y-2 max-w-2xl text-right">
                    {badge && (
                      <div
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D97757]/20 border border-[#D97757]/40 text-xs font-bold"
                        style={{ color: activeBanner.badgeTextColor || '#D97757' }}
                      >
                        <Megaphone size={13} />
                        <span>{badge}</span>
                      </div>
                    )}
                    <h3
                      className={`${titleClass} leading-tight`}
                      style={{ color: activeBanner.titleColor || '#FFFFFF' }}
                    >
                      {activeBanner.title}
                    </h3>
                    {activeBanner.description && (
                      <p
                        className="text-xs sm:text-sm leading-relaxed"
                        style={{ color: activeBanner.descColor || '#CBD5E1' }}
                      >
                        {activeBanner.description}
                      </p>
                    )}
                  </div>

                  {/* Action Button */}
                  {buttonText && (
                    <a
                      href={activeBanner.link || '#'}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold shadow-glow-sm hover:brightness-110 hover:scale-105 active:scale-95 transition-all shrink-0"
                      style={{
                        backgroundColor: activeBanner.buttonBgColor || '#D97757',
                        color: activeBanner.buttonTextColor || '#FFFFFF',
                      }}
                    >
                      <span>{buttonText}</span>
                      <ArrowLeft size={16} />
                    </a>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
