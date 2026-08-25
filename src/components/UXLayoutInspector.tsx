import React, { useState, useEffect, useRef } from 'react';

interface MeasuredBounds {
  heroWidth: number;
  titleWidth: number;
  searchWidth: number;
  categoriesWidth: number;
  cardsWidth: number;
}

interface UXLayoutInspectorProps {
  enabled: boolean;
  onToggle: () => void;
  activeView: 'home' | 'explore';
}

/**
 * A custom hook to measure element width live in real time using ResizeObserver
 */
export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setWidth(Math.round(entry.borderBoxSize?.[0]?.inlineSize || entry.contentRect.width));
        }
      }
    });

    observer.observe(el);
    // Initial measurement
    setWidth(Math.round(el.getBoundingClientRect().width));

    return () => {
      observer.disconnect();
    };
  }, []);

  return [ref, width] as const;
}

/**
 * Inspector Tag Overlay Badge Component
 */
export const MeasurementBadge: React.FC<{
  label: string;
  widthPx: number;
  colorClass: string;
  bgClass: string;
  position?: 'top' | 'top-right' | 'top-left';
}> = ({ label, widthPx, colorClass, bgClass, position = 'top' }) => {
  return (
    <div
      className={`absolute -top-7 ${
        position === 'top-right'
          ? 'right-2'
          : position === 'top-left'
          ? 'left-2'
          : 'left-1/2 -translate-x-1/2'
      } z-50 pointer-events-none flex items-center gap-1.5 px-2.5 py-0.5 rounded-md ${bgClass} ${colorClass} text-[11px] font-mono font-bold shadow-md border border-current/20 whitespace-nowrap dir-ltr`}
    >
      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
      <span>
        {label}: <strong className="text-white bg-black/40 px-1 rounded">{widthPx}px</strong>
      </span>
    </div>
  );
};

export const UXInspectorToggleBar: React.FC<UXLayoutInspectorProps> = ({
  enabled,
  onToggle,
  activeView,
}) => {
  return (
    <div className="fixed bottom-4 left-4 z-[9999] flex items-center gap-2 bg-[#1C1F26]/95 border border-white/15 p-2 rounded-xl shadow-2xl backdrop-blur-md text-xs dir-rtl">
      <button
        type="button"
        onClick={onToggle}
        className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 transition-all cursor-pointer ${
          enabled
            ? 'bg-gradient-to-r from-red-500 via-emerald-500 to-sky-500 text-white shadow-lg'
            : 'bg-[#282D38] hover:bg-[#323846] text-[#A8B0C0]'
        }`}
      >
        <span className="text-base">📐</span>
        <span>{enabled ? 'غیرفعال‌سازی راهنمای ابعاد (Hide UX Inspector)' : 'نمایش ابعاد و مرزهای visual (Show UX Inspector)'}</span>
      </button>

      {enabled && (
        <div className="flex items-center gap-1.5 text-[10px] font-mono pr-2 border-r border-white/10 text-white/80">
          <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40">HERO</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">TITLE</span>
          <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/40">SEARCH</span>
          <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/40">CATEGORIES</span>
          {activeView === 'home' && (
            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">CARDS</span>
          )}
        </div>
      )}
    </div>
  );
};
