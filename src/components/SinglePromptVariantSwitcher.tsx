import React, { useState } from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  FileText,
  SlidersHorizontal,
  ShieldCheck,
  ShieldAlert,
  ToggleLeft,
  ToggleRight,
  Layers,
  Terminal,
  AlertCircle,
  Cpu,
  Lock,
  MessageSquare,
  Tag,
  BarChart2,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { PromptFeatureToggles } from '../types';

export type SinglePromptVariant = 'image' | 'standard';
export type PromptPricingTier = 'paid' | 'free';
export type ImageAspectRatio = '16:9' | '1:1' | '9:16';
export type WatermarkPosition = 'bottom-right' | 'bottom-left';

interface SinglePromptVariantSwitcherProps {
  currentVariant: SinglePromptVariant;
  onVariantChange: (variant: SinglePromptVariant) => void;
  pricingTier?: PromptPricingTier;
  onPricingTierChange?: (tier: PromptPricingTier) => void;
  currentAspectRatio: ImageAspectRatio;
  onAspectRatioChange: (aspectRatio: ImageAspectRatio) => void;
  isWatermarkEnabled?: boolean;
  onWatermarkToggle?: (enabled: boolean) => void;
  watermarkPosition?: WatermarkPosition;
  onWatermarkPositionChange?: (position: WatermarkPosition) => void;
  featureToggles?: PromptFeatureToggles;
  onFeatureToggleChange?: (toggles: PromptFeatureToggles) => void;
}

