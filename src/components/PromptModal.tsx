import React from 'react';
import { PromptItemData } from '../types';
import { X, Copy, Check, Star, Eye, Bookmark, Sparkles } from 'lucide-react';

interface PromptModalProps {
  prompt: PromptItemData | null;
  onClose: () => void;
  onCopyPrompt: (text: string, title: string) => void;
  copiedPromptId: string | null;
  onBookmarkToggle: (id: string) => void;
  onViewSinglePrompt?: (prompt: PromptItemData) => void;
}

export const PromptModal: React.FC<PromptModalProps> = ({
  prompt,
  onClose,
  onCopyPrompt,
  copiedPromptId,
  onBookmarkToggle,
  onViewSinglePrompt,
}) => {
  if (!prompt) return null;

  const isCopied = copiedPromptId === prompt.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-[#282D38] border border-[#3A4150] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-[#232833] text-[#A8B0C0] hover:text-white hover:bg-[#3A4150] transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header Badges */}
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 rounded-lg bg-[#D97757]/20 border border-[#D97757]/40 text-[#D97757] text-xs font-semibold">
            {prompt.category}
          </span>
          <span className="px-3 py-1 rounded-lg bg-[#232833] text-[#F8FAFC] text-xs font-semibold">
            مدل: {prompt.aiModel}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-[#F8FAFC] mb-2 leading-tight">
          {prompt.title}
        </h2>

        {/* Description */}
        <p className="text-[#A8B0C0] text-sm leading-relaxed mb-6">
          {prompt.description}
        </p>

        {/* Prompt Code Block Container */}
        <div className="relative mb-6">
          <div className="flex items-center justify-between bg-[#1C1F26] px-4 py-2.5 rounded-t-xl border border-b-0 border-[#3A4150] text-xs text-[#A8B0C0]">
            <span className="flex items-center gap-1.5 font-mono text-[#D97757]">
              <Sparkles size={14} />
              متن کامل پرامپت (Prompt Text)
            </span>
            <button
              onClick={() => onCopyPrompt(prompt.fullPromptText, prompt.title)}
              className="flex items-center gap-1.5 text-xs text-[#A8B0C0] hover:text-white transition-colors"
            >
              {isCopied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{isCopied ? 'کپی شد' : 'کپی متن'}</span>
            </button>
          </div>

          <pre className="bg-[#1C1F26] border border-[#3A4150] rounded-b-xl p-4 text-xs sm:text-sm text-emerald-400 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed select-all border-t-0">
            {prompt.fullPromptText}
          </pre>
        </div>

        {/* Stats and Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#3A4150]">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <Star size={14} fill="currentColor" />
              {prompt.rating}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} />
              {prompt.views} بازدید
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            {onViewSinglePrompt && (
              <button
                onClick={() => {
                  onViewSinglePrompt(prompt);
                  onClose();
                }}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#232833] hover:bg-[#3A4150] border border-[#3A4150] text-[#D97757] hover:text-[#E58A66] text-xs font-bold transition-colors"
              >
                <span>مشاهده صفحه کامل 📄</span>
              </button>
            )}

            <button
              onClick={() => onBookmarkToggle(prompt.id)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#1A2336] border border-[#25324A] text-slate-200 hover:text-[#D97757] text-xs font-semibold transition-colors"
            >
              <Bookmark size={16} fill={prompt.isBookmarked ? '#D97757' : 'none'} />
              <span>{prompt.isBookmarked ? 'ذخیره شده' : 'ذخیره در نشان‌ها'}</span>
            </button>

            <button
              onClick={() => onCopyPrompt(prompt.fullPromptText, prompt.title)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs shadow-glow-sm transition-all duration-200 ${
                isCopied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-[#D97757] to-[#E05A2B] text-white hover:brightness-110'
              }`}
            >
              {isCopied ? <Check size={16} /> : <Copy size={16} />}
              <span>{isCopied ? 'کپی شد!' : 'کپی پرامپت'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
