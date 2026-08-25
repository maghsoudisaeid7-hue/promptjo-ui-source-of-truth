import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_PROMPTJO_DATA } from './data/initialData';
import { PromptJoData, PromptItemData, ToastMessage } from './types';
import { Header } from './components/Header';
import { TrendingSearchBar } from './components/TrendingSearchBar';
import { Hero } from './components/Hero';
import { CategorySection } from './components/CategorySection';
import { PromptSection } from './components/PromptSection';
import { BannerSlot } from './components/BannerSlot';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { PromptModal } from './components/PromptModal';
import { WordPressAdminModal } from './components/WordPressAdminModal';
import { WordPressAdminFloatingToolbar } from './components/WordPressAdminFloatingToolbar';
import { ExplorePage } from './components/ExplorePage';
import { SinglePromptPage, SinglePromptVariant, ImageAspectRatio } from './components/SinglePromptPage';
import { SinglePromptVariantSwitcher, WatermarkPosition } from './components/SinglePromptVariantSwitcher';
import { PromptFeatureToggles } from './types';
import { DEMO_IMAGE_PROMPT, DEMO_STANDARD_PROMPT, IMAGE_PROMPT_DEMO_IMAGES, DEMO_WATERMARKED_IMAGES } from './data/demoVariantsData';
import { Toast } from './components/Toast';
import { UXInspectorToggleBar } from './components/UXLayoutInspector';
import { VisualDimensionOverlay } from './components/VisualDimensionOverlay';

