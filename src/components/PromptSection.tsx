import React from 'react';
import { PromptItemData, PromptSectionConfig } from '../types';
import { PromptCard } from './PromptCard';

interface PromptSectionProps {
  prompts: PromptItemData[];
  config?: PromptSectionConfig;
  onCopyPrompt: (promptText: string, title: string) => void;
  copiedPromptId: string | null;
  onBookmarkToggle: (promptId: string) => void;
  onOpenPromptModal: (prompt: PromptItemData) => void;
  onViewAllPrompts?: () => void;
}

export const PromptSection: React.FC<PromptSectionProps> = ({
  prompts,
  config,
  onCopyPrompt,
  copiedPromptId,
  onBookmarkToggle,
  onOpenPromptModal,
  onViewAllPrompts,
}) => {
  const title = config?.title || 'پرامپت‌های محبوب';
  const subtitle = config?.subtitle;

  // Independent Load More State for Home Section
  const initialBatchSize = config?.itemsCount || 8;
  const [visibleCount, setVisibleCount] = React.useState(initialBatchSize);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const displayPrompts = prompts.slice(0, visibleCount);
  const hasMore = visibleCount < prompts.length;

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 8);
      setIsLoadingMore(false);
    }, 300);
  };

  return (
    <section id="prompts" className="w-full bg-[#1C1F26] py-16 border-b border-[#3A4150] px-6 sm:px-8 md:px-12 lg:px-16 xl:px-[52px]">
      <div 
        className="w-full max-w-[1780px] mx-auto"
      >
        
        {/* Section Title */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-7 rounded-full bg-[#D97757]" />
              <span>{title}</span>
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-[#A8B0C0] mt-1 mr-4">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Responsive Prompt Grid (4 cols on lg, 5 cols on xl, 6 cols on 2xl) */}
        {displayPrompts.length === 0 ? (
          <div className="text-center py-16 bg-[#282D38] rounded-2xl border border-[#3A4150]">
            <p className="text-[#A8B0C0] text-base font-medium">هیچ پرامپتی با این مشخصات یافت نشد.</p>
          </div>
        ) : (
          <div className="pj-prompt-grid">
            {displayPrompts.map((item) => (
              <PromptCard
                key={item.id}
                item={item}
                isCopied={copiedPromptId === item.id}
                onCopyPrompt={onCopyPrompt}
                onBookmarkToggle={onBookmarkToggle}
                onOpenPromptModal={onOpenPromptModal}
              />
            ))}
          </div>
        )}

        {/* Load More Button */}
        <div className="mt-12 text-center flex flex-col items-center justify-center gap-3">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-[#D97757] text-[#D97757] hover:bg-[#D97757] hover:text-white text-sm font-bold shadow-glow-sm hover:shadow-glow-md transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {isLoadingMore ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#D97757] border-t-transparent rounded-full animate-spin" />
                  <span>در حال بارگذاری...</span>
                </>
              ) : (
                <span>نمایش بیشتر</span>
              )}
            </button>
          ) : (
            displayPrompts.length > 0 && (
              <div className="px-6 py-2.5 rounded-xl bg-[#282D38]/50 border border-[#3A4150]/50 text-xs font-semibold text-[#A8B0C0] select-none">
                همه پرامپت‌ها نمایش داده شدند
              </div>
            )
          )}
        </div>

      </div>
    </section>
  );
};

