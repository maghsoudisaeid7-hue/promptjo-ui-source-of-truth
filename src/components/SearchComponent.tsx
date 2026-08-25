import React from 'react';
import { Search } from 'lucide-react';

export interface SearchComponentProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  buttonText?: string;
  onHoverChange?: (hovered: boolean) => void;
}

export const SearchComponent: React.FC<SearchComponentProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "جستجو در بین هزاران پرامپت...",
  buttonText = "جستجو",
  onHoverChange,
}) => {
  return (
    <div className="w-full max-w-[620px]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (onSubmit) onSubmit();
        }}
        onMouseEnter={() => onHoverChange && onHoverChange(true)}
        onMouseLeave={() => onHoverChange && onHoverChange(false)}
        dir="rtl"
        className="h-[56px] rounded-[18px] bg-[#232833] border border-[#3A4150] hover:border-[#D97757]/70 hover:shadow-[0_0_28px_6px_rgba(217,119,87,0.22)] focus-within:border-[#D97757] focus-within:shadow-[0_0_32px_8px_rgba(217,119,87,0.28)] flex items-center justify-between shadow-lg transition-all duration-300 ease-in-out px-3.5 group w-full"
      >
        {/* Search Icon on the right (RTL start) */}
        <div className="pl-3 text-[#A8B0C0] group-hover:text-[#D97757] transition-colors shrink-0">
          <Search size={18} />
        </div>

        {/* Pure Search Text Input */}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-[#F8FAFC] text-sm outline-none placeholder:text-[#A8B0C0] font-medium px-1 text-right"
        />

        {/* Brand Orange Search Button on the left (RTL end) */}
        <button
          type="submit"
          className="h-[40px] px-5 shrink-0 bg-[#D97757] hover:bg-[#e08362] text-white font-bold text-xs rounded-[12px] border border-white/10 shadow-[0_0_12px_rgba(217,119,87,0.3)] hover:shadow-[0_0_20px_rgba(217,119,87,0.5)] active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center -translate-x-[6px]"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
};