export const SinglePromptVariantSwitcher: React.FC<SinglePromptVariantSwitcherProps> = ({
  currentVariant,
  onVariantChange,
  pricingTier = 'paid',
  onPricingTierChange,
  currentAspectRatio,
  onAspectRatioChange,
  isWatermarkEnabled = true,
  onWatermarkToggle,
  watermarkPosition = 'bottom-right',
  onWatermarkPositionChange,
  featureToggles = {
    outputFormat: true,
    negativePrompt: true,
    technicalParameters: true,
    multipleModels: true,
    variablesInteraction: true,
    paidAccess: true,
    featuredVideo: false,
    usageGuide: true,
    watermark: true,
    difficulty: true,
    language: true,
    stats: true,
    tags: true,
    comments: true,
  },
  onFeatureToggleChange,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'features' | 'hero'>('features');

  const toggleSingleFeature = (key: keyof PromptFeatureToggles) => {
    if (!onFeatureToggleChange) return;
    onFeatureToggleChange({
      ...featureToggles,
      [key]: !featureToggles[key],
    });
  };

  const setAllFeatures = (enabled: boolean) => {
    if (!onFeatureToggleChange) return;
    onFeatureToggleChange({
      outputFormat: enabled,
      negativePrompt: enabled,
      technicalParameters: enabled,
      multipleModels: enabled,
      variablesInteraction: enabled,
      paidAccess: enabled,
      featuredVideo: false,
      usageGuide: enabled,
      watermark: enabled,
      difficulty: enabled,
      language: enabled,
      stats: enabled,
      tags: enabled,
      comments: enabled,
    });
  };

  const featureList: Array<{ key: keyof PromptFeatureToggles; label: string; icon: any; category: string }> = [
    { key: 'variablesInteraction', label: 'فرم شخصی‌سازی متغیرها', icon: SlidersHorizontal, category: 'تعاملی' },
    { key: 'negativePrompt', label: 'پرامپت منفی (Negative)', icon: AlertCircle, category: 'پرامپت' },
    { key: 'technicalParameters', label: 'پارامترهای فنی (Params)', icon: Terminal, category: 'پرامپت' },
    { key: 'multipleModels', label: 'سازگاری چند مدل هوش مصنوعی', icon: Cpu, category: 'اطلاعات' },
    { key: 'paidAccess', label: 'بخش خرید و قفل ویژه (Paid)', icon: Lock, category: 'تجاری' },
    { key: 'outputFormat', label: 'نشان فرمت خروجی (Output)', icon: FileText, category: 'اطلاعات' },
    { key: 'usageGuide', label: 'راهنمای استفاده ۴ بخشی', icon: BookOpen, category: 'محتوا' },
    { key: 'tags', label: 'بلوک برچسب‌ها (Tags)', icon: Tag, category: 'متادیتا' },
    { key: 'stats', label: 'آمار بازدید و لایک (Stats)', icon: BarChart2, category: 'متادیتا' },
    { key: 'comments', label: 'بخش دیدگاه‌ها و پاسخ‌ها', icon: MessageSquare, category: 'جامعه' },
  ];

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-fade-in text-right font-['Vazirmatn',sans-serif]">
      <div className="bg-[#1C1F26]/95 backdrop-blur-md rounded-2xl border border-[#3A4150] shadow-2xl p-3 sm:p-4 space-y-3 max-w-sm sm:max-w-md w-full max-h-[85vh] overflow-y-auto">
        
        {/* Header with Title and Toggle */}
        <div className="flex items-center justify-between gap-3 border-b border-[#3A4150]/60 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97757] animate-pulse" />
            <div>
              <span className="text-xs font-extrabold text-white block">Visual QA & Feature Switcher</span>
              <span className="text-[10px] text-[#D97757] font-medium">کنترل زنده تمام قابلیت‌های افزونه</span>
            </div>
          </div>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-[11px] text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-[#232833] border border-[#3A4150] transition-colors font-bold"
          >
            {isMinimized ? 'باز کردن پنل QA' : 'کوچک‌سازی'}
          </button>
        </div>

        {!isMinimized && (
          <div className="space-y-3">

            {/* PAID VS FREE DEMO TESTER (PRIMARY FOCUS) */}
            <div className="bg-[#14171F] p-2.5 rounded-xl border border-amber-500/30 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-extrabold text-amber-300 flex items-center gap-1">
                  <Lock size={12} className="text-amber-400" />
                  <span>تست وضعیت پرامپت (Paid vs Free):</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {pricingTier === 'paid' ? '۲۹۹,۰۰۰ تومان' : 'رایگان'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => onPricingTierChange && onPricingTierChange('paid')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                    pricingTier === 'paid'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-950/40 scale-[1.02]'
                      : 'bg-[#232833] text-slate-300 hover:text-white hover:bg-[#2A303D] border border-[#3A4150]'
                  }`}
                >
                  <Lock size={13} className={pricingTier === 'paid' ? 'text-slate-950' : 'text-amber-400'} />
                  <span>پرامپت ویژه (پولی)</span>
                </button>

                <button
                  onClick={() => onPricingTierChange && onPricingTierChange('free')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    pricingTier === 'free'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 scale-[1.02]'
                      : 'bg-[#232833] text-slate-300 hover:text-white hover:bg-[#2A303D] border border-[#3A4150]'
                  }`}
                >
                  <CheckCircle2 size={13} className={pricingTier === 'free' ? 'text-white' : 'text-emerald-400'} />
                  <span>پرامپت عادی (رایگان)</span>
                </button>
              </div>
            </div>

            {/* Quick Action Presets */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setAllFeatures(true)}
                className="py-1.5 px-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-all"
              >
                <CheckCircle2 size={13} />
                <span>همه فعال (All ON)</span>
              </button>
              <button
                onClick={() => setAllFeatures(false)}
                className="py-1.5 px-2 rounded-xl bg-slate-700/40 hover:bg-slate-700/60 text-slate-300 border border-slate-600 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>حالت مینیمال (All OFF)</span>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 p-1 bg-[#14171F] rounded-xl border border-[#3A4150]">
              <button
                onClick={() => setActiveTab('features')}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'features'
                    ? 'bg-[#D97757] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ویژگی‌های پلاگین ({Object.values(featureToggles).filter(Boolean).length})
              </button>
              <button
                onClick={() => setActiveTab('hero')}
                className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'hero'
                    ? 'bg-[#D97757] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hero & واترمارک
              </button>
            </div>

            {/* TAB 1: PLUGIN FEATURE TOGGLES */}
            {activeTab === 'features' && (
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-0.5">
                {featureList.map((f) => {
                  const isEnabled = !!featureToggles[f.key];
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.key}
                      onClick={() => toggleSingleFeature(f.key)}
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                        isEnabled
                          ? 'bg-[#232833] border-[#D97757]/40 text-white shadow-sm'
                          : 'bg-[#14171F]/80 border-[#3A4150]/60 text-slate-400 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon size={14} className={isEnabled ? 'text-[#D97757]' : 'text-slate-500'} />
                        <span className="text-xs font-bold">{f.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                          isEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700/50 text-slate-400'
                        }`}>
                          {isEnabled ? 'روشن' : 'خاموش'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: HERO & WATERMARK */}
            {activeTab === 'hero' && (
              <div className="space-y-3">
                {/* Hero Variant */}
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1.5">مدل Hero پرامپت:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onVariantChange('image')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                        currentVariant === 'image'
                          ? 'bg-[#D97757] text-white shadow-lg shadow-orange-950/40'
                          : 'bg-[#232833] text-slate-300 hover:text-white hover:bg-[#2A303D] border border-[#3A4150]'
                      }`}
                    >
                      <ImageIcon size={14} />
                      <span>Image Prompt</span>
                    </button>

                    <button
                      onClick={() => onVariantChange('standard')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                        currentVariant === 'standard'
                          ? 'bg-[#D97757] text-white shadow-lg shadow-orange-950/40'
                          : 'bg-[#232833] text-slate-300 hover:text-white hover:bg-[#2A303D] border border-[#3A4150]'
                      }`}
                    >
                      <FileText size={14} />
                      <span>Standard Prompt</span>
                    </button>
                  </div>
                </div>

                {/* Aspect Ratio Switcher (Only for Image Prompt) */}
                {currentVariant === 'image' && (
                  <div className="pt-2 border-t border-[#3A4150]/60 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-bold flex items-center gap-1">
                        <SlidersHorizontal size={12} className="text-[#D97757]" />
                        <span>نسبت تصویر تطبیقی:</span>
                      </span>
                      <span className="text-slate-300 font-mono text-[10px] bg-[#232833] px-1.5 py-0.5 rounded border border-[#3A4150]">
                        {currentAspectRatio}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {(['16:9', '1:1', '9:16'] as ImageAspectRatio[]).map((ratio) => (
                        <button
                          key={ratio}
                          onClick={() => onAspectRatioChange(ratio)}
                          className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
                            currentAspectRatio === ratio
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                              : 'bg-[#232833] text-slate-400 hover:text-slate-200 border border-[#3A4150]'
                          }`}
                        >
                          <span>{ratio === '16:9' ? '16:9 (افقی)' : ratio === '1:1' ? '1:1 (مربع)' : '9:16 (عمودی)'}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Watermark Plugin Testing */}
                {currentVariant === 'image' && onWatermarkToggle && (
                  <div className="pt-2 border-t border-[#3A4150]/60 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        {isWatermarkEnabled ? (
                          <ShieldCheck size={13} className="text-emerald-400" />
                        ) : (
                          <ShieldAlert size={13} className="text-slate-400" />
                        )}
                        <span>واترمارک تصویر شاخص:</span>
                      </span>
                      <button
                        onClick={() => onWatermarkToggle(!isWatermarkEnabled)}
                        className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition-all border ${
                          isWatermarkEnabled
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                            : 'bg-slate-700/50 text-slate-400 border-slate-600'
                        }`}
                      >
                        {isWatermarkEnabled ? 'فعال (ON)' : 'غیرفعال (OFF)'}
                      </button>
                    </div>

                    {isWatermarkEnabled && onWatermarkPositionChange && (
                      <div className="space-y-1 bg-[#14171F] p-2 rounded-xl border border-[#3A4150]/60">
                        <span className="text-[10px] text-slate-400 block font-medium">موقعیت خروجی اندپوینت:</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => onWatermarkPositionChange('bottom-right')}
                            className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
                              watermarkPosition === 'bottom-right'
                                ? 'bg-[#D97757] text-white shadow'
                                : 'bg-[#232833] text-slate-400 hover:text-slate-200 border border-[#3A4150]'
                            }`}
                          >
                            پایین راست
                          </button>
                          <button
                            onClick={() => onWatermarkPositionChange('bottom-left')}
                            className={`py-1 px-2 rounded-lg text-[10px] font-bold transition-all ${
                              watermarkPosition === 'bottom-left'
                                ? 'bg-[#D97757] text-white shadow'
                                : 'bg-[#232833] text-slate-400 hover:text-slate-200 border border-[#3A4150]'
                            }`}
                          >
                            پایین چپ
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Zero Overhead Guarantee Note */}
            <p className="text-[10px] text-slate-400 leading-normal border-t border-[#3A4150]/50 pt-2">
              💡 <strong className="text-white">قانون عدم سربار بصری:</strong> در صورت خاموش بودن هر ویژگی از پنل پلاگین، هیچ تگ DOM خالی یا فاصله اضافی در قالب وردپرس رندر نمی‌شود.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
