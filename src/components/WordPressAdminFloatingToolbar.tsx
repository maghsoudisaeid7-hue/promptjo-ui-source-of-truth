import React from 'react';
import { Settings, Home, Compass, Download } from 'lucide-react';

interface FloatingToolbarProps {
  onOpenAdmin: () => void;
  promptCount: number;
  activeView: 'home' | 'explore' | 'single';
  onViewChange: (view: 'home' | 'explore' | 'single') => void;
}

export const WordPressAdminFloatingToolbar: React.FC<FloatingToolbarProps> = ({
  onOpenAdmin,
  promptCount,
  activeView,
  onViewChange,
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-wrap items-center gap-2 dir-rtl">
      {/* Direct WordPress Theme Download Link */}
      <a
        href="/promptjo-theme-v4.0.2.zip"
        download="promptjo-theme-v4.0.2.zip"
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-[#232833]/95 backdrop-blur-md hover:bg-[#282D38] text-white font-bold text-xs shadow-2xl hover:shadow-glow-sm hover:scale-105 active:scale-95 transition-all duration-200 border border-[#3A4150] hover:border-[#D97757]"
        title="دانلود فایل پوسته وردپرس (promptjo-theme-v4.0.2.zip)"
      >
        <Download size={14} className="text-[#D97757]" />
        <span>دانلود پوسته وردپرس</span>
        <span className="px-1.5 py-0.5 rounded-md bg-[#1C1F26] text-[10px] font-mono text-[#D97757] border border-[#3A4150]">
          v4.0.2
        </span>
      </a>

      {/* Page View Switcher */}
      <div className="bg-[#121928]/95 backdrop-blur-md p-1 rounded-2xl border border-[#202C42] shadow-2xl flex items-center gap-1">
        <button
          onClick={() => onViewChange('home')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            activeView === 'home'
              ? 'bg-[#D97757] text-white shadow-glow-sm font-black'
              : 'text-slate-400 hover:text-white hover:bg-[#1C283F]'
          }`}
        >
          <Home size={14} />
          <span>خانه (Home)</span>
        </button>

        <button
          onClick={() => onViewChange('explore')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            activeView === 'explore'
              ? 'bg-[#D97757] text-white shadow-glow-sm font-black'
              : 'text-slate-400 hover:text-white hover:bg-[#1C283F]'
          }`}
        >
          <Compass size={14} />
          <span>کاوش (Explore)</span>
        </button>

        <button
          onClick={() => onViewChange('single')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            activeView === 'single'
              ? 'bg-[#D97757] text-white shadow-glow-sm font-black'
              : 'text-slate-400 hover:text-white hover:bg-[#1C283F]'
          }`}
        >
          <span>📄 صفحه تکی (Single)</span>
        </button>
      </div>

      {/* WordPress Admin Modal Toggle */}
      <button
        onClick={onOpenAdmin}
        className="group relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#D97757] via-[#E05A2B] to-[#F59E0B] text-white font-bold text-xs shadow-glow-md hover:shadow-glow-lg hover:scale-105 active:scale-95 transition-all duration-200 border border-white/20"
        title="مدیریت ساختار اختصاصی وردپرس (Settings API & Custom Post Types)"
      >
        <div className="w-5 h-5 rounded-lg bg-black/20 flex items-center justify-center">
          <Settings size={14} className="group-hover:rotate-90 transition-transform duration-300" />
        </div>
        <span>مدیریت وردپرس</span>
        <span className="px-2 py-0.5 rounded-full bg-black/25 text-[10px] font-mono">
          {promptCount}
        </span>
      </button>
    </div>
  );
};





