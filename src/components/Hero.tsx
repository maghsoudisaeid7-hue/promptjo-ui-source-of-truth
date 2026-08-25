import React, { useState } from 'react';
import { HeroConfig, CategoryCardData, PromptItemData, HeroFloatingCard } from '../types';
import { Search } from 'lucide-react';
import { SearchComponent } from './SearchComponent';
import { PromptCard } from './PromptCard';
import { useElementWidth, MeasurementBadge } from './UXLayoutInspector';

interface HeroProps {
  config: HeroConfig;
  categories: CategoryCardData[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (categorySlug: string) => void;
  onSearchSubmit: () => void;
  onOpenPromptModal?: (prompt: PromptItemData) => void;
  onCopyPrompt?: (promptText: string, title: string) => void;
  isInspectorEnabled?: boolean;
}

const HOME_CATEGORIES = [
  { name: 'تصویر', slug: 'image' },
  { name: 'ویدیو', slug: 'video' },
  { name: 'برنامه‌نویسی', slug: 'programming' },
  { name: 'مارکتینگ', slug: 'marketing' },
  { name: 'موسیقی', slug: 'music' },
];

const PARTICLES = [
  { id: 1, top: '10%', left: '6%', size: 3, opacity: 0.22, duration: 8, delay: 0 },
  { id: 2, top: '22%', left: '18%', size: 2, opacity: 0.18, duration: 10, delay: 1.5 },
  { id: 3, top: '68%', left: '12%', size: 4, opacity: 0.25, duration: 9, delay: 0.8 },
  { id: 4, top: '82%', left: '28%', size: 2, opacity: 0.15, duration: 11, delay: 2.1 },
  { id: 5, top: '15%', left: '42%', size: 3, opacity: 0.2, duration: 7, delay: 0.3 },
  { id: 6, top: '45%', left: '35%', size: 4, opacity: 0.28, duration: 10.5, delay: 1.2 },
  { id: 7, top: '78%', left: '48%', size: 2, opacity: 0.18, duration: 8.5, delay: 2.5 },
  { id: 8, top: '12%', left: '65%', size: 3, opacity: 0.22, duration: 9, delay: 0.5 },
  { id: 9, top: '38%', left: '76%', size: 2, opacity: 0.24, duration: 10, delay: 1.8 },
  { id: 10, top: '62%', left: '88%', size: 4, opacity: 0.3, duration: 7.5, delay: 0.2 },
  { id: 11, top: '85%', left: '70%', size: 3, opacity: 0.18, duration: 11.5, delay: 2.4 },
  { id: 12, top: '25%', left: '94%', size: 2, opacity: 0.22, duration: 8.8, delay: 1.0 },
  { id: 13, top: '52%', left: '4%', size: 3, opacity: 0.19, duration: 10, delay: 0.6 },
  { id: 14, top: '90%', left: '16%', size: 2, opacity: 0.25, duration: 9.2, delay: 1.9 },
  { id: 15, top: '8%', left: '32%', size: 3, opacity: 0.17, duration: 8.2, delay: 2.8 },
  { id: 16, top: '50%', left: '58%', size: 4, opacity: 0.26, duration: 7.8, delay: 1.1 },
  { id: 17, top: '72%', left: '38%', size: 2, opacity: 0.2, duration: 12, delay: 0.4 },
  { id: 18, top: '30%', left: '15%', size: 3, opacity: 0.22, duration: 8.6, delay: 2.0 },
];

const DEFAULT_FLOATING_CARDS: HeroFloatingCard[] = [
  {
    id: 'fc1',
    model: 'Midjourney',
    modelLogo: '🎨',
    title: 'توسعه‌دهنده پایتون حرفه‌ای',
    description: 'کدنویسی تمیز، مستندسازی حرفه‌ای و بهترین روش‌های توسعه پایتون',
    category: 'پایتون',
    tags: ['کدنویسی', 'برنامه‌نویسی'],
    rating: 4.8,
    views: '5.6K',
    accentColor: '#D97757',
    isFree: true,
    price: 0,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    fullPromptText: 'اصول و استاندارد کدهای پایتون را با تایپ هینت کامل و تست‌های جامع توسعه دهید.',
  },
  {
    id: 'fc2',
    model: 'ChatGPT',
    modelLogo: '🤖',
    title: 'تولید محتوای وبلاگ حرفه‌ای',
    description: 'یک مقاله سئو شده و جذاب با استاندارد و اصول بازاریابی محتوا.',
    category: 'تولید محتوا',
    tags: ['سئو', 'بازاریابی'],
    rating: 4.9,
    views: '12.4K',
    accentColor: '#10B981',
    isFree: true,
    price: 0,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    fullPromptText: 'یک مقاله ۲۰۰۰ کلمه‌ای کاملا سئو شده با تیترهای جذاب و لحن متقاعدکننده بنویسید.',
  },
  {
    id: 'fc3',
    model: 'Claude',
    modelLogo: '🧠',
    title: 'تحلیل داده‌های کسب‌وکار',
    description: 'تحلیل داده‌ها و ارائه بینش‌های کاربردی برای رشد کسب‌وکار.',
    category: 'تحلیل داده',
    tags: ['داده‌کاوی', 'استراتژی'],
    rating: 4.7,
    views: '6.3K',
    accentColor: '#F59E0B',
    isFree: false,
    price: 49000,
    image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
    fullPromptText: 'جدول داده‌های فروش را تحلیل کرده و گزارش استراتژیک نقاط قوت و ضعف را ارائه دهید.',
  },
];

export const Hero: React.FC<HeroProps> = ({
  config,
  categories,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onSearchSubmit,
  onOpenPromptModal,
  onCopyPrompt,
  isInspectorEnabled = true,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isInteractiveHovered, setIsInteractiveHovered] = useState(false);

  // Measurement Refs for UX Layout Inspector
  const [heroRef, heroWidth] = useElementWidth<HTMLDivElement>();
  const [titleRef, titleWidth] = useElementWidth<HTMLDivElement>();
  const [searchRef, searchWidth] = useElementWidth<HTMLDivElement>();
  const [categoriesRef, categoriesWidth] = useElementWidth<HTMLDivElement>();
  const [cardsRef, cardsWidth] = useElementWidth<HTMLDivElement>();

  // Helper to render individual floating card
  const renderSingleHeroCard = (
    cardIndex: number,
    delaySec: string,
    rotateClass: string,
    posClass: string,
    widthClass: string
  ) => {
    const cardData = config.floatingCards?.[cardIndex] || DEFAULT_FLOATING_CARDS[cardIndex] || DEFAULT_FLOATING_CARDS[0];
    const isCopied = copiedId === cardData.id;

    const promptItem: PromptItemData = {
      id: cardData.id || `fc_${cardIndex}`,
      title: cardData.title,
      description: cardData.description,
      fullPromptText: cardData.fullPromptText || cardData.description,
      featuredImage: cardData.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      category: cardData.category || 'کدنویسی',
      aiModel: cardData.model || 'ChatGPT',
      rating: cardData.rating || 4.8,
      views: cardData.views || '5.6K',
      tags: cardData.tags || ['کدنویسی', 'برنامه‌نویسی'],
      isFree: cardData.isFree !== undefined ? cardData.isFree : true,
      price: cardData.price || 0,
    };

    return (
      <div
        key={cardData.id || cardIndex}
        style={{ animation: `heroSlowFloat 8s ease-in-out infinite ${delaySec}` }}
        className={`absolute ${posClass} transition-all duration-300 ease-out group hover:z-40 ${widthClass} ${rotateClass} hover:rotate-0`}
      >
        <PromptCard
          item={promptItem}
          isCopied={isCopied}
          isDemoCard={true}
          onCopyPrompt={(text, title) => {
            setCopiedId(promptItem.id);
            if (onCopyPrompt) onCopyPrompt(text, title);
            setTimeout(() => setCopiedId(null), 2500);
          }}
          onOpenPromptModal={onOpenPromptModal || (() => {})}
        />
      </div>
    );
  };

  return (
    <section className="relative w-full overflow-hidden bg-[#1C1F26] py-12 md:py-20 lg:py-24 border-b border-[#3A4150]">
      {/* Keyframe Style for Floating Particles & Slow Floating Cards */}
      <style>{`
        @keyframes heroParticleFloat {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-16px) translateX(8px);
          }
        }
        @keyframes heroSlowFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
      
      {/* Layer 2: Soft Blurred Ambient Gradients (Warm Orange & Deep Purple) */}
      <div className="absolute top-[-10%] right-[10%] w-[650px] h-[650px] bg-[#D97757]/12 rounded-full blur-[170px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] left-[5%] w-[600px] h-[600px] bg-[#7C3AED]/12 rounded-full blur-[170px] pointer-events-none z-0" />

      {/* Layer 3: Subtle Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white/80 transition-all duration-500"
            style={{
              top: p.top,
              left: p.left,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationName: 'heroParticleFloat',
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              animationPlayState: isInteractiveHovered ? 'paused' : 'running',
            }}
          />
        ))}
      </div>

      <div 
        ref={heroRef}
        className={`max-w-[1440px] xl:max-w-[1680px] 2xl:max-w-[1920px] min-[2200px]:max-w-[2200px] mx-auto relative z-10 ${
          isInspectorEnabled ? 'ring-2 ring-red-500/80 bg-red-500/5 rounded-2xl p-4' : ''
        }`}
        style={{ paddingInline: 'clamp(20px, 4vw, 48px)' }}
      >
        {isInspectorEnabled && (
          <MeasurementBadge
            label="Hero Content Container (RED)"
            widthPx={heroWidth}
            colorClass="text-red-400 border-red-500/40"
            bgClass="bg-red-950/90"
            position="top-right"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* RIGHT COLUMN (Text, Search, Category Chips) */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-5 text-right pr-5 md:pr-8">
            
            {/* Title Block Wrapper (GREEN) - Target: 700px */}
            <div
              ref={titleRef}
              className={`w-full max-w-[700px] relative flex flex-col items-start space-y-5 ${
                isInspectorEnabled ? 'ring-2 ring-emerald-500/80 bg-emerald-500/5 rounded-xl p-3' : ''
              }`}
            >
              {isInspectorEnabled && (
                <MeasurementBadge
                  label="Title & Subtitle Block (GREEN)"
                  widthPx={titleWidth}
                  colorClass="text-emerald-400 border-emerald-500/40"
                  bgClass="bg-emerald-950/90"
                  position="top-left"
                />
              )}

              {/* Small Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D97757]/15 border border-[#D97757]/30 text-[#D97757] text-xs sm:text-sm font-semibold tracking-wide shadow-glow-sm max-w-full">
                <span className="w-2 h-2 rounded-full bg-[#D97757] animate-pulse shrink-0" />
                <span className="truncate">{config.badgeText}</span>
              </div>

              {/* Main Title */}
              <h1 
                className="font-extrabold tracking-tight text-[#F8FAFC] max-w-[700px]"
                style={{ fontSize: 'clamp(32px, 3.8vw, 56px)', lineHeight: 1.35 }}
              >
                <span className="block mb-1">بهترین پرامپت‌ها برای</span>
                <span className="block bg-gradient-to-r from-[#D97757] via-[#F59E0B] to-[#E58A66] bg-clip-text text-transparent drop-shadow-sm">
                  ایده‌های بزرگ
                </span>
              </h1>

              {/* Subtitle */}
              <p 
                className="font-normal max-w-[650px]"
                style={{ fontSize: 'clamp(13px, 1.2vw, 15px)', lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.78)' }}
              >
                {config.subtitle || 'جستجو در هزاران پرامپت آماده برای ابزارهای هوش مصنوعی و الهام گرفتن از حرفه‌ای‌ترین کاربران دنیا.'}
              </p>
            </div>

            {/* Search Box Container (32px spacing below subtitle) */}
            <div className="w-full max-w-[620px] mt-[32px]">
              {/* Search Component Wrapper (BLUE) - Target: 620px */}
              <div
                ref={searchRef}
                className={`relative w-full ${
                  isInspectorEnabled ? 'ring-2 ring-sky-500/80 bg-sky-500/5 rounded-2xl p-2' : ''
                }`}
              >
                {isInspectorEnabled && (
                  <MeasurementBadge
                    label="Search Component (BLUE)"
                    widthPx={searchWidth}
                    colorClass="text-sky-400 border-sky-500/40"
                    bgClass="bg-sky-950/90"
                    position="top"
                  />
                )}
                <SearchComponent
                  value={searchQuery}
                  onChange={onSearchChange}
                  onSubmit={onSearchSubmit}
                  placeholder={config.searchPlaceholder || "جستجو در بین هزاران پرامپت..."}
                  buttonText={config.searchButtonText || "جستجو"}
                  onHoverChange={setIsInteractiveHovered}
                />
              </div>

              {/* Section Title with 48px spacing above */}
              <div className="mt-[48px] text-center">
                <span
                  className="inline-block text-[13px] font-medium tracking-[0.12em]"
                  style={{ color: 'rgba(255, 255, 255, 0.65)' }}
                >
                  کاوش بر اساس موضوع
                </span>
              </div>

              {/* 5 Category Chips with 20px spacing above (PURPLE) - Target: 620px */}
              <div
                ref={categoriesRef}
                className={`relative mt-[20px] w-full max-w-[620px] ${
                  isInspectorEnabled ? 'ring-2 ring-purple-500/80 bg-purple-500/5 rounded-2xl p-2' : ''
                }`}
              >
                {isInspectorEnabled && (
                  <MeasurementBadge
                    label="Categories Row (PURPLE)"
                    widthPx={categoriesWidth}
                    colorClass="text-purple-400 border-purple-500/40"
                    bgClass="bg-purple-950/90"
                    position="top"
                  />
                )}
                <div 
                  onMouseEnter={() => setIsInteractiveHovered(true)}
                  onMouseLeave={() => setIsInteractiveHovered(false)}
                  className="flex items-center justify-center gap-2.5 flex-wrap sm:flex-nowrap overflow-x-auto no-scrollbar"
                >
                  {HOME_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.slug || selectedCategory === cat.name;
                    return (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            onCategoryChange('');
                          } else {
                            onCategoryChange(cat.slug);
                          }
                        }}
                        className={`h-[40px] px-5 rounded-[14px] text-xs font-medium inline-flex items-center justify-center cursor-pointer bg-[#282D38] border hover:shadow-[0_0_24px_4px_rgba(217,119,87,0.15)] transition-all duration-250 ease-in-out shrink-0 ${
                          isSelected
                            ? 'border-[#D97757] text-[#D97757] font-bold shadow-[0_0_12px_rgba(217,119,87,0.2)]'
                            : 'border-[#3A4150] text-[#F8FAFC] hover:border-[#D97757]/60'
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* LEFT COLUMN (Three Floating Prompt Cards Area) (YELLOW) */}
          <div
            ref={cardsRef}
            className={`lg:col-span-5 relative flex justify-center items-center min-h-[440px] sm:min-h-[480px] ${
              isInspectorEnabled ? 'ring-2 ring-amber-400/80 bg-amber-400/5 rounded-2xl p-2' : ''
            }`}
          >
            {isInspectorEnabled && (
              <MeasurementBadge
                label="Floating Cards Area (YELLOW)"
                widthPx={cardsWidth}
                colorClass="text-amber-300 border-amber-400/40"
                bgClass="bg-amber-950/90"
                position="top"
              />
            )}
            <div className="relative w-full max-w-[580px] h-[450px] sm:h-[480px] flex items-center justify-center">
              
              {/* Card 1: Left Floating Card (Delay 0s, -rotate-6) */}
              {renderSingleHeroCard(
                0,
                '0s',
                '-rotate-6',
                'left-0 sm:left-2 top-6 sm:top-8 z-10',
                'w-[270px] sm:w-[280px]'
              )}

              {/* Card 2: Center Floating Card (Delay 2s, rotate-0, Front z-20) */}
              {renderSingleHeroCard(
                1,
                '2s',
                'rotate-0',
                'left-1/2 -translate-x-1/2 top-0 z-20',
                'w-[270px] sm:w-[280px]'
              )}

              {/* Card 3: Right Floating Card (Delay 4s, rotate-6) */}
              {renderSingleHeroCard(
                2,
                '4s',
                'rotate-6',
                'right-0 sm:right-2 top-12 sm:top-14 z-10',
                'w-[270px] sm:w-[280px]'
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

