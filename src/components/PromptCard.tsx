/** PromptCard v1.0 (Frozen) - MASTER PROMPT CARD COMPONENT */
import React from 'react';
import { PromptItemData, PromptCardDisplayOptions } from '../types';
import { Star, Eye, Copy, Check, ExternalLink, ShoppingBag } from 'lucide-react';

export interface PromptCardProps {
  item?: PromptItemData;
  prompt?: PromptItemData;
  cardOptions?: Partial<PromptCardDisplayOptions>;
  displayOptions?: Partial<PromptCardDisplayOptions>;
  isCopied?: boolean;
  glowVariant?: 'orange-purple' | 'orange-only';
  glassVariant?: 'version1' | 'version2' | 'version3';
  isDemoCard?: boolean;
  onCopyPrompt?: (promptText: string, title: string) => void;
  onCopy?: (promptText: string, title: string) => void;
  onBookmarkToggle?: (promptId: string) => void;
  onBookmark?: (promptId: string) => void;
  onOpenPromptModal?: (prompt: PromptItemData) => void;
  onSelect?: (prompt: PromptItemData) => void;
}

export const PromptCard: React.FC<PromptCardProps> = ({
  item,
  prompt,
  cardOptions,
  displayOptions,
  isCopied = false,
  glowVariant = 'orange-purple',
  glassVariant = 'version1',
  isDemoCard = false,
  onCopyPrompt,
  onCopy,
  onBookmarkToggle,
  onBookmark,
  onOpenPromptModal,
  onSelect,
}) => {
  const currentItem = item || prompt;
  if (!currentItem) return null;

  const effectiveCardOptions = cardOptions || displayOptions;
  const handleCopy = onCopyPrompt || onCopy || (() => {});
  const handleOpen = onOpenPromptModal || onSelect || (() => {});
  const handleBookmark = onBookmarkToggle || onBookmark || (() => {});

  // Configuration options for Access & Pricing
  const forceState = effectiveCardOptions?.forceState;
  const showAccess = forceState ? forceState > 1 : (effectiveCardOptions?.show_access ?? effectiveCardOptions?.showAccess ?? true);
  const showPrice = forceState ? forceState === 4 : (effectiveCardOptions?.show_price ?? effectiveCardOptions?.showPrice ?? true);

  // Determine if item is premium
  const isPremium = forceState
    ? (forceState === 3 || forceState === 4)
    : (currentItem.isFree === false || (currentItem.price !== undefined && currentItem.price > 0));

  // Helper to construct 2 to 3 categories strictly for 1-line display
  const getCategoryBadges = () => {
    const categories: string[] = [];
    if (currentItem.category) categories.push(currentItem.category);

    if (currentItem.tags && currentItem.tags.length > 0) {
      for (const tag of currentItem.tags) {
        if (!categories.includes(tag) && categories.length < 3) {
          categories.push(tag);
        }
      }
    }

    // Ensure minimum 2 categories if less than 2
    if (categories.length < 2) {
      const fallbacks = ['تحلیل', 'کسب‌وکار', 'هوش مصنوعی', 'برنامه‌نویسی'];
      for (const fb of fallbacks) {
        if (!categories.includes(fb) && categories.length < 2) {
          categories.push(fb);
        }
      }
    }

    return categories.slice(0, 3); // Maximum 3 categories
  };

  // Render Access Badge (State 2: [ رایگان ], State 3/4: [ پرمیوم ])
  const renderAccessBadge = () => {
    if (isPremium) {
      return (
        <span className="shrink-0 px-2.5 py-0.5 rounded-[8px] bg-[#7C3AED]/20 backdrop-blur-md border border-[#7C3AED]/40 text-purple-300 text-[11px] font-bold shadow-sm">
          پرمیوم
        </span>
      );
    }
    return (
      <span className="shrink-0 px-2.5 py-0.5 rounded-[8px] bg-emerald-500/20 backdrop-blur-md border border-emerald-500/35 text-emerald-400 text-[11px] font-bold shadow-sm">
        رایگان
      </span>
    );
  };

  // Render Price Badge (State 4: [ 49,000 تومان ])
  const renderPriceBadge = () => {
    if (!showPrice) return null;
    const priceVal = (currentItem.price && currentItem.price > 0) ? currentItem.price : 49000;
    const formattedPrice = priceVal.toLocaleString('fa-IR');

    return (
      <span className="shrink-0 px-2.5 py-0.5 rounded-[8px] bg-[#D97757]/20 backdrop-blur-md border border-[#D97757]/40 text-[#D97757] text-[11px] font-extrabold shadow-sm">
        {formattedPrice} تومان
      </span>
    );
  };

  // Subtle Card Hover Glow
  const hoverGlowClass =
    glowVariant === 'orange-only'
      ? 'hover:shadow-[0_8px_32px_rgba(217,119,87,0.15)] hover:border-[#D97757]/60'
      : 'hover:shadow-[0_8px_32px_rgba(217,119,87,0.15),0_0_20px_rgba(124,58,237,0.08)] hover:border-[#D97757]/60';

  // Extract numeric view count (0 => eye icon only, >= 1 => real count)
  const rawViews = typeof currentItem.views === 'number'
    ? currentItem.views
    : (typeof currentItem.views === 'string' && !isNaN(Number(currentItem.views)))
    ? Number(currentItem.views)
    : (currentItem.views_display && !isNaN(Number(currentItem.views_display)))
    ? Number(currentItem.views_display)
    : 0;

  const scoreVal = currentItem.prompt_score ?? currentItem.score ?? 0;

  return (
    <div
      data-prompt-card="true"
      onClick={() => {
        if (!isDemoCard) handleOpen(currentItem);
      }}
      className={`group relative w-[270px] min-w-[270px] max-w-[270px] h-[350px] shrink-0 mx-auto rounded-[20px] bg-[#1C1F26] border border-[#3A4150]/60 overflow-hidden shadow-lg transition-all duration-250 ease-out hover:-translate-y-[6px] ${hoverGlowClass} ${
        isDemoCard ? 'cursor-default' : 'cursor-pointer'
      } select-none`}
    >
      {/* 3. IMAGE SECTION: Background Image Preview */}
      <img
        src={currentItem.featuredImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'}
        alt={currentItem.title || 'پرامپت هوش مصنوعی'}
        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-[1.03] group-hover:brightness-[0.90] transition-all duration-250 ease-out"
        referrerPolicy="no-referrer"
      />

      {/* Dark Gradient Overlay behind title area */}
      <div 
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.42) 100%)' }}
        className="absolute inset-x-0 bottom-0 h-[45%] pointer-events-none transition-opacity duration-250 group-hover:opacity-75" 
      />

      {/* 1. PROMPT SCORE BADGE & 2. VIEW BADGE (Identical visual weight, neutral styling) */}
      {/* Top Left: Prompt Score Badge (Only when score > 0, no placeholder text when score not available) */}
      {scoreVal > 0 && (
        <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#282D38]/65 backdrop-blur-[12px] border border-white/[0.08] text-[#A8B0C0] text-xs font-medium shadow-md">
          <span className="text-[#D97757] font-black text-xs leading-none">✦</span>
          <span className="font-semibold text-slate-200">{scoreVal}</span>
        </div>
      )}

      {/* Top Right: Views Count Badge (Eye only for 0 views, Eye + count for >= 1 views) */}
      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#282D38]/65 backdrop-blur-[12px] border border-white/[0.08] text-[#A8B0C0] text-xs font-medium shadow-md">
        <Eye size={13} className="text-[#A8B0C0]" />
        {rawViews >= 1 && (
          <span>{rawViews >= 1000 ? `${(rawViews / 1000).toFixed(1).replace(/\.0$/, '')}K` : rawViews}</span>
        )}
      </div>

      {/* NORMAL STATE: Content Stack at Bottom */}
      <div className="absolute bottom-0 inset-x-0 p-4 pb-4.5 z-10 flex flex-col justify-end space-y-2 transition-opacity duration-250 group-hover:opacity-0 group-hover:pointer-events-none">
        {/* 4. TITLE */}
        <h3 
          style={{ textShadow: '0 1px 4px rgba(0,0,0,0.25)' }}
          className="text-[17px] sm:text-[18px] font-bold text-[#F8FAFC] leading-snug line-clamp-1 text-right mb-2.5"
        >
          {currentItem.title}
        </h3>

        {/* 5. CATEGORIES ROW (Min 2, Max 3 categories, strictly ONE line, no wrap, no +1, no ...) */}
        <div className="flex items-center gap-1.5 overflow-hidden flex-nowrap whitespace-nowrap w-full">
          {getCategoryBadges().map((catName, cIdx) => (
            <span
              key={cIdx}
              className="shrink-0 px-2.5 py-0.5 rounded-[8px] bg-[#282D38]/90 backdrop-blur-md border border-[#3A4150]/80 text-[#A8B0C0] text-[11px] font-medium"
            >
              {catName}
            </span>
          ))}
        </div>

        {/* 6. ACCESS & PRICING ROW (Completely separate row below categories) */}
        {(showAccess || showPrice) && (
          <div className="flex items-center gap-1.5 pt-0.5 overflow-hidden flex-nowrap whitespace-nowrap w-full">
            {showAccess && renderAccessBadge()}
            {showPrice && renderPriceBadge()}
          </div>
        )}
      </div>

      {/* HOVER STATE: Darkened Backdrop with Two-Line Description */}
      <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-250 ease-out p-4 flex flex-col justify-center pointer-events-none group-hover:pointer-events-auto">
        <div className="text-center px-3 mb-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-250 ease-out">
          <p className="text-[#F8FAFC] text-[15px] font-medium leading-relaxed line-clamp-2 drop-shadow-lg">
            {currentItem.description || 'کدنویسی تمیز، مستندسازی حرفه‌ای و بهترین روش‌های توسعه پایتون'}
          </p>
        </div>
      </div>

      {/* FLOATING GLASS TOOLBAR (CARD ACTIONS - Apple-style Floating Glass Surface) */}
      <div 
        style={
          glassVariant === 'version1'
            ? {
                background: 'rgba(40, 45, 56, 0.42)',
                backdropFilter: 'blur(32px) saturate(180%)',
                WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.35)',
              }
            : glassVariant === 'version3'
            ? {
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 35%, rgba(255, 255, 255, 0.03) 100%), rgba(40, 45, 56, 0.38)',
                backdropFilter: 'blur(34px) saturate(180%)',
                WebkitBackdropFilter: 'blur(34px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 20px 48px rgba(0, 0, 0, 0.45), 0 0 20px rgba(217, 119, 87, 0.10), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
              }
            : {
                background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 35%, rgba(255, 255, 255, 0.03) 100%), rgba(40, 45, 56, 0.38)',
                backdropFilter: 'blur(32px) saturate(180%)',
                WebkitBackdropFilter: 'blur(32px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 16px 48px rgba(0, 0, 0, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.12), 0 0 24px rgba(255, 255, 255, 0.05)',
              }
        }
        className={`absolute bottom-[20px] left-1/2 -translate-x-1/2 w-[84%] sm:w-[82%] min-h-[52px] rounded-[24px] p-[6px] flex items-center justify-between gap-2 z-30 pointer-events-none group-hover:pointer-events-auto ${
          glassVariant === 'version3'
            ? 'opacity-0 scale-[0.96] translate-y-[12px] group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-[350ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]'
            : 'opacity-0 translate-y-[20px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out'
        }`}
      >
        {/* Secondary Action: [ مشاهده ] (Neutral button sitting directly on glass) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (isDemoCard) return;
            handleOpen(currentItem);
          }}
          disabled={isDemoCard}
          className={`flex-1 h-[40px] rounded-[16px] text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 ${
            isDemoCard
              ? 'bg-transparent text-white/90 pointer-events-none cursor-default'
              : 'bg-transparent hover:bg-white/10 text-white active:scale-95 cursor-pointer'
          }`}
        >
          <ExternalLink size={14} className="text-white/90" />
          <span>مشاهده</span>
        </button>

        {/* Primary Action: Free Prompt = [ کپی پرامپت ] / Premium Prompt = [ خرید پرامپت ] (Brand Orange #D97757 with enhanced hover) */}
        {isPremium ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isDemoCard) return;
              handleOpen(currentItem);
            }}
            disabled={isDemoCard}
            className={`flex-1 h-[40px] rounded-[16px] text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-md ${
              isDemoCard
                ? 'bg-[#D97757] text-white pointer-events-none cursor-default'
                : 'bg-[#D97757] hover:bg-gradient-to-b hover:from-[#E58A66] hover:to-[#D97757] hover:shadow-[0_6px_20px_rgba(217,119,87,0.25)] hover:-translate-y-[2px] text-white active:scale-95 cursor-pointer'
            }`}
          >
            <ShoppingBag size={14} />
            <span>خرید پرامپت</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isDemoCard) return;
              handleCopy(currentItem.fullPromptText, currentItem.title);
            }}
            disabled={isDemoCard}
            className={`flex-1 h-[40px] rounded-[16px] text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-[250ms] ease-out shadow-md ${
              isDemoCard
                ? 'bg-[#D97757] text-white pointer-events-none cursor-default'
                : isCopied
                ? 'bg-emerald-600 text-white active:scale-95 cursor-pointer'
                : 'bg-[#D97757] hover:bg-gradient-to-b hover:from-[#E58A66] hover:to-[#D97757] hover:shadow-[0_6px_20px_rgba(217,119,87,0.25)] hover:-translate-y-[2px] text-white active:scale-95 cursor-pointer'
            }`}
          >
            {isCopied ? <Check size={14} /> : <Copy size={14} />}
            <span>{isCopied ? 'کپی شد!' : 'کپی پرامپت'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
