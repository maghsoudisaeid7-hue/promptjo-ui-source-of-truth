import React, { useState, useMemo, useEffect } from 'react';
import { HeaderConfig, CategoryCardData, PromptItemData, TrendingSearchItem, PopularSearchBarConfig } from '../types';
import { DynamicIcon } from './DynamicIcon';
import { MegaMenu } from './MegaMenu';
import { ChevronDown } from 'lucide-react';

interface HeaderProps {
  config: HeaderConfig;
  onLoginClick?: () => void;
  activeMenuId: string;
  onMenuClick: (id: string, href: string) => void;
  onSelectSubcategory?: (subcat: string) => void;
  categories?: CategoryCardData[];
  prompts?: PromptItemData[];
  onOpenPromptModal?: (prompt: PromptItemData) => void;
  trendingItems?: TrendingSearchItem[];
  popularSearchBarConfig?: PopularSearchBarConfig;
  onSelectTag?: (tagTitle: string) => void;
  selectedTag?: string;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onLoginClick,
  activeMenuId,
  onMenuClick,
  onSelectSubcategory,
  categories,
  trendingItems,
  popularSearchBarConfig,
  onSelectTag,
  selectedTag,
}) => {
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Default curated hot search items
  const displayHotSearchItems = useMemo(() => {
    if (trendingItems && trendingItems.length > 0) {
      return trendingItems;
    }
    return [
      { id: 'h1', title: 'تحلیل داده', isHot: true },
      { id: 'h2', title: 'برنامه‌نویسی', isHot: true },
      { id: 'h3', title: 'تولید مارکتینگ' },
      { id: 'h4', title: 'دیجیتال استراتژی' },
      { id: 'h5', title: 'تولید ویدئو' },
      { id: 'h6', title: 'تولید محتوا' },
      { id: 'h7', title: 'پرامپت‌های تبلیغاتی', isHot: true },
      { id: 'h8', title: 'پرامپت‌های انیمه' },
      { id: 'h9', title: 'پرامپت‌های تصویری', isHot: true },
    ];
  }, [trendingItems]);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 relative ${
        isScrolled
          ? 'bg-[#1C1F26]/92 backdrop-blur-xl border-b border-[#3A4150]/80 shadow-xl shadow-black/40'
          : 'bg-[#1C1F26] backdrop-blur-none border-b border-[#3A4150]'
      }`}
      onMouseLeave={() => setIsMegaMenuOpen(false)}
    >
      {/* Row 1: Main Header */}
      <div 
        className="max-w-[1440px] xl:max-w-[1680px] 2xl:max-w-[1920px] min-[2200px]:max-w-[2200px] mx-auto h-20 flex items-center justify-between"
        style={{ paddingInline: 'clamp(20px, 4vw, 48px)' }}
      >
        
        {/* Right side in RTL: Logo */}
        <div className="flex items-center gap-3">
          <a href={config.logoLinkUrl || '#'} className="flex items-center gap-2 group focus:outline-none">
            {/* Orange Brand Icon Emblem */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97757] to-[#E05A2B] flex items-center justify-center text-white shadow-glow-sm group-hover:scale-105 transition-transform duration-200">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            {/* Logo Typography */}
            <div className="flex items-center text-2xl font-bold tracking-tight">
              <span className="text-white">{config.logoTextPrimary}</span>
              <span className="text-[#D97757] ml-0.5">{config.logoTextSecondary}</span>
            </div>
          </a>
        </div>

        {/* Center: Main Navigation Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {config.menuItems.map((item) => {
            const isActive = activeMenuId === item.id;
            const isPromptsItem = item.id === 'm1' || item.label.includes('پرامپت');
            const isHighlighted = isActive || (isPromptsItem && isMegaMenuOpen);

            return (
              <div
                key={item.id}
                className="relative py-2"
                onMouseEnter={() => {
                  if (isPromptsItem) {
                    setIsMegaMenuOpen(true);
                  } else {
                    setIsMegaMenuOpen(false);
                  }
                }}
              >
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    onMenuClick(item.id, item.href);
                    if (isPromptsItem) {
                      setIsMegaMenuOpen(!isMegaMenuOpen);
                    } else {
                      setIsMegaMenuOpen(false);
                    }
                  }}
                  className={`relative py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-2 group ${
                    isHighlighted
                      ? 'text-[#D97757] font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#D97757] after:rounded-full'
                      : 'text-slate-300 hover:text-[#D97757] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-transparent group-hover:after:bg-[#D97757] after:rounded-full'
                  }`}
                >
                  <DynamicIcon
                    name={item.iconName}
                    size={18}
                    className={`transition-colors duration-200 ${
                      isHighlighted
                        ? 'text-[#D97757]'
                        : 'text-slate-300 group-hover:text-[#D97757]'
                    }`}
                  />
                  <span>{item.label}</span>
                  {isPromptsItem && (
                    <ChevronDown
                      size={15}
                      className={`transition-transform duration-200 ${
                        isMegaMenuOpen
                          ? 'rotate-180 text-[#D97757]'
                          : 'rotate-0 text-slate-300 group-hover:text-[#D97757]'
                      }`}
                    />
                  )}
                </a>
              </div>
            );
          })}
        </nav>

        {/* Left side in RTL: Login Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onLoginClick}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D97757] to-[#E05A2B] text-white text-xs sm:text-sm font-semibold shadow-glow-sm hover:shadow-glow-md hover:brightness-110 active:scale-95 transition-all duration-200"
          >
            <DynamicIcon name={config.loginButtonIcon || 'User'} size={18} />
            <span>{config.loginButtonText}</span>
          </button>
        </div>

      </div>

      {/* Row 2: Sub-row for Popular / Hot Searches */}
      {popularSearchBarConfig?.enabled !== false && (
        <div className={`w-full border-t border-[#3A4150]/60 py-2.5 transition-colors duration-200 ${
          isScrolled ? 'bg-[#181B22]/85' : 'bg-[#181B22]'
        }`}>
          <div 
            className="max-w-[1440px] xl:max-w-[1680px] 2xl:max-w-[1920px] min-[2200px]:max-w-[2200px] mx-auto flex items-center gap-3 overflow-hidden"
            style={{ paddingInline: 'clamp(20px, 4vw, 48px)' }}
          >
            <div className="flex items-center overflow-x-auto no-scrollbar py-0.5 scroll-smooth gap-1">
              {displayHotSearchItems.map((item, index) => {
                const isSelected = selectedTag === item.title;
                return (
                  <React.Fragment key={item.id || index}>
                    <button
                      onClick={() => {
                        if (onSelectTag) {
                          onSelectTag(item.title);
                        }
                      }}
                      className={`text-xs font-medium whitespace-nowrap transition-colors duration-150 flex items-center gap-1 cursor-pointer ${
                        isSelected
                          ? 'text-[#D97757] font-semibold'
                          : 'text-slate-300 hover:text-[#D97757]'
                      }`}
                    >
                      <span>{item.title}</span>
                    </button>
                    {index < displayHotSearchItems.length - 1 && (
                      <span className="inline-block w-px h-3 bg-slate-700/60 mx-3 shrink-0 select-none" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Mega Menu Dropdown */}
      <MegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
        categories={categories}
        onSelectSubcategory={(subcat) => {
          if (onSelectSubcategory) {
            onSelectSubcategory(subcat);
          }
        }}
      />

      {/* Mobile Nav Drawer */}
      <div className="md:hidden border-t border-[#3A4150] bg-[#1C1F26]/95 px-4 py-3 flex items-center justify-around">
        {config.menuItems.map((item) => {
          const isActive = activeMenuId === item.id;
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                onMenuClick(item.id, item.href);
              }}
              className={`flex items-center gap-1.5 py-1 text-xs font-medium transition-colors ${
                isActive ? 'text-[#D97757] font-bold border-b-2 border-[#D97757]' : 'text-slate-300'
              }`}
            >
              <DynamicIcon name={item.iconName} size={16} />
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
    </header>
  );
};