export default function App() {
  // Page view state: 'home' | 'explore' | 'single'
  const [activeView, setActiveView] = useState<'home' | 'explore' | 'single'>('single');
  // Visual Inspector State (OFF for clean production demo)
  const [isInspectorEnabled, setIsInspectorEnabled] = useState(false);
  // Selected Prompt for Single Prompt View
  const [selectedSinglePrompt, setSelectedSinglePrompt] = useState<PromptItemData | null>(null);
  // Single Prompt Demo Variants: 'image' | 'standard'
  const [singlePromptVariant, setSinglePromptVariant] = useState<SinglePromptVariant>('image');
  // Single Prompt Adaptive Image Aspect Ratio: '16:9' | '1:1' | '9:16'
  const [imageAspectRatio, setImageAspectRatio] = useState<ImageAspectRatio>('16:9');
  // Prompt Pricing Tier: 'paid' | 'free' for visual QA testing
  const [pricingTier, setPricingTier] = useState<'paid' | 'free'>('paid');
  // Watermark Plugin State Simulation (ON/OFF & Position)
  const [isWatermarkEnabled, setIsWatermarkEnabled] = useState(true);
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>('bottom-right');
  
  // V3 All Features QA Toggle State (All Features ON for QA by default)
  const [featureToggles, setFeatureToggles] = useState<PromptFeatureToggles>({
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
  });
  // Load initial data from localStorage if available
  const [data, setData] = useState<PromptJoData>(() => {
    try {
      const saved = localStorage.getItem('promptjo_app_data_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure new structures exist
        return {
          ...INITIAL_PROMPTJO_DATA,
          ...parsed,
          globalSettings: { ...INITIAL_PROMPTJO_DATA.globalSettings, ...(parsed.globalSettings || {}) },
          themeOptions: { ...INITIAL_PROMPTJO_DATA.themeOptions, ...(parsed.themeOptions || {}) },
          sectionSettings: { ...INITIAL_PROMPTJO_DATA.sectionSettings, ...(parsed.sectionSettings || {}) },
          developerSettings: { ...INITIAL_PROMPTJO_DATA.developerSettings, ...(parsed.developerSettings || {}) },
          header: { ...INITIAL_PROMPTJO_DATA.header, ...parsed.header },
          popularSearchBar: { ...INITIAL_PROMPTJO_DATA.popularSearchBar, ...parsed.popularSearchBar },
          hero: { ...INITIAL_PROMPTJO_DATA.hero, ...parsed.hero },
          promptSectionConfig: { ...INITIAL_PROMPTJO_DATA.promptSectionConfig, ...parsed.promptSectionConfig },
          visibility: { ...INITIAL_PROMPTJO_DATA.visibility, ...parsed.visibility },
          homeSectionOrder: parsed.homeSectionOrder || INITIAL_PROMPTJO_DATA.homeSectionOrder,
          banners: parsed.banners || INITIAL_PROMPTJO_DATA.banners,
        };
      }
    } catch (err) {
      console.error('Failed to parse localStorage data:', err);
    }
    return INITIAL_PROMPTJO_DATA;
  });

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [activeMenuId, setActiveMenuId] = useState('');

  // Modals state
  const [activePromptModal, setActivePromptModal] = useState<PromptItemData | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  // Toast feedback
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist changes to localStorage
  const handleSaveData = (newData: PromptJoData) => {
    setData(newData);
    try {
      localStorage.setItem('promptjo_app_data_v1', JSON.stringify(newData));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
    addToast('تنظیمات وردپرس با موفقیت ذخیره شد.', 'success');
  };

  const handleResetDefaults = () => {
    setData(INITIAL_PROMPTJO_DATA);
    try {
      localStorage.removeItem('promptjo_app_data_v1');
    } catch (err) {
      console.error(err);
    }
    addToast('اطلاعات به حالت اولیه بازنشانی شد.', 'info');
  };

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Copy prompt handler
  const handleCopyPrompt = async (promptText: string, title: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(promptText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = promptText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      const targetPrompt = data.prompts.find((p) => p.fullPromptText === promptText);
      if (targetPrompt) {
        setCopiedPromptId(targetPrompt.id);
        setTimeout(() => setCopiedPromptId(null), 2500);
      }
      
      addToast(`متن پرامپت «${title}» با موفقیت کپی شد!`, 'success');
    } catch (err) {
      console.error('Failed to copy prompt:', err);
      addToast('متن پرامپت کپی شد!', 'success');
    }
  };

  // Toggle Bookmark
  const handleBookmarkToggle = (promptId: string) => {
    const updatedPrompts = data.prompts.map((p) => {
      if (p.id === promptId) {
        const isBookmarked = !p.isBookmarked;
        addToast(
          isBookmarked
            ? `پرامپت «${p.title}» با موفقیت به ذخیره‌ها اضافه شد.`
            : `پرامپت «${p.title}» از لیست ذخیره‌ها حذف شد.`,
          isBookmarked ? 'success' : 'info'
        );
        return { ...p, isBookmarked };
      }
      return p;
    });

    const newData = { ...data, prompts: updatedPrompts };
    setData(newData);
    localStorage.setItem('promptjo_app_data_v1', JSON.stringify(newData));
  };

  // Filter Prompts dynamically
  const filteredPrompts = useMemo(() => {
    let result = data.prompts.filter((item) => {
      // Category filter
      if (selectedCategory && selectedCategory !== '') {
        const catObj = data.categories.find((c) => c.slug === selectedCategory);
        if (catObj && item.category !== catObj.name) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesModel = item.aiModel.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesModel) {
          return false;
        }
      }

      // Selected tag filter
      if (selectedTag && selectedTag !== '') {
        const tag = selectedTag.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(tag);
        const matchesCategory = item.category.toLowerCase().includes(tag);
        const matchesModel = item.aiModel.toLowerCase().includes(tag);
        if (!matchesTitle && !matchesCategory && !matchesModel) {
          return false;
        }
      }

      return true;
    });

    // Apply PromptSectionConfig displayMode sorting if set
    const mode = data.promptSectionConfig?.displayMode;
    if (mode === 'featured') {
      result = result.filter((p) => p.isFeatured || p.rating >= 4.8);
    } else if (mode === 'popular') {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (mode === 'random') {
      // Keep static order or simple display
    }

    return result;
  }, [data.prompts, data.categories, data.promptSectionConfig, selectedCategory, searchQuery, selectedTag]);

  // Handle Tag Selection from Trending Search Bar
  const handleSelectTrendingTag = (tagTitle: string) => {
    if (selectedTag === tagTitle) {
      setSelectedTag('');
      setSearchQuery('');
    } else {
      setSelectedTag(tagTitle);
      setSearchQuery(tagTitle);
      const promptsElem = document.getElementById('prompts');
      if (promptsElem) {
        promptsElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Dynamic Font CSS injection
  const dynamicFontCss = useMemo(() => {
    const typo = data.themeOptions?.typography;
    if (!typo || typo.enabled === false) return '';

    let css = '';
    const pFamily = typo.persianFontFamily === 'Custom' ? 'CustomPersianFont' : typo.persianFontFamily;
    const eFamily = typo.englishFontFamily === 'Custom' ? 'CustomEnglishFont' : typo.englishFontFamily;

    // Persian font 3 weights
    if (typo.persianFontRegularUrl || typo.persianFontUrl) {
      const url = typo.persianFontRegularUrl || typo.persianFontUrl;
      css += `@font-face { font-family: '${pFamily}'; src: url('${url}') format('woff2'), url('${url}') format('truetype'); font-weight: 400; font-style: normal; font-display: swap; }\n`;
    }
    if (typo.persianFontMediumUrl) {
      css += `@font-face { font-family: '${pFamily}'; src: url('${typo.persianFontMediumUrl}') format('woff2'), url('${typo.persianFontMediumUrl}') format('truetype'); font-weight: 500; font-style: normal; font-display: swap; }\n`;
    }
    if (typo.persianFontBoldUrl) {
      css += `@font-face { font-family: '${pFamily}'; src: url('${typo.persianFontBoldUrl}') format('woff2'), url('${typo.persianFontBoldUrl}') format('truetype'); font-weight: 700; font-style: normal; font-display: swap; }\n`;
    }

    // English font 3 weights
    if (typo.englishFontRegularUrl || typo.englishFontUrl) {
      const url = typo.englishFontRegularUrl || typo.englishFontUrl;
      css += `@font-face { font-family: '${eFamily}'; src: url('${url}') format('woff2'), url('${url}') format('truetype'); font-weight: 400; font-style: normal; font-display: swap; }\n`;
    }
    if (typo.englishFontMediumUrl) {
      css += `@font-face { font-family: '${eFamily}'; src: url('${typo.englishFontMediumUrl}') format('woff2'), url('${typo.englishFontMediumUrl}') format('truetype'); font-weight: 500; font-style: normal; font-display: swap; }\n`;
    }
    if (typo.englishFontBoldUrl) {
      css += `@font-face { font-family: '${eFamily}'; src: url('${typo.englishFontBoldUrl}') format('woff2'), url('${typo.englishFontBoldUrl}') format('truetype'); font-weight: 700; font-style: normal; font-display: swap; }\n`;
    }

    const pFont = pFamily || 'Vazirmatn';
    const eFont = eFamily || 'Plus Jakarta Sans';

    css += `
      body, button, input, select, textarea, h1, h2, h3, h4, h5, h6 {
        font-family: '${pFont}', '${eFont}', Vazirmatn, system-ui, sans-serif !important;
      }
      .font-mono, code, pre, .ltr {
        font-family: '${eFont}', system-ui, sans-serif !important;
      }
    `;

    return css;
  }, [data.themeOptions?.typography]);

  // Handle Category Select
  const handleSelectCategory = (slug: string) => {
    if (selectedCategory === slug) {
      setSelectedCategory('');
    } else {
      setSelectedCategory(slug);
      const promptsElem = document.getElementById('prompts');
      if (promptsElem) {
        promptsElem.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Section Renderer for Home Builder
  const renderSection = (sectionKey: string) => {
    switch (sectionKey) {
      case 'hero':
        return data.visibility.hero ? (
          <Hero
            key="sec_hero"
            config={data.hero}
            categories={data.categories}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onOpenPromptModal={(prompt) => setActivePromptModal(prompt)}
            onCopyPrompt={(promptText, title) => handleCopyPrompt(promptText, title)}
            isInspectorEnabled={isInspectorEnabled}
            onSearchSubmit={() => {
              const promptsElem = document.getElementById('prompts');
              if (promptsElem) {
                promptsElem.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          />
        ) : null;

      case 'categories':
        return null;

      case 'prompts':
        return data.visibility.prompts ? (
          <PromptSection
            key="sec_prompts"
            prompts={filteredPrompts}
            config={data.promptSectionConfig}
            onCopyPrompt={handleCopyPrompt}
            copiedPromptId={copiedPromptId}
            onBookmarkToggle={handleBookmarkToggle}
            onOpenPromptModal={(prompt) => setActivePromptModal(prompt)}
            onViewAllPrompts={() => {
              setSelectedCategory('');
              setSearchQuery('');
              setSelectedTag('');
              addToast('همه پرامپت‌ها نمایش داده شدند.', 'info');
            }}
          />
        ) : null;

      case 'newsletter':
        return data.visibility.newsletter ? (
          <Newsletter
            key="sec_newsletter"
            config={data.newsletter}
            onSubscribe={(email) => addToast(`ایمیل ${email} به خبرنامه افزوده شد.`, 'success')}
          />
        ) : null;

      case 'banner_after_hero':
        return data.visibility.banner_after_hero !== false ? (
          <BannerSlot key="banner_after_hero" banners={data.banners} position="after_hero" />
        ) : null;

      case 'banner_after_categories':
        return data.visibility.banner_after_categories !== false ? (
          <BannerSlot key="banner_after_categories" banners={data.banners} position="after_categories" />
        ) : null;

      case 'banner_between_prompts':
        return data.visibility.banner_between_prompts !== false ? (
          <BannerSlot key="banner_between_prompts" banners={data.banners} position="between_prompts" />
        ) : null;

      case 'banner_before_newsletter':
        return data.visibility.banner_before_newsletter !== false ? (
          <BannerSlot key="banner_before_newsletter" banners={data.banners} position="before_newsletter" />
        ) : null;

      case 'banner_before_footer':
        return data.visibility.banner_before_footer !== false ? (
          <BannerSlot key="banner_before_footer" banners={data.banners} position="before_footer" />
        ) : null;

      default:
        return null;
    }
  };

  const sectionOrderKeys = data.homeSectionOrder && data.homeSectionOrder.length > 0
    ? data.homeSectionOrder
    : [
        'hero',
        'banner_after_hero',
        'categories',
        'banner_after_categories',
        'prompts',
        'banner_between_prompts',
        'newsletter',
        'banner_before_newsletter',
        'banner_before_footer',
      ];

  return (
    <div className="min-h-screen bg-[#1C1F26] text-[#F8FAFC] flex flex-col font-['Vazirmatn',sans-serif] selection:bg-[#D97757] selection:text-white">
      {/* Custom Dynamic Font CSS Injection */}
      {dynamicFontCss && <style id="promptjo-custom-fonts">{dynamicFontCss}</style>}
      
      {/* 1. Header with integrated Hot Search Sub-row */}
      {data.visibility.header && (
        <Header
          config={data.header}
          categories={data.categories}
          prompts={data.prompts}
          trendingItems={data.trendingSearches}
          popularSearchBarConfig={data.popularSearchBar}
          selectedTag={selectedTag}
          onSelectTag={(tag) => {
            handleSelectTrendingTag(tag);
            if (activeView !== 'explore') {
              setActiveView('explore');
            }
          }}
          onOpenPromptModal={(prompt) => setActivePromptModal(prompt)}
          activeMenuId={activeMenuId}
          onMenuClick={(id) => {
            setActiveMenuId(id);
            if (id === 'm1' || id === 'm_explore') {
              setActiveView('explore');
              setSelectedCategory('');
              setSearchQuery('');
            } else if (id === 'm_home' || id === 'm0') {
              setActiveView('home');
            }
          }}
          onSelectSubcategory={(subcat) => {
            setActiveView('explore');
            setSearchQuery(subcat);
            setSelectedTag(subcat);
            addToast(`جستجو در صفحه کاوش برای زیردسته «${subcat}» انجام شد.`, 'info');
          }}
          onLoginClick={() => addToast('صفحه ورود کاربر (Login Dialog)', 'info')}
        />
      )}

      {/* 2.5 Page View Switcher Tabs */}
      <div className="bg-[#232833] border-y border-[#3A4150]/80 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">نمای کنونی پیش‌نمایش:</span>
            <span className="text-xs font-bold text-[#D97757] bg-[#D97757]/10 px-2.5 py-1 rounded-lg border border-[#D97757]/20">
              {activeView === 'single'
                ? '📄 صفحه تکی پرامپت (Single Prompt Page)'
                : activeView === 'explore'
                ? '🔍 صفحه کاوش پرامپت‌ها (Explore Page)'
                : '🏠 صفحه اصلی خانه (Home Page)'}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveView('home')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'home'
                  ? 'bg-[#D97757] text-white shadow-md'
                  : 'bg-[#1C1F26] text-slate-300 hover:text-white hover:bg-[#2C3240] border border-[#3A4150]'
              }`}
            >
              <span>🏠 صفحه اصلی (Home)</span>
            </button>

            <button
              onClick={() => setActiveView('explore')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'explore'
                  ? 'bg-[#D97757] text-white shadow-md'
                  : 'bg-[#1C1F26] text-slate-300 hover:text-white hover:bg-[#2C3240] border border-[#3A4150]'
              }`}
            >
              <span>🔍 صفحه کاوش (Explore)</span>
            </button>

            <button
              onClick={() => {
                if (!selectedSinglePrompt) {
                  setSelectedSinglePrompt(data.prompts[0]);
                }
                setActiveView('single');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeView === 'single'
                  ? 'bg-[#D97757] text-white shadow-md'
                  : 'bg-[#1C1F26] text-slate-300 hover:text-white hover:bg-[#2C3240] border border-[#3A4150]'
              }`}
            >
              <span>📄 صفحه تکی پرامپت (Single)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Main Content Area: Home View vs Explore View vs Single Prompt View */}
      <main className="flex-1">
        {activeView === 'single' ? (
          <SinglePromptPage
            prompt={
              selectedSinglePrompt
                ? {
                    ...selectedSinglePrompt,
                    featuredImage:
                      singlePromptVariant === 'image'
                        ? isWatermarkEnabled
                          ? DEMO_WATERMARKED_IMAGES[imageAspectRatio]?.[watermarkPosition] || IMAGE_PROMPT_DEMO_IMAGES[imageAspectRatio]
                          : IMAGE_PROMPT_DEMO_IMAGES[imageAspectRatio] || selectedSinglePrompt.featuredImage
                        : selectedSinglePrompt.featuredImage,
                  }
                : singlePromptVariant === 'image'
                ? {
                    ...DEMO_IMAGE_PROMPT,
                    featuredImage: isWatermarkEnabled
                      ? DEMO_WATERMARKED_IMAGES[imageAspectRatio]?.[watermarkPosition] || IMAGE_PROMPT_DEMO_IMAGES[imageAspectRatio]
                      : IMAGE_PROMPT_DEMO_IMAGES[imageAspectRatio],
                  }
                : DEMO_STANDARD_PROMPT
            }
            allPrompts={data.prompts}
            categories={data.categories}
            variant={singlePromptVariant}
            aspectRatio={imageAspectRatio}
            featureToggles={featureToggles}
            isWatermarkEnabled={isWatermarkEnabled}
            watermarkPosition={watermarkPosition}
            onSelectPrompt={(p) => {
              setSelectedSinglePrompt(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHome={() => {
              setActiveView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateExplore={(categorySlug, tag) => {
              setActiveView('explore');
              if (categorySlug) {
                const cat = data.categories.find((c) => c.name === categorySlug || c.slug === categorySlug);
                if (cat) setSelectedCategory(cat.slug);
              }
              if (tag) {
                setSelectedTag(tag);
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCopyPrompt={handleCopyPrompt}
            copiedPromptId={copiedPromptId}
            onBookmarkToggle={handleBookmarkToggle}
            onShowToast={addToast}
          />
        ) : activeView === 'explore' ? (
          <ExplorePage
            prompts={data.prompts}
            categories={data.categories}
            selectedCategory={selectedCategory}
            onCopyPrompt={handleCopyPrompt}
            copiedPromptId={copiedPromptId}
            onBookmarkToggle={handleBookmarkToggle}
            onOpenPromptModal={(prompt) => {
              setSelectedSinglePrompt(prompt);
              setActivePromptModal(prompt);
            }}
            isInspectorEnabled={isInspectorEnabled}
          />
        ) : (
          sectionOrderKeys.map((key) => renderSection(key))
        )}
      </main>

      {/* Single Prompt Variant Switcher (Fixed Bottom-Left for A/B Testing) */}
      {activeView === 'single' && (
        <SinglePromptVariantSwitcher
          currentVariant={singlePromptVariant}
          onVariantChange={(newVariant) => {
            setSinglePromptVariant(newVariant);
            if (newVariant === 'image') {
              setSelectedSinglePrompt(pricingTier === 'paid' ? DEMO_IMAGE_PROMPT : {
                ...DEMO_IMAGE_PROMPT,
                title: 'پرامپت رایگان: پرتره سایبرپانک با نورپردازی نئونی',
                isFree: true,
                price: 0,
                paidAccess: undefined
              });
            } else {
              setSelectedSinglePrompt(pricingTier === 'paid' ? {
                ...DEMO_STANDARD_PROMPT,
                title: 'پرامپت ویژه: اسکریپت و سناریو جامع یوتیوب',
                isFree: false,
                price: 299000,
                currency: 'تومان',
                paidAccess: {
                  isPaid: true,
                  price: 299000,
                  currency: 'تومان',
                  guaranteeText: 'تضمین بازگشت وجه و پشتیبانی کامل',
                  features: ['دسترسی به تمام متغیرهای پیشرفته', 'فایل سناریوی کامل ۱۰ بخشی', 'راهنمای سئو و تایتل‌نویسی ویدیو']
                }
              } : DEMO_STANDARD_PROMPT);
            }
            addToast(
              newVariant === 'image'
                ? 'نمونه ۱: پرامپت تصویری (Image-First Hero) فعال شد.'
                : 'نمونه ۲: پرامپت استاندارد (Standard Hero) فعال شد.',
              'info'
            );
          }}
          pricingTier={pricingTier}
          onPricingTierChange={(newTier) => {
            setPricingTier(newTier);
            if (newTier === 'paid') {
              if (singlePromptVariant === 'image') {
                setSelectedSinglePrompt(DEMO_IMAGE_PROMPT);
              } else {
                setSelectedSinglePrompt({
                  ...DEMO_STANDARD_PROMPT,
                  title: 'پرامپت ویژه: اسکریپت و سناریو جامع یوتیوب',
                  isFree: false,
                  price: 299000,
                  currency: 'تومان',
                  paidAccess: {
                    isPaid: true,
                    price: 299000,
                    currency: 'تومان',
                    guaranteeText: 'تضمین بازگشت وجه و پشتیبانی کامل',
                    features: ['دسترسی به تمام متغیرهای پیشرفته', 'فایل سناریوی کامل ۱۰ بخشی', 'راهنمای سئو و تایتل‌نویسی ویدیو']
                  }
                });
              }
              addToast('حالت تست پرامپت ویژه (پولی — ۲۹۹,۰۰۰ تومان) فعال شد.', 'info');
            } else {
              if (singlePromptVariant === 'image') {
                setSelectedSinglePrompt({
                  ...DEMO_IMAGE_PROMPT,
                  title: 'پرامپت رایگان: پرتره سایبرپانک با نورپردازی نئونی',
                  isFree: true,
                  price: 0,
                  paidAccess: undefined
                });
              } else {
                setSelectedSinglePrompt(DEMO_STANDARD_PROMPT);
              }
              addToast('حالت تست پرامپت عادی (رایگان با قابلیت کپی مستقیم) فعال شد.', 'info');
            }
          }}
          currentAspectRatio={imageAspectRatio}
          onAspectRatioChange={(newRatio) => {
            setImageAspectRatio(newRatio);
            addToast(`نسبت تصویر تغییر یافت: ${newRatio}`, 'info');
          }}
          isWatermarkEnabled={isWatermarkEnabled}
          onWatermarkToggle={(enabled) => {
            setIsWatermarkEnabled(enabled);
            addToast(
              enabled
                ? 'واترمارک افزونه (PromptJo_Watermark REST Endpoint) فعال شد.'
                : 'واترمارک غیرفعال شد؛ تصویر اورجینال نمایش داده می‌شود.',
              enabled ? 'success' : 'info'
            );
          }}
          watermarkPosition={watermarkPosition}
          onWatermarkPositionChange={(pos) => {
            setWatermarkPosition(pos);
            addToast(`موقعیت واترمارک افزونه: ${pos === 'bottom-right' ? 'پایین راست' : 'پایین چپ'}`, 'info');
          }}
          featureToggles={featureToggles}
          onFeatureToggleChange={(newToggles) => {
            setFeatureToggles(newToggles);
          }}
        />
      )}

      {/* Footer */}
      {data.visibility.footer && <Footer config={data.footer} />}

      {/* Prompt Detail Modal */}
      <PromptModal
        prompt={activePromptModal}
        onClose={() => setActivePromptModal(null)}
        onCopyPrompt={handleCopyPrompt}
        copiedPromptId={copiedPromptId}
        onBookmarkToggle={handleBookmarkToggle}
        onViewSinglePrompt={(p) => {
          setSelectedSinglePrompt(p);
          setActiveView('single');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* WordPress Admin / Dynamic Home Settings & Banner Manager */}
      <WordPressAdminModal
        data={data}
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onSave={handleSaveData}
        onResetToDefaults={handleResetDefaults}
      />

      {/* Floating WordPress Admin Toolbar with Page Switcher */}
      <WordPressAdminFloatingToolbar
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        promptCount={data.prompts.length}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      {/* Toast Feedbacks */}
      <Toast toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* Visual Dimension Measurement Overlay for QA (Home & Explore) */}
      <VisualDimensionOverlay activeView={activeView} />
    </div>
  );
}

