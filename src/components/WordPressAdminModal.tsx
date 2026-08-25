import React, { useState } from 'react';
import { PromptJoData, BannerItem, CategoryCardData, StatItem, TrendingSearchItem, SectionSettingItem } from '../types';
import { INITIAL_PROMPTJO_DATA } from '../data/initialData';
import {
  X,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Code,
  Sliders,
  Check,
  Layers,
  Layout,
  Database,
  Copy,
  FileText,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Megaphone,
  Grid,
  Upload,
  Download,
  Globe,
  Palette,
  RefreshCw,
  Share2,
  Search,
  CheckCircle,
  Terminal,
  Cpu,
  Wrench,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from 'lucide-react';

interface WordPressAdminModalProps {
  data: PromptJoData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newData: PromptJoData) => void;
  onResetToDefaults: () => void;
}

export const WordPressAdminModal: React.FC<WordPressAdminModalProps> = ({
  data,
  isOpen,
  onClose,
  onSave,
  onResetToDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'global_settings'
    | 'home_builder'
    | 'categories'
    | 'hero'
    | 'trending'
    | 'banners'
    | 'theme_options'
    | 'developer_settings'
    | 'import_export_reset'
    | 'version_control'
    | 'feature_toggles'
    | 'layout_manager'
    | 'prompts'
    | 'header'
    | 'footer'
    | 'media'
    | 'wp_php_code'
  >('global_settings');

  const [activePhpFile, setActivePhpFile] = useState<
    'functions' | 'cpt' | 'metaboxes' | 'settings' | 'bannermanager' | 'frontpage' | 'pageexplore'
  >('pageexplore');

  const [formData, setFormData] = useState<PromptJoData>(JSON.parse(JSON.stringify(data)));
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedCodeFile, setCopiedCodeFile] = useState<string | null>(null);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [expandedSectionId, setExpandedSectionId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [draggedCategoryIdx, setDraggedCategoryIdx] = useState<number | null>(null);

  const handleCategoryDragStart = (e: React.DragEvent, index: number) => {
    setDraggedCategoryIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleCategoryDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleCategoryDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedCategoryIdx === null || draggedCategoryIdx === dropIndex) return;
    const newCats = [...formData.categories];
    const [movedItem] = newCats.splice(draggedCategoryIdx, 1);
    newCats.splice(dropIndex, 0, movedItem);
    setFormData({ ...formData, categories: newCats });
    setDraggedCategoryIdx(null);
    triggerActionNotice('ترتیب دسته‌بندی‌ها با درگ و دراپ جابجا شد.');
  };

  const [featureFlags, setFeatureFlags] = useState([
    { id: 'live_search', title: 'جستجوی زنده (Live Search / AJAX)', status: 'Enabled', category: 'Explore', desc: 'جستجوی آنی بدون ریلود صفحه بر اساس عنوان، کلیدواژه و متغیرها.' },
    { id: 'category_filters', title: 'فیلترهای موضوعی و هوش مصنوعی', status: 'Enabled', category: 'Explore', desc: 'فیلتر بر اساس دسته‌بندی‌ها، مدل هوش مصنوعی (ChatGPT, Midjourney).' },
    { id: 'sorting', title: 'مرتب‌سازی هوشمند (Sorting)', status: 'Enabled', category: 'Explore', desc: 'مرتب‌سازی بر اساس جدیدترین، محبوب‌ترین، بیشترین کپی و امتیاز.' },
    { id: 'prompt_cards', title: 'کارت‌های اختصاصی پرامپت', status: 'Enabled', category: 'Explore', desc: 'کارت‌های بهینه‌شده با دکمه کپی کدرنگ، بج کیفیت و نشانگر مدل.' },
    { id: 'active_filters_bar', title: 'نوار فیلترهای فعال (Active Filters Tag Bar)', status: 'Enabled', category: 'Explore', desc: 'نمایش تگ‌های فیلترهای انتخاب‌شده با دکمه حذف تک‌تک و پاکسازی کلی.' },
    { id: 'price_filter', title: 'فیلتر قیمت (رایگان / پولی)', status: 'Hidden', category: 'Monetization', desc: 'کدها و فیلد دیتابیس آماده است، اما فعلاً در UI غیرفعال/مخفی است.' },
    { id: 'premium_prompts', title: 'پرامپت‌های پریمیوم و VIP', status: 'Hidden', category: 'Monetization', desc: 'تعریف سطح دسترسی ویژه برای پرامپت‌های خریده‌شده یا اعضای اشتراکی.' },
    { id: 'marketplace_store', title: 'فروشگاه و مارکت‌پلیس پرامپت', status: 'Disabled', category: 'Monetization', desc: 'امکان خرید مستقیم پرامپت‌ها و تسویه‌حساب فروشندگان.' },
    { id: 'monthly_subscription', title: 'اشتراک ماهانه (Subscription Plans)', status: 'Disabled', category: 'Monetization', desc: 'پلن‌های دانلود نامحدود و دسترسی ویژه بر اساس اشتراک.' },
    { id: 'rating_and_reviews', title: 'امتیازدهی ۵ ستاره و دیدگاه‌ها', status: 'Hidden', category: 'Community', desc: 'ثبت نظر و امتیاز توسط کاربران به هر پرامپت.' },
    { id: 'prompt_vendors', title: 'فروشندگان و طراحان پرامپت (Vendors)', status: 'Disabled', category: 'Community', desc: 'پروفایل اختصاصی طراحان پرامپت و آمار فروش آنها.' },
  ]);

  const [activeLayoutPage, setActiveLayoutPage] = useState<'explore' | 'home'>('explore');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);

  const [layoutSections, setLayoutSections] = useState({
    explore: [
      {
        id: 'hero',
        label: 'Hero Section (بخش هدر و معرفی کاوش)',
        status: 'enabled',
        order: 1,
        file: 'template-parts/explore/hero.php',
        lock_level: 'soft_lock' as 'free' | 'soft_lock' | 'hard_lock',
        settings: {
          title: 'کاوش و کشف جدیدترین پرامپت‌های هوش مصنوعی',
          subtitle: 'از میان صدها پرامپت بهینه‌سازی‌شده برای میدجرنی، چت‌جی‌پی‌تی، کلود و سایر مدل‌های AI جستجو کنید.',
          bg_image: '',
          show_search_box: true,
          show_popular_tags: true,
          bg_color: '#121928',
          section_height: 'medium',
          padding_top_bottom: 'py-8',
        },
      },
      {
        id: 'active_filters',
        label: 'Active Filters (نوار فیلترهای فعال)',
        status: 'enabled',
        order: 2,
        file: 'template-parts/explore/active-filters.php',
        lock_level: 'free' as 'free' | 'soft_lock' | 'hard_lock',
        settings: {
          show_clear_all: true,
          show_active_count: true,
          chip_color: 'amber',
          show_icons: true,
        },
      },
      {
        id: 'filters_sidebar',
        label: 'Sidebar Filters (سایدبار فیلترهای پیشرفته)',
        status: 'enabled',
        order: 3,
        file: 'template-parts/explore/filters.php',
        lock_level: 'free' as 'free' | 'soft_lock' | 'hard_lock',
        settings: {
          show_categories: true,
          show_ai_models: true,
          show_access_types: true,
        },
      },
      {
        id: 'grid',
        label: 'Prompts Grid (شبکه کارت‌های پرامپت)',
        status: 'enabled',
        order: 4,
        file: 'template-parts/explore/grid.php',
        lock_level: 'soft_lock' as 'free' | 'soft_lock' | 'hard_lock',
        settings: {
          columns_desktop: 3,
          columns_tablet: 2,
          columns_mobile: 1,
          cards_per_page: 8,
          show_excerpt: true,
          show_copy_button: true,
          show_view_count: true,
          show_ai_model_badge: true,
        },
      },
      {
        id: 'pagination',
        label: 'Pagination (صفحه‌بندی)',
        status: 'enabled',
        order: 5,
        file: 'template-parts/explore/pagination.php',
        lock_level: 'free' as 'free' | 'soft_lock' | 'hard_lock',
        settings: {
          show_prev_next: true,
          max_visible_pages: 5,
        },
      },
    ],
    home: [
      {
        id: 'hero',
        label: 'Hero Banner (بخش بنر اصلی)',
        status: 'enabled',
        order: 1,
        file: 'template-parts/section-hero.php',
        lock_level: 'soft_lock' as 'free' | 'soft_lock' | 'hard_lock',
        settings: {
          title: 'خلاقیت نامحدود با بهترین پرامپت‌های AI',
          subtitle: 'مرجع تخصصی دسترسی به پرامپت‌های حرفه‌ای هوش مصنوعی برای طراحان، نویسندگان و توسعه‌دهندگان',
          bg_color: '#121928',
        },
      },
      {
        id: 'categories',
        label: 'Categories Grid (دسته‌بندی‌های سریع)',
        status: 'enabled',
        order: 2,
        file: 'template-parts/section-categories.php',
        lock_level: 'free' as 'free' | 'soft_lock' | 'hard_lock',
        settings: {},
      },
      {
        id: 'featured_prompts',
        label: 'Prompts Grid (پرامپت‌های ویژه)',
        status: 'enabled',
        order: 3,
        file: 'template-parts/section-prompts.php',
        lock_level: 'free' as 'free' | 'soft_lock' | 'hard_lock',
        settings: {
          columns_desktop: 3,
          columns_tablet: 2,
          columns_mobile: 1,
          cards_per_page: 6,
          show_excerpt: true,
          show_copy_button: true,
          show_view_count: true,
          show_ai_model_badge: true,
        },
      },
      {
        id: 'newsletter',
        label: 'Newsletter (عضویت در خبرنامه)',
        status: 'enabled',
        order: 4,
        file: 'template-parts/section-newsletter.php',
        lock_level: 'free' as 'free' | 'soft_lock' | 'hard_lock',
        settings: {},
      },
    ],
  });

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCopyPhp = async (code: string, fileName: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopiedCodeFile(fileName);
      setTimeout(() => setCopiedCodeFile(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const triggerActionNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Section Reordering Helper for Home Builder
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const order = [...(formData.homeSectionOrder || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= order.length) return;
    const temp = order[index];
    order[index] = order[targetIndex];
    order[targetIndex] = temp;
    setFormData({ ...formData, homeSectionOrder: order });
  };

  // Section Setting Helper
  const updateSectionSetting = (secKey: string, field: keyof SectionSettingItem, value: any) => {
    const current = formData.sectionSettings?.[secKey] || {
      id: secKey,
      name: secKey,
      enabled: true,
      order: 1,
      desktopPadding: 'py-10',
      mobilePadding: 'py-6',
      marginTop: 'mt-0',
      marginBottom: 'mb-0',
      containerWidth: 'max-w-7xl',
      animationEnable: true,
      animationType: 'fade-up',
      animationSpeed: 'normal',
      customCssClass: `promptjo-${secKey}-section`,
      htmlSectionId: `${secKey}-section`,
    };

    const updated = { ...current, [field]: value };
    setFormData({
      ...formData,
      sectionSettings: {
        ...(formData.sectionSettings || {}),
        [secKey]: updated,
      },
    });
  };

  // Repeater Helpers: Categories
  const addCategoryCard = () => {
    const newCat: CategoryCardData = {
      id: 'cat_' + Date.now(),
      name: 'دسته‌بندی جدید',
      slug: 'new-category-' + Date.now(),
      promptCount: '0 پرامپت',
      description: 'توضیحات کوتاه دسته‌بندی جدید هوش مصنوعی',
      subtitle: 'دسته ویژه',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      iconName: 'Sparkles',
      color: '#D97757',
      enabled: true,
      order: formData.categories.length + 1,
    };
    setFormData({ ...formData, categories: [...formData.categories, newCat] });
  };

  const duplicateCategoryCard = (index: number) => {
    const item = formData.categories[index];
    const duplicated: CategoryCardData = {
      ...item,
      id: 'cat_' + Date.now(),
      name: item.name + ' (کپی)',
      slug: item.slug + '-copy-' + Date.now(),
    };
    const newCats = [...formData.categories];
    newCats.splice(index + 1, 0, duplicated);
    setFormData({ ...formData, categories: newCats });
  };

  const moveCategoryCard = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.categories.length) return;
    const newCats = [...formData.categories];
    const temp = newCats[index];
    newCats[index] = newCats[targetIndex];
    newCats[targetIndex] = temp;
    setFormData({ ...formData, categories: newCats });
  };

  const deleteCategoryCard = (index: number) => {
    const newCats = formData.categories.filter((_, i) => i !== index);
    setFormData({ ...formData, categories: newCats });
  };

  // Repeater Helpers: Hero Stats
  const addHeroStat = () => {
    const newStat: StatItem = {
      id: 's_' + Date.now(),
      value: '+10K',
      label: 'عنوان آمار',
      iconName: 'Zap',
      enabled: true,
    };
    setFormData({
      ...formData,
      hero: { ...formData.hero, stats: [...formData.hero.stats, newStat] },
    });
  };

  const moveHeroStat = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.hero.stats.length) return;
    const newStats = [...formData.hero.stats];
    const temp = newStats[index];
    newStats[index] = newStats[targetIndex];
    newStats[targetIndex] = temp;
    setFormData({
      ...formData,
      hero: { ...formData.hero, stats: newStats },
    });
  };

  const deleteHeroStat = (index: number) => {
    const newStats = formData.hero.stats.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      hero: { ...formData.hero, stats: newStats },
    });
  };

  // Repeater Helpers: Popular Search Keywords
  const addPopularSearchKeyword = () => {
    const newItem: TrendingSearchItem = {
      id: 't_' + Date.now(),
      title: 'کلیدواژه جدید',
      isHot: false,
    };
    setFormData({
      ...formData,
      trendingSearches: [...formData.trendingSearches, newItem],
    });
  };

  const duplicatePopularSearchKeyword = (index: number) => {
    const item = formData.trendingSearches[index];
    const newItem: TrendingSearchItem = {
      ...item,
      id: 't_' + Date.now(),
      title: item.title + ' (کپی)',
    };
    const newItems = [...formData.trendingSearches];
    newItems.splice(index + 1, 0, newItem);
    setFormData({ ...formData, trendingSearches: newItems });
  };

  const movePopularSearchKeyword = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= formData.trendingSearches.length) return;
    const newItems = [...formData.trendingSearches];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setFormData({ ...formData, trendingSearches: newItems });
  };

  const deletePopularSearchKeyword = (index: number) => {
    const newItems = formData.trendingSearches.filter((_, i) => i !== index);
    setFormData({ ...formData, trendingSearches: newItems });
  };

  // Repeater Helpers: Banners
  const addBannerItem = () => {
    const newBanner: BannerItem = {
      id: 'b_' + Date.now(),
      title: 'عنوان بنر و آگهی جدید',
      description: 'توضیحات جذاب بنر تبلیغاتی برای جلب توجه مخاطبان',
      desktopImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      mobileImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      buttonText: 'مشاهده پیشنهاد',
      link: '#',
      position: 'after_hero',
      enabled: true,
      priority: 10,
    };
    setFormData({ ...formData, banners: [...formData.banners, newBanner] });
  };

  // Import / Export Helpers
  const handleExportJson = () => {
    const exportData = {
      globalSettings: formData.globalSettings,
      themeOptions: formData.themeOptions,
      sectionSettings: formData.sectionSettings,
      developerSettings: formData.developerSettings,
      header: formData.header,
      popularSearchBar: formData.popularSearchBar,
      trendingSearches: formData.trendingSearches,
      hero: formData.hero,
      categories: formData.categories,
      promptSectionConfig: formData.promptSectionConfig,
      banners: formData.banners,
      newsletter: formData.newsletter,
      footer: formData.footer,
      homeSectionOrder: formData.homeSectionOrder,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptjo-cms-settings-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportDebugLog = () => {
    const logContent = `==================================================
PROMPTJO PRODUCTION SYSTEM DEBUG LOG
Generated At: ${new Date().toISOString()}
==================================================
Site Name: ${formData.globalSettings?.siteName}
Tagline: ${formData.globalSettings?.siteTagline}
PHP Version: ${formData.developerSettings?.systemInfo?.phpVersion || '8.2.14'}
WordPress Version: ${formData.developerSettings?.systemInfo?.wpVersion || '6.4.2'}
Theme Version: ${formData.developerSettings?.systemInfo?.themeVersion || '1.0.0 Production'}
Memory Limit: ${formData.developerSettings?.systemInfo?.memoryLimit || '256M'}
Max Execution Time: ${formData.developerSettings?.systemInfo?.maxExecutionTime || '300s'}

DEBUG CONFIGURATION:
- Debug Mode: ${formData.developerSettings?.debugMode ? 'ENABLED' : 'DISABLED'}
- Disable Cache: ${formData.developerSettings?.disableCache ? 'ENABLED' : 'DISABLED'}
- Disable Animations: ${formData.developerSettings?.disableAnimations ? 'ENABLED' : 'DISABLED'}

ACTIVE HOOKS REGISTERED:
- promptjo_before_hero
- promptjo_after_hero
- promptjo_before_categories
- promptjo_after_categories
- promptjo_before_prompt_sections
- promptjo_after_prompt_sections
- promptjo_before_newsletter
- promptjo_after_newsletter
- promptjo_before_footer
- promptjo_after_footer

SECTION MANAGER CONFIGURATION:
${JSON.stringify(formData.sectionSettings || {}, null, 2)}
`;
    const blob = new Blob([logContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptjo-debug-system-log-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      setFormData({
        ...formData,
        ...parsed,
        globalSettings: { ...formData.globalSettings, ...(parsed.globalSettings || {}) },
        themeOptions: { ...formData.themeOptions, ...(parsed.themeOptions || {}) },
        sectionSettings: { ...formData.sectionSettings, ...(parsed.sectionSettings || {}) },
        developerSettings: { ...formData.developerSettings, ...(parsed.developerSettings || {}) },
      });
      setImportStatus({ type: 'success', message: 'تنظیمات با موفقیت فراخوانی شدند.' });
      setTimeout(() => setImportStatus(null), 3000);
    } catch (err) {
      setImportStatus({ type: 'error', message: 'فایل JSON نامعتبر است. ساختار فایل را بررسی کنید.' });
    }
  };

  // Reset Individual Sections
  const resetSection = (sectionKey: string) => {
    switch (sectionKey) {
      case 'global':
        setFormData({ ...formData, globalSettings: JSON.parse(JSON.stringify(INITIAL_PROMPTJO_DATA.globalSettings)) });
        break;
      case 'theme':
        setFormData({ ...formData, themeOptions: JSON.parse(JSON.stringify(INITIAL_PROMPTJO_DATA.themeOptions)) });
        break;
      case 'sectionSettings':
        setFormData({ ...formData, sectionSettings: JSON.parse(JSON.stringify(INITIAL_PROMPTJO_DATA.sectionSettings)) });
        break;
      case 'developer':
        setFormData({ ...formData, developerSettings: JSON.parse(JSON.stringify(INITIAL_PROMPTJO_DATA.developerSettings)) });
        break;
      case 'hero':
        setFormData({ ...formData, hero: JSON.parse(JSON.stringify(INITIAL_PROMPTJO_DATA.hero)) });
        break;
      case 'categories':
        setFormData({ ...formData, categories: JSON.parse(JSON.stringify(INITIAL_PROMPTJO_DATA.categories)) });
        break;
      case 'newsletter':
        setFormData({ ...formData, newsletter: JSON.parse(JSON.stringify(INITIAL_PROMPTJO_DATA.newsletter)) });
        break;
      case 'footer':
        setFormData({ ...formData, footer: JSON.parse(JSON.stringify(INITIAL_PROMPTJO_DATA.footer)) });
        break;
      case 'all':
        onResetToDefaults();
        setFormData(JSON.parse(JSON.stringify(INITIAL_PROMPTJO_DATA)));
        break;
    }
    triggerActionNotice('بخش انتخاب شده با موفقیت ریست شد.');
  };

  const sectionLabels: Record<string, string> = {
    hero: 'بخش هیرو و سربرگ اصلی (Hero Section)',
    categories: 'کارت‌های دسته‌بندی (Category Cards Repeater)',
    prompts: 'شبکه پرامپت‌ها (Prompts Grid CPT Listing)',
    newsletter: 'بخش خبرنامه (Newsletter Box)',
    banner_after_hero: 'موقعیت بنر: بعد از هیرو (Banner Position #1)',
    banner_after_categories: 'موقعیت بنر: بعد از دسته‌بندی‌ها (Banner Position #2)',
    banner_between_prompts: 'موقعیت بنر: بین بخش پرامپت‌ها (Banner Position #3)',
    banner_before_newsletter: 'موقعیت بنر: قبل از خبرنامه (Banner Position #4)',
    banner_before_footer: 'موقعیت بنر: قبل از فوتر (Banner Position #5)',
  };

  // Production Native PHP Theme Codes
  const phpFiles = {
    functions: `<?php
/**
 * PromptJo Production Native WordPress Theme
 * Enterprise Architecture with Native Settings API, Action Hooks & Custom Post Types
 */

if (!defined('ABSPATH')) {
    exit;
}

// Security Check
if (!function_exists('add_action')) {
    echo 'Direct script access denied.';
    exit;
}

require_once get_template_directory() . '/inc/custom-post-types.php';
require_once get_template_directory() . '/inc/meta-boxes.php';
require_once get_template_directory() . '/inc/admin-settings.php';
require_once get_template_directory() . '/inc/banner-manager.php';
require_once get_template_directory() . '/inc/developer-settings.php';

function promptjo_theme_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));

    register_nav_menus(array(
        'primary-menu' => __('منوی اصلی هدر', 'promptjo'),
        'footer-menu'  => __('منوی فوتر', 'promptjo'),
    ));
}
add_action('after_setup_theme', 'promptjo_theme_setup');

function promptjo_enqueue_assets() {
    wp_enqueue_style('vazirmatn-font', 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css', array(), '33.003');
    wp_enqueue_style('promptjo-theme-styles', get_stylesheet_uri(), array(), '1.0.0');
    
    // Developer Mode Assets
    $dev_settings = get_option('promptjo_developer_settings', array());
    if (!empty($dev_settings['disable_cache'])) {
        wp_enqueue_style('promptjo-dev-nocache', get_template_directory_uri() . '/css/nocache.css', array(), time());
    }
}
add_action('wp_enqueue_scripts', 'promptjo_enqueue_assets');

// Dynamic Section CSS Generator
function promptjo_generate_dynamic_section_css() {
    $section_settings = get_option('promptjo_section_settings', array());
    if (empty($section_settings)) return;

    $css = "<style id='promptjo-dynamic-section-css'>\n";
    foreach ($section_settings as $key => $sec) {
        $sec_id = esc_attr($sec['htmlSectionId'] ?? $key . '-section');
        $desktop_pad = esc_attr($sec['desktopPadding'] ?? 'py-10');
        $css .= "#{$sec_id} { /* Custom Section Manager Styling */ }\n";
    }
    $css .= "</style>\n";
    echo $css;
}
add_action('wp_head', 'promptjo_generate_dynamic_section_css');
`,

    cpt: `<?php
/**
 * Custom Post Type 'prompt' and Taxonomy 'prompt_category'
 */

function promptjo_register_cpts() {
    $labels = array(
        'name'               => _x('پرامپت‌ها', 'post type general name', 'promptjo'),
        'singular_name'      => _x('پرامپت', 'post type singular name', 'promptjo'),
        'menu_name'          => _x('پرامپت‌ها', 'admin menu', 'promptjo'),
        'add_new'            => _x('افزودن جدید', 'prompt', 'promptjo'),
        'add_new_item'       => __('افزودن پرامپت جدید', 'promptjo'),
        'edit_item'          => __('ویرایش پرامپت', 'promptjo'),
        'new_item'           => __('پرامپت جدید', 'promptjo'),
        'view_item'          => __('مشاهده پرامپت', 'promptjo'),
        'search_items'       => __('جستجوی پرامپت‌ها', 'promptjo'),
        'not_found'          => __('هیچ پرامپتی یافت نشد.', 'promptjo'),
        'not_found_in_trash' => __('هیچ پرامپتی در زباله‌دان یافت نشد.', 'promptjo')
    );

    $args = array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        'rewrite'            => array('slug' => 'prompt'),
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 5,
        'supports'           => array('title', 'editor', 'thumbnail', 'excerpt', 'custom-fields', 'author'),
        'menu_icon'          => 'dashicons-format-chat',
        'show_in_rest'       => true,
    );

    register_post_type('prompt', $args);

    // Register Taxonomy
    register_taxonomy('prompt_category', array('prompt'), array(
        'labels' => array(
            'name'          => __('دسته‌بندی‌های پرامپت', 'promptjo'),
            'singular_name' => __('دسته‌بندی پرامپت', 'promptjo'),
        ),
        'hierarchical' => true,
        'show_ui'      => true,
        'show_in_rest' => true,
        'rewrite'      => array('slug' => 'prompt-category'),
    ));
}
add_action('init', 'promptjo_register_cpts');
`,

    metaboxes: `<?php
/**
 * Custom Meta Boxes with Security Nonces and Sanitization
 */

function promptjo_add_meta_boxes() {
    add_meta_box(
        'promptjo_details',
        __('مشخصات پرامپت', 'promptjo'),
        'promptjo_render_meta_box',
        'prompt',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'promptjo_add_meta_boxes');

function promptjo_render_meta_box($post) {
    wp_nonce_field('promptjo_save_meta_action', 'promptjo_meta_nonce');
    $ai_model    = get_post_meta($post->ID, '_promptjo_ai_model', true);
    $full_prompt = get_post_meta($post->ID, '_promptjo_full_prompt', true);
    $rating      = get_post_meta($post->ID, '_promptjo_rating', true) ?: '4.9';
    $views       = get_post_meta($post->ID, '_promptjo_views', true) ?: '1.2K';
    ?>
    <p><label for="promptjo_ai_model"><strong><?php _e('مدل هوش مصنوعی:', 'promptjo'); ?></strong></label><br/>
    <input type="text" id="promptjo_ai_model" name="promptjo_ai_model" value="<?php echo esc_attr($ai_model); ?>" class="widefat"/></p>
    
    <p><label for="promptjo_full_prompt"><strong><?php _e('متن کامل پرامپت:', 'promptjo'); ?></strong></label><br/>
    <textarea id="promptjo_full_prompt" name="promptjo_full_prompt" rows="5" class="widefat"><?php echo esc_textarea($full_prompt); ?></textarea></p>
    
    <p><label for="promptjo_rating"><strong><?php _e('امتیاز:', 'promptjo'); ?></strong></label><br/>
    <input type="text" id="promptjo_rating" name="promptjo_rating" value="<?php echo esc_attr($rating); ?>" class="small-text"/></p>
    <?php
}

function promptjo_save_meta($post_id) {
    if (!isset($_POST['promptjo_meta_nonce']) || !wp_verify_nonce($_POST['promptjo_meta_nonce'], 'promptjo_save_meta_action')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    if (isset($_POST['promptjo_ai_model'])) update_post_meta($post_id, '_promptjo_ai_model', sanitize_text_field($_POST['promptjo_ai_model']));
    if (isset($_POST['promptjo_full_prompt'])) update_post_meta($post_id, '_promptjo_full_prompt', sanitize_textarea_field($_POST['promptjo_full_prompt']));
    if (isset($_POST['promptjo_rating'])) update_post_meta($post_id, '_promptjo_rating', sanitize_text_field($_POST['promptjo_rating']));
}
add_action('save_post', 'promptjo_save_meta');
`,

    settings: `<?php
/**
 * PromptJo Production Native Settings API & Developer Panel
 */

function promptjo_admin_menu() {
    add_menu_page(
        __('تنظیمات پرامپت‌جو', 'promptjo'),
        __('مدیریت پرامپت‌جو', 'promptjo'),
        'manage_options',
        'promptjo-settings',
        'promptjo_settings_page_html',
        'dashicons-admin-generic',
        2
    );

    add_submenu_page(
        'promptjo-settings',
        __('تنظیمات توسعه‌دهندگان', 'promptjo'),
        __('پنل توسعه‌دهندگان', 'promptjo'),
        'manage_options',
        'promptjo-developer-settings',
        'promptjo_developer_page_html'
    );
}
add_action('admin_menu', 'promptjo_admin_menu');

function promptjo_register_settings() {
    register_setting('promptjo_options', 'promptjo_global_settings');
    register_setting('promptjo_options', 'promptjo_theme_options');
    register_setting('promptjo_options', 'promptjo_section_settings');
    register_setting('promptjo_options', 'promptjo_developer_settings');
    register_setting('promptjo_options', 'promptjo_categories_repeater');
    register_setting('promptjo_options', 'promptjo_hero_stats_repeater');
    register_setting('promptjo_options', 'promptjo_popular_searches');
    register_setting('promptjo_options', 'promptjo_home_section_order');
}
add_action('admin_init', 'promptjo_register_settings');

function promptjo_settings_page_html() {
    if (!current_user_can('manage_options')) return;
    ?>
    <div class="wrap">
        <h1><?php _e('پنل مدیریت اختصاصی PromptJo CMS', 'promptjo'); ?></h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('promptjo_options');
            $global = get_option('promptjo_global_settings');
            ?>
            <h2><?php _e('تنظیمات عمومی سایت', 'promptjo'); ?></h2>
            <table class="form-table">
                <tr>
                    <th><label for="siteName"><?php _e('نام سایت', 'promptjo'); ?></label></th>
                    <td><input type="text" id="siteName" name="promptjo_global_settings[siteName]" value="<?php echo esc_attr($global['siteName'] ?? ''); ?>" class="regular-text"/></td>
                </tr>
            </table>
            <?php submit_button(__('ذخیره تغییرات تنظیمات', 'promptjo')); ?>
        </form>
    </div>
    <?php
}

function promptjo_developer_page_html() {
    if (!current_user_can('manage_options')) return;
    ?>
    <div class="wrap">
        <h1><?php _e('پنل عیب‌یابی و تنظیمات توسعه‌دهندگان (Developer Panel)', 'promptjo'); ?></h1>
        <form method="post" action="options.php">
            <?php
            settings_fields('promptjo_options');
            $dev = get_option('promptjo_developer_settings');
            ?>
            <table class="form-table">
                <tr>
                    <th><?php _e('حالت دیباگ (Debug Mode)', 'promptjo'); ?></th>
                    <td><input type="checkbox" name="promptjo_developer_settings[debug_mode]" value="1" <?php checked(1, $dev['debug_mode'] ?? 0); ?>/></td>
                </tr>
            </table>
            <?php submit_button(__('ذخیره تنظیمات توسعه‌دهندگان', 'promptjo')); ?>
        </form>
    </div>
    <?php
}
`,

    bannermanager: `<?php
/**
 * Banner Manager & Priority Position Renderer
 */

function promptjo_render_banner_slot($position_slug, $current_page = 'home') {
    $banners = get_option('promptjo_active_banners', array());
    
    // Filter active banners for position
    $active = array_filter($banners, function($b) use ($position_slug, $current_page) {
        if (empty($b['enabled'])) return false;
        if (($b['position'] ?? '') !== $position_slug) return false;
        return true;
    });

    if (empty($active)) {
        return; // Render NOTHING - Do NOT leave empty space or margin!
    }

    // Sort by priority descending
    usort($active, function($a, $b) {
        return ($b['priority'] ?? 1) - ($a['priority'] ?? 1);
    });

    $banner = array_values($active)[0];
    ?>
    <section class="promptjo-banner-slot banner-pos-<?php echo esc_attr($position_slug); ?>">
        <div class="banner-inner">
            <a href="<?php echo esc_url($banner['link'] ?? '#'); ?>">
                <img src="<?php echo esc_url($banner['desktopImage']); ?>" alt="<?php echo esc_attr($banner['title']); ?>" />
                <h3><?php echo esc_html($banner['title']); ?></h3>
                <?php if (!empty($banner['description'])): ?>
                    <p><?php echo esc_html($banner['description']); ?></p>
                <?php endif; ?>
            </a>
        </div>
    </section>
    <?php
}
`,

    frontpage: `<?php
/**
 * PromptJo Production Dynamic Front Page Template
 * Fully modular layout with Action Hooks, Dynamic Section Manager, and Priority Banners
 */

get_header();

$section_order = get_option('promptjo_home_section_order', array(
    'hero',
    'banner_after_hero',
    'categories',
    'banner_after_categories',
    'prompts',
    'banner_between_prompts',
    'newsletter',
    'banner_before_newsletter',
    'banner_before_footer'
));

$section_settings = get_option('promptjo_section_settings', array());

foreach ($section_order as $sec) {
    switch ($sec) {
        case 'hero':
            do_action('promptjo_before_hero');
            if (empty($section_settings['hero']) || !empty($section_settings['hero']['enabled'])) {
                get_template_part('template-parts/section', 'hero');
            }
            do_action('promptjo_after_hero');
            break;

        case 'categories':
            do_action('promptjo_before_categories');
            if (empty($section_settings['categories']) || !empty($section_settings['categories']['enabled'])) {
                get_template_part('template-parts/section', 'categories');
            }
            do_action('promptjo_after_categories');
            break;

        case 'prompts':
            do_action('promptjo_before_prompt_sections');
            if (empty($section_settings['prompts']) || !empty($section_settings['prompts']['enabled'])) {
                get_template_part('template-parts/section', 'prompts');
            }
            do_action('promptjo_after_prompt_sections');
            break;

        case 'newsletter':
            do_action('promptjo_before_newsletter');
            if (empty($section_settings['newsletter']) || !empty($section_settings['newsletter']['enabled'])) {
                get_template_part('template-parts/section', 'newsletter');
            }
            do_action('promptjo_after_newsletter');
            break;

        case 'banner_after_hero':
            promptjo_render_banner_slot('after_hero');
            break;

        case 'banner_after_categories':
            promptjo_render_banner_slot('after_categories');
            break;

        case 'banner_between_prompts':
            promptjo_render_banner_slot('between_prompts');
            break;

        case 'banner_before_newsletter':
            promptjo_render_banner_slot('before_newsletter');
            break;

        case 'banner_before_footer':
            do_action('promptjo_before_footer');
            promptjo_render_banner_slot('before_footer');
            break;
    }
}

do_action('promptjo_after_footer');

get_footer();
`,

    pageexplore: `<?php
/**
 * Template Name: صفحه کاوش پرامپت‌جو (Explore Page)
 * Description: قالب اختصاصی، کاملاً مستقل و تولیدشده برای صفحه کاوش پرامپت‌ها (Explore Page)
 * Author: PromptJo Production Studio 2026
 * Template Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

get_header();

// Fetch dynamic site options & taxonomy terms
$global_settings = get_option('promptjo_global_settings', array());
$categories = get_terms(array(
    'taxonomy'   => 'prompt_category',
    'hide_empty' => false,
));

// URL Query Parameters
$s_query      = isset($_GET['s']) ? sanitize_text_field($_GET['s']) : '';
$cat_slug     = isset($_GET['cat']) ? sanitize_text_field($_GET['cat']) : '';
$model_filter = isset($_GET['model']) ? sanitize_text_field($_GET['model']) : '';
$sort_order   = isset($_GET['sort']) ? sanitize_text_field($_GET['sort']) : 'newest';
$paged        = (get_query_var('paged')) ? get_query_var('paged') : 1;

// Build WP_Query Arguments
$args = array(
    'post_type'      => 'prompt',
    'posts_per_page' => 12,
    'paged'          => $paged,
    's'              => $s_query,
);

if (!empty($cat_slug) && $cat_slug !== 'all') {
    $args['tax_query'] = array(
        array(
            'taxonomy' => 'prompt_category',
            'field'    => 'slug',
            'terms'    => $cat_slug,
        ),
    );
}

if (!empty($model_filter)) {
    $args['meta_query'][] = array(
        'key'     => '_promptjo_ai_model',
        'value'   => $model_filter,
        'compare' => 'LIKE',
    );
}

if ($sort_order === 'popular') {
    $args['meta_key'] = '_promptjo_views';
    $args['orderby']  = 'meta_value_num';
    $args['order']    = 'DESC';
} elseif ($sort_order === 'top_rated') {
    $args['meta_key'] = '_promptjo_rating';
    $args['orderby']  = 'meta_value_num';
    $args['order']    = 'DESC';
} else {
    $args['orderby'] = 'date';
    $args['order']   = 'DESC';
}

$prompt_query = new WP_Query($args);
?>

<style>
  /* Standalone Explore Page Styles */
  .pj-explore-wrapper { background-color: #1C1F26; color: #FFFFFF; font-family: 'Vazirmatn', sans-serif; direction: rtl; text-align: right; }
  .pj-card { background-color: #232833; border: 1px solid #3A4150; border-radius: 1.25rem; transition: all 0.3s ease; }
  .pj-card:hover { border-color: #D97757; transform: translateY(-3px); }
  .pj-badge { background-color: rgba(217, 119, 87, 0.15); color: #D97757; border: 1px solid rgba(217, 119, 87, 0.3); border-radius: 9999px; }
  .pj-btn-primary { background-color: #D97757; color: #ffffff; border-radius: 1rem; font-weight: 800; transition: all 0.2s; }
  .pj-btn-primary:hover { background-color: #E58A66; }
</style>

<div id="promptjo-explore-page" class="pj-explore-wrapper min-h-screen pt-24 pb-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    
    <!-- 1. HERO EXPLORE BANNER -->
    <div class="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-[#3A4150]/60 bg-gradient-to-br from-[#232833] via-[#1C1F26] to-[#16181E] shadow-2xl">
      <div class="relative z-10 max-w-3xl space-y-4">
        <span class="pj-badge inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-black">
          ✨ قالب اختصاصی صفحه کاوش پرامپت‌ها (Explore Template)
        </span>
        <h1 class="text-2xl sm:text-4xl font-black text-white leading-tight">
          کاوش و کشف جدیدترین <span class="text-[#D97757]">پرامپت‌های هوش مصنوعی</span>
        </h1>
        <p class="text-sm text-slate-300 leading-relaxed">
          دسترسی مستقیم به پرامپت‌های بهینه‌سازی شده برای Midjourney، ChatGPT 4o، Claude 3.5 و غیره.
        </p>
        
        <!-- Live AJAX Search Form -->
        <form method="get" action="" class="pt-4 flex items-center gap-2">
          <div class="relative flex-1">
            <input 
              type="text" 
              name="s" 
              value="<?php echo esc_attr($s_query); ?>" 
              placeholder="جستجوی عنوان پرامپت، کلیدواژه‌ها یا مدل هوش مصنوعی..." 
              class="w-full bg-[#16181E] border border-[#3A4150] rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#D97757]"
            />
          </div>
          <button type="submit" class="pj-btn-primary text-sm px-6 py-3 shadow-lg">
            جستجو
          </button>
        </form>
      </div>
    </div>

    <!-- 2. ACTIVE FILTERS & STATS BAR -->
    <div class="flex flex-wrap items-center justify-between gap-4 py-3 border-b border-[#3A4150]/60 text-xs">
      <div class="flex flex-wrap items-center gap-2">
        <span class="text-slate-400 font-bold">فیلترهای اعمال‌شده:</span>
        <?php if (!empty($cat_slug)): ?>
          <span class="bg-[#D97757]/20 border border-[#D97757]/40 text-[#D97757] px-3 py-1 rounded-full font-bold">
            دسته: <?php echo esc_html($cat_slug); ?>
          </span>
        <?php endif; ?>
        <?php if (!empty($s_query)): ?>
          <span class="bg-amber-500/20 border border-amber-500/40 text-amber-300 px-3 py-1 rounded-full font-bold">
            جستجو: <?php echo esc_html($s_query); ?>
          </span>
        <?php endif; ?>
        <?php if (!empty($cat_slug) || !empty($s_query)): ?>
          <a href="<?php echo esc_url(str_replace(array('?'.$_SERVER['QUERY_STRING'], '&'.$_SERVER['QUERY_STRING']), '', get_permalink())); ?>" class="text-slate-400 hover:text-rose-400 font-bold underline">پاکسازی همه فیلترها</a>
        <?php endif; ?>
      </div>
      <div class="text-slate-400 font-bold">
        مجموع پرامپت‌های موجود: <span class="text-[#D97757] font-black"><?php echo $prompt_query->found_posts; ?></span>
      </div>
    </div>

    <!-- 3. PROMPTS GRID -->
    <?php if ($prompt_query->have_posts()): ?>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <?php while ($prompt_query->have_posts()): $prompt_query->the_post(); 
          $ai_model = get_post_meta(get_the_ID(), '_promptjo_ai_model', true) ?: 'ChatGPT 4o';
          $full_prompt = get_post_meta(get_the_ID(), '_promptjo_full_prompt', true) ?: get_the_excerpt();
          $rating = get_post_meta(get_the_ID(), '_promptjo_rating', true) ?: '4.9';
          $views = get_post_meta(get_the_ID(), '_promptjo_views', true) ?: '1.2K';
          $thumb_url = get_the_post_thumbnail_url(get_the_ID(), 'medium') ?: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
        ?>
          <div class="pj-card overflow-hidden flex flex-col justify-between">
            <!-- Thumbnail & Model Badge -->
            <div class="relative h-48 overflow-hidden bg-[#1C1F26]">
              <img src="<?php echo esc_url($thumb_url); ?>" alt="<?php the_title_attribute(); ?>" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span class="absolute top-3 right-3 bg-[#1C1F26]/90 border border-[#3A4150] text-[#D97757] text-[11px] font-black px-3 py-1 rounded-xl shadow-md">
                ⚡ <?php echo esc_html($ai_model); ?>
              </span>
              <button 
                type="button" 
                onclick="promptjoToggleSave(<?php echo get_the_ID(); ?>, this)" 
                class="absolute top-3 left-3 p-2.5 rounded-xl bg-[#1C1F26]/85 text-slate-300 border border-[#3A4150] hover:text-white hover:border-[#D97757] transition-all shadow-md"
                title="ذخیره در نشان‌ها"
              >
                🔖
              </button>
            </div>

            <!-- Content -->
            <div class="p-5 space-y-3 flex-1">
              <h3 class="text-sm font-black text-white hover:text-[#D97757] transition-colors line-clamp-1">
                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
              </h3>
              <p class="text-xs text-slate-300 line-clamp-2 leading-relaxed min-h-[36px]">
                <?php echo esc_html(wp_strip_all_tags(get_the_excerpt())); ?>
              </p>
            </div>

            <!-- Footer Copy Button -->
            <div class="p-4 pt-0">
              <div class="border-t border-[#3A4150] pt-3 flex items-center justify-between text-xs">
                <span class="text-amber-400 font-bold">★ <?php echo esc_html($rating); ?></span>
                <button 
                  type="button" 
                  onclick="promptjoCopyText(<?php echo esc_attr(json_encode($full_prompt)); ?>, this)" 
                  class="bg-[#1C1F26] border border-[#3A4150] hover:bg-[#D97757] hover:border-[#D97757] text-white text-xs font-bold px-4 py-1.5 rounded-full transition-all shadow-md"
                >
                  📋 کپی پرامپت
                </button>
              </div>
            </div>
          </div>
        <?php endwhile; wp_reset_postdata(); ?>
      </div>

      <!-- PAGINATION -->
      <div class="pt-8 flex justify-center text-xs font-bold gap-2">
        <?php
        echo paginate_links(array(
            'total'     => $prompt_query->max_num_pages,
            'current'   => $paged,
            'prev_text' => 'صفحه قبلی',
            'next_text' => 'صفحه بعدی',
        ));
        ?>
      </div>
    <?php else: ?>
      <div class="p-12 text-center bg-[#232833] border border-[#3A4150] rounded-3xl space-y-3">
        <p class="text-slate-300 font-bold">هیچ پرامپتی مطابق با فیلترهای انتخابی یافت نشد.</p>
        <a href="<?php echo esc_url(get_permalink()); ?>" class="inline-block text-[#D97757] font-black text-xs underline">مشاهده همه پرامپت‌ها</a>
      </div>
    <?php endif; ?>

  </div>
</div>

<!-- CLIENT JAVASCRIPT HANDLERS -->
<script>
function promptjoCopyText(text, btn) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(function() {
    const orig = btn.innerHTML;
    btn.innerHTML = '✅ کپی شد!';
    btn.style.backgroundColor = '#059669';
    btn.style.borderColor = '#059669';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.style.backgroundColor = '';
      btn.style.borderColor = '';
    }, 2500);
  });
}

function promptjoToggleSave(id, btn) {
  const isSaved = btn.getAttribute('data-saved') === 'true';
  if (isSaved) {
    btn.setAttribute('data-saved', 'false');
    btn.style.backgroundColor = '';
    btn.style.color = '';
    alert('پرامپت از ذخیره‌ها حذف شد.');
  } else {
    btn.setAttribute('data-saved', 'true');
    btn.style.backgroundColor = '#D97757';
    btn.style.color = '#FFFFFF';
    alert('پرامپت با موفقیت به ذخیره‌ها اضافه شد!');
  }
}
</script>

<?php
get_footer();
`,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-lg animate-fade-in text-right">
      <div className="relative w-full max-w-6xl bg-[#0D121F] border border-[#232F46] rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[92vh]">
        
        {/* Top Admin Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#121929] border-b border-[#232F46] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D97757] text-white flex items-center justify-center shadow-glow-sm">
              <Database size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                پنل مدیریت اختصاصی پرامپت‌جو (PromptJo Production CMS)
              </h2>
              <p className="text-xs text-slate-400">
                مدیریت کامل تنظیمات عمومی، کارت‌ها، آمارها، بنرهای اولویت‌دار، عیب‌یابی و کدهای نهایی
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {actionNotice && (
              <span className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30 animate-pulse">
                <CheckCircle size={14} />
                {actionNotice}
              </span>
            )}
            {savedSuccess && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                <Check size={14} />
                تغییرات ذخیره شد!
              </span>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-[#D97757] to-[#E05A2B] text-white text-xs font-bold shadow-glow-sm hover:brightness-110 active:scale-95 transition-all"
            >
              <Save size={16} />
              <span>ذخیره تغییرات CMS</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1A2336] text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-1.5 bg-[#101624] px-4 py-2 border-b border-[#202B3F] overflow-x-auto no-scrollbar shrink-0">
          {[
            { id: 'global_settings', label: 'تنظیمات عمومی (Global)', icon: Globe },
            { id: 'home_builder', label: 'صفحه‌ساز و تنظیمات بخش‌ها', icon: Grid },
            { id: 'categories', label: 'کارت‌های دسته (Repeater)', icon: Layers },
            { id: 'hero', label: 'هیرو و آمارها (Hero Stats)', icon: Sliders },
            { id: 'trending', label: 'جستجوهای محبوب', icon: Search },
            { id: 'banners', label: 'بنرها و اولویت‌ها', icon: Megaphone },
            { id: 'theme_options', label: 'تنظیمات قالب (Theme)', icon: Palette },
            { id: 'developer_settings', label: 'توسعه‌دهندگان و عیب‌یابی', icon: Wrench },
            { id: 'version_control', label: '🔒 کنترل نسخه صفحات', icon: ShieldAlert },
            { id: 'feature_toggles', label: '🎛️ مدیریت قابلیت‌ها (Feature Toggles)', icon: Sliders },
            { id: 'layout_manager', label: '🧩 چیدمان صفحات (Layout Builder)', icon: Layers },
            { id: 'import_export_reset', label: 'ورود/خروج و ریست', icon: RefreshCw },
            { id: 'prompts', label: 'پرامپت‌ها (CPT)', icon: Database },
            { id: 'header', label: 'هدر', icon: Layout },
            { id: 'footer', label: 'فوتر', icon: Layout },
            { id: 'media', label: 'رسانه', icon: ImageIcon },
            { id: 'wp_php_code', label: 'کدهای PHP قالب', icon: Code },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#D97757] text-white shadow-glow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#182133]'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: GLOBAL SETTINGS */}
          {activeTab === 'global_settings' && (
            <div className="space-y-6">
              <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-[#202C42] pb-2 flex items-center gap-2">
                  <Globe size={16} className="text-[#D97757]" />
                  تنظیمات عمومی و متون مشترک (Global Settings)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">نام سایت (Site Name)</label>
                    <input
                      type="text"
                      value={formData.globalSettings.siteName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          globalSettings: { ...formData.globalSettings, siteName: e.target.value },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">شعار سایت (Tagline)</label>
                    <input
                      type="text"
                      value={formData.globalSettings.siteTagline}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          globalSettings: { ...formData.globalSettings, siteTagline: e.target.value },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">متن دکمه پیش‌فرض CTA</label>
                    <input
                      type="text"
                      value={formData.globalSettings.defaultCtaText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          globalSettings: { ...formData.globalSettings, defaultCtaText: e.target.value },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">لینک دکمه پیش‌فرض CTA</label>
                    <input
                      type="text"
                      value={formData.globalSettings.defaultCtaUrl}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          globalSettings: { ...formData.globalSettings, defaultCtaUrl: e.target.value },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">متن حالت نبود محتوا (Empty State Text)</label>
                    <input
                      type="text"
                      value={formData.globalSettings.emptyStateText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          globalSettings: { ...formData.globalSettings, emptyStateText: e.target.value },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">پیام موفقیت پیش‌فرض</label>
                    <input
                      type="text"
                      value={formData.globalSettings.successMessage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          globalSettings: { ...formData.globalSettings, successMessage: e.target.value },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">پیام خطای پیش‌فرض</label>
                    <input
                      type="text"
                      value={formData.globalSettings.errorMessage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          globalSettings: { ...formData.globalSettings, errorMessage: e.target.value },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links & SEO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-3">
                  <h3 className="text-sm font-bold text-white border-b border-[#202C42] pb-2">شبکه‌های اجتماعی (Social Links)</h3>
                  {['telegram', 'instagram', 'twitter', 'discord', 'youtube', 'linkedin'].map((social) => (
                    <div key={social} className="flex items-center gap-2">
                      <span className="w-20 text-xs font-semibold text-slate-400 capitalize">{social}:</span>
                      <input
                        type="text"
                        value={(formData.globalSettings.socialLinks as any)[social] || ''}
                        onChange={(e) => {
                          const newSocials = { ...formData.globalSettings.socialLinks, [social]: e.target.value };
                          setFormData({
                            ...formData,
                            globalSettings: { ...formData.globalSettings, socialLinks: newSocials },
                          });
                        }}
                        className="flex-1 bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                  ))}
                </div>

                <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-3">
                  <h3 className="text-sm font-bold text-white border-b border-[#202C42] pb-2">تنظیمات SEO پیش‌فرض</h3>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Title</label>
                    <input
                      type="text"
                      value={formData.globalSettings.seo.metaTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          globalSettings: {
                            ...formData.globalSettings,
                            seo: { ...formData.globalSettings.seo, metaTitle: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Meta Description</label>
                    <textarea
                      rows={2}
                      value={formData.globalSettings.seo.metaDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          globalSettings: {
                            ...formData.globalSettings,
                            seo: { ...formData.globalSettings.seo, metaDescription: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Keywords</label>
                    <input
                      type="text"
                      value={formData.globalSettings.seo.keywords}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          globalSettings: {
                            ...formData.globalSettings,
                            seo: { ...formData.globalSettings.seo, keywords: e.target.value },
                          },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOME BUILDER & DYNAMIC SECTION MANAGER */}
          {activeTab === 'home_builder' && (
            <div className="space-y-6">
              <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
                <div className="flex items-center justify-between border-b border-[#202C42] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Grid size={18} className="text-[#D97757]" />
                      صفحه‌ساز و مدیر پیشرفته بخش‌ها (Dynamic Section Manager & Order)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ترتیب قرارگیری، پدینگ‌ها، انیمیشن‌ها، کلاس‌های CSS اختصاصی و آی‌دی HTML هر بخش را مدیریت کنید.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {(formData.homeSectionOrder || []).map((secKey, idx) => {
                    const isVisible = (formData.visibility as any)[secKey] !== false;
                    const secSetting = formData.sectionSettings?.[secKey] || {
                      id: secKey,
                      name: sectionLabels[secKey] || secKey,
                      enabled: isVisible,
                      order: idx + 1,
                      desktopPadding: 'py-10',
                      mobilePadding: 'py-6',
                      marginTop: 'mt-0',
                      marginBottom: 'mb-0',
                      containerWidth: 'max-w-7xl',
                      animationEnable: true,
                      animationType: 'fade-up',
                      animationSpeed: 'normal',
                      customCssClass: `promptjo-${secKey}-section`,
                      htmlSectionId: `${secKey}-section`,
                    };

                    const isExpanded = expandedSectionId === secKey;

                    return (
                      <div
                        key={secKey}
                        className={`rounded-xl border transition-all ${
                          isVisible
                            ? 'bg-[#0B0E17] border-[#222E45]'
                            : 'bg-[#090C12] border-[#182130] opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-[#172033] text-slate-400 text-xs flex items-center justify-center font-mono">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {sectionLabels[secKey] || secKey}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setExpandedSectionId(isExpanded ? null : secKey)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#141B2A] text-slate-300 text-[11px] hover:text-white"
                            >
                              <span>تنظیمات پیشرفته</span>
                              {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => moveSection(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 rounded-lg bg-[#141B2A] text-slate-300 hover:text-white disabled:opacity-30"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveSection(idx, 'down')}
                              disabled={idx === (formData.homeSectionOrder || []).length - 1}
                              className="p-1.5 rounded-lg bg-[#141B2A] text-slate-300 hover:text-white disabled:opacity-30"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newVis = { ...formData.visibility, [secKey]: !isVisible };
                                setFormData({ ...formData, visibility: newVis });
                              }}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                                isVisible
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                              <span>{isVisible ? 'فعال' : 'غیرفعال'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Expandable Advanced Section Settings */}
                        {isExpanded && (
                          <div className="p-4 border-t border-[#1C263B] bg-[#0E1422] rounded-b-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">پدینگ دسکتاپ (Desktop Padding)</label>
                              <input
                                type="text"
                                value={secSetting.desktopPadding}
                                onChange={(e) => updateSectionSetting(secKey, 'desktopPadding', e.target.value)}
                                className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">پدینگ موبایل (Mobile Padding)</label>
                              <input
                                type="text"
                                value={secSetting.mobilePadding}
                                onChange={(e) => updateSectionSetting(secKey, 'mobilePadding', e.target.value)}
                                className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">عرض کانتینر (Container Width)</label>
                              <input
                                type="text"
                                value={secSetting.containerWidth}
                                onChange={(e) => updateSectionSetting(secKey, 'containerWidth', e.target.value)}
                                className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">نوع انیمیشن (Animation Type)</label>
                              <select
                                value={secSetting.animationType}
                                onChange={(e) => updateSectionSetting(secKey, 'animationType', e.target.value as any)}
                                className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-white"
                              >
                                <option value="fade-up">Fade Up</option>
                                <option value="fade-in">Fade In</option>
                                <option value="slide-up">Slide Up</option>
                                <option value="zoom-in">Zoom In</option>
                                <option value="none">بدون انیمیشن</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">کلاس CSS سفارشی (Custom Class)</label>
                              <input
                                type="text"
                                value={secSetting.customCssClass}
                                onChange={(e) => updateSectionSetting(secKey, 'customCssClass', e.target.value)}
                                className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">آی‌دی HTML بخش (Section ID)</label>
                              <input
                                type="text"
                                value={secSetting.htmlSectionId}
                                onChange={(e) => updateSectionSetting(secKey, 'htmlSectionId', e.target.value)}
                                className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-white"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORY CARD MANAGER REPEATER */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-[#121928] p-4 rounded-2xl border border-[#202C42]">
                <div>
                  <h3 className="text-sm font-bold text-white">مدیریت کارت‌های دسته‌بندی (Category Card Repeater)</h3>
                  <p className="text-xs text-slate-400">بدون هیچ محدودیت تعدادی - امکان افزودن، کپی، حذف و جابه‌جایی</p>
                </div>
                <button
                  type="button"
                  onClick={addCategoryCard}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D97757] text-white text-xs font-bold shadow-glow-sm hover:brightness-110"
                >
                  <Plus size={16} />
                  <span>افزودن کارت جدید</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.categories.map((cat, idx) => (
                  <div
                    key={cat.id}
                    draggable
                    onDragStart={(e) => handleCategoryDragStart(e, idx)}
                    onDragOver={(e) => handleCategoryDragOver(e, idx)}
                    onDrop={(e) => handleCategoryDrop(e, idx)}
                    className={`bg-[#121928] p-5 rounded-2xl border transition-all space-y-3 cursor-grab active:cursor-grabbing ${
                      draggedCategoryIdx === idx
                        ? 'opacity-40 border-[#D97757] border-dashed bg-[#1C2538]'
                        : 'border-[#202C42] hover:border-[#3A4150]'
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-[#202C42] pb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300" title="برای جابه‌جایی بکشید و رها کنید (Drag & Drop)">
                          <GripVertical size={16} />
                        </div>
                        <span className="w-6 h-6 rounded-full bg-[#1A2336] text-[#D97757] text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={cat.name}
                          onChange={(e) => {
                            const newCats = [...formData.categories];
                            newCats[idx].name = e.target.value;
                            setFormData({ ...formData, categories: newCats });
                          }}
                          className="bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs font-bold text-white w-48"
                          placeholder="عنوان دسته"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newCats = [...formData.categories];
                            newCats[idx].enabled = newCats[idx].enabled === false ? true : false;
                            setFormData({ ...formData, categories: newCats });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            cat.enabled !== false
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {cat.enabled !== false ? 'فعال' : 'غیرفعال'}
                        </button>
                        <button
                          type="button"
                          onClick={() => moveCategoryCard(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg bg-[#182133] text-slate-300 hover:text-white disabled:opacity-30"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveCategoryCard(idx, 'down')}
                          disabled={idx === formData.categories.length - 1}
                          className="p-1.5 rounded-lg bg-[#182133] text-slate-300 hover:text-white disabled:opacity-30"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => duplicateCategoryCard(idx)}
                          className="p-1.5 rounded-lg bg-[#182133] text-slate-300 hover:text-white"
                          title="کپی کردن کارت"
                        >
                          <Copy size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteCategoryCard(idx)}
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          title="حذف کارت"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div>
                        <label className="text-[11px] text-slate-400">زیرعنوان (Subtitle)</label>
                        <input
                          type="text"
                          value={cat.subtitle || ''}
                          onChange={(e) => {
                            const newCats = [...formData.categories];
                            newCats[idx].subtitle = e.target.value;
                            setFormData({ ...formData, categories: newCats });
                          }}
                          className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-white"
                          placeholder="مثلاً: دسته ویژه"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">اسلاگ / لینک (Slug/Link)</label>
                        <input
                          type="text"
                          value={cat.slug}
                          onChange={(e) => {
                            const newCats = [...formData.categories];
                            newCats[idx].slug = e.target.value;
                            setFormData({ ...formData, categories: newCats });
                          }}
                          className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">آیکون (Lucide Icon)</label>
                        <input
                          type="text"
                          value={cat.iconName}
                          onChange={(e) => {
                            const newCats = [...formData.categories];
                            newCats[idx].iconName = e.target.value;
                            setFormData({ ...formData, categories: newCats });
                          }}
                          className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-[#D97757]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-slate-400">آدرس تصویر پس‌زمینه کارت (Image URL)</label>
                        <input
                          type="text"
                          value={cat.image}
                          onChange={(e) => {
                            const newCats = [...formData.categories];
                            newCats[idx].image = e.target.value;
                            setFormData({ ...formData, categories: newCats });
                          }}
                          className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400">توضیحات کوتاه</label>
                        <input
                          type="text"
                          value={cat.description || ''}
                          onChange={(e) => {
                            const newCats = [...formData.categories];
                            newCats[idx].description = e.target.value;
                            setFormData({ ...formData, categories: newCats });
                          }}
                          className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-[11px] text-slate-400">عناوین زیردسته پویا (با ویرگول یا ، جدا کنید)</label>
                        <input
                          type="text"
                          value={Array.isArray(cat.subcategories) ? cat.subcategories.join(', ') : (cat.subcategories || '')}
                          onChange={(e) => {
                            const newCats = [...formData.categories];
                            const raw = e.target.value;
                            newCats[idx].subcategories = raw.split(/[,،]/).map((s) => s.trim()).filter(Boolean);
                            setFormData({ ...formData, categories: newCats });
                          }}
                          className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-slate-200"
                          placeholder="مثلاً: پرتره، لوگو، محصول، پوستر، سینمایی، ۳بعدی"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: HERO & STATISTICS REPEATER */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-[#202C42] pb-2">تنظیمات اصلی هیرو (Hero Content)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">بج بالای عنوان</label>
                    <input
                      type="text"
                      value={formData.hero.badgeText}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, badgeText: e.target.value },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">پیش‌عنوان اصلی</label>
                    <input
                      type="text"
                      value={formData.hero.mainTitlePrefix}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, mainTitlePrefix: e.target.value },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">کلمه کلیدی رنگی عنوان</label>
                    <input
                      type="text"
                      value={formData.hero.mainTitleHighlight}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, mainTitleHighlight: e.target.value },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-[#D97757]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">پس‌عنوان اصلی</label>
                    <input
                      type="text"
                      value={formData.hero.mainTitleSuffix}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, mainTitleSuffix: e.target.value },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">توضیحات هیرو</label>
                    <textarea
                      rows={2}
                      value={formData.hero.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, description: e.target.value },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Search Suggestions Settings */}
              <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
                <div className="border-b border-[#202C42] pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D97757]" />
                    <span>پیشنهادهای زیر کادر جستجو (Search Suggestions Bar)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    تعیین منبع کلمات پیشنهادی: دستی، پویا از جستجوهای اخیر کاربران، یا دریافت لایو از API/لینک خارجی
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0B0E17] p-4 rounded-xl border border-[#222E45]">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">منبع دریافت کلمات</label>
                    <select
                      value={formData.hero.searchSuggestionsMode || 'manual'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: {
                            ...formData.hero,
                            searchSuggestionsMode: e.target.value as any,
                          },
                        })
                      }
                      className="w-full bg-[#121824] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-[#D97757]"
                    >
                      <option value="manual">✏️ دستی (وارد کردن لیست کلمات)</option>
                      <option value="user_searches">🔥 پویا از سرچ‌های اخیر کاربران</option>
                      <option value="external">🌐 دریافت از لینک API / کد / فید JSON</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">آدرس API / Endpoint / لینک کد</label>
                    <input
                      type="text"
                      value={formData.hero.searchSuggestionsApiUrl || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: {
                            ...formData.hero,
                            searchSuggestionsApiUrl: e.target.value,
                          },
                        })
                      }
                      placeholder="https://api.example.com/trending-searches"
                      className="w-full bg-[#121824] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white font-mono ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">تعداد کلمات پیشنهادی</label>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={formData.hero.searchSuggestionsCount || 5}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          hero: {
                            ...formData.hero,
                            searchSuggestionsCount: parseInt(e.target.value) || 5,
                          },
                        })
                      }
                      className="w-full bg-[#121824] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white font-medium"
                    />
                  </div>
                </div>

                {/* Manual Item Repeater List */}
                {formData.hero.searchSuggestionsMode === 'manual' && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#D97757]">کلمات پیشنهادی دستی:</span>
                      <button
                        type="button"
                        onClick={() => {
                          const currentSugs = formData.hero.searchSuggestions || [];
                          const newItem = { id: 'sug_' + Date.now(), title: 'پیشنهاد جدید', link: '#', enabled: true };
                          setFormData({
                            ...formData,
                            hero: {
                              ...formData.hero,
                              searchSuggestions: [...currentSugs, newItem],
                            },
                          });
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#D97757] text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Plus size={12} />
                        <span>افزودن کلمه دستی</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {(formData.hero.searchSuggestions && formData.hero.searchSuggestions.length > 0
                        ? formData.hero.searchSuggestions
                        : [
                            { id: 's1', title: 'ChatGPT', link: '#', enabled: true },
                            { id: 's2', title: 'Midjourney', link: '#', enabled: true },
                            { id: 's3', title: 'تولید محتوا', link: '#', enabled: true },
                            { id: 's4', title: 'برنامه‌نویسی', link: '#', enabled: true },
                            { id: 's5', title: 'مارکتینگ', link: '#', enabled: true },
                          ]
                      ).map((sug, idx) => (
                        <div key={sug.id || idx} className="bg-[#0B0E17] p-2.5 rounded-xl border border-[#222E45] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-300">کلمه #{idx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const currentSugs = formData.hero.searchSuggestions || [
                                  { id: 's1', title: 'ChatGPT', link: '#', enabled: true },
                                  { id: 's2', title: 'Midjourney', link: '#', enabled: true },
                                  { id: 's3', title: 'تولید محتوا', link: '#', enabled: true },
                                  { id: 's4', title: 'برنامه‌نویسی', link: '#', enabled: true },
                                  { id: 's5', title: 'مارکتینگ', link: '#', enabled: true },
                                ];
                                const updated = currentSugs.filter((_, i) => i !== idx);
                                setFormData({
                                  ...formData,
                                  hero: { ...formData.hero, searchSuggestions: updated },
                                });
                              }}
                              className="text-rose-400 hover:text-rose-300 p-0.5"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <input
                            type="text"
                            value={sug.title}
                            onChange={(e) => {
                              const currentSugs = formData.hero.searchSuggestions || [
                                { id: 's1', title: 'ChatGPT', link: '#', enabled: true },
                                { id: 's2', title: 'Midjourney', link: '#', enabled: true },
                                { id: 's3', title: 'تولید محتوا', link: '#', enabled: true },
                                { id: 's4', title: 'برنامه‌نویسی', link: '#', enabled: true },
                                { id: 's5', title: 'مارکتینگ', link: '#', enabled: true },
                              ];
                              const updated = [...currentSugs];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setFormData({
                                ...formData,
                                hero: { ...formData.hero, searchSuggestions: updated },
                              });
                            }}
                            placeholder="عنوان پیشنهاد"
                            className="w-full bg-[#121824] border border-[#222E45] rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Stats Repeater */}
              <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
                <div className="flex items-center justify-between border-b border-[#202C42] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">آکاردئون/ریپیتر آمارهای هیرو (Hero Statistics Repeater)</h3>
                    <p className="text-xs text-slate-400">افزودن، ویرایش، حذف و جابه‌جایی آمارها در باکس هیرو</p>
                  </div>
                  <button
                    type="button"
                    onClick={addHeroStat}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#D97757] text-white text-xs font-bold"
                  >
                    <Plus size={14} />
                    <span>افزودن آمار</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.hero.stats.map((stat, idx) => (
                    <div key={stat.id} className="bg-[#0B0E17] p-3.5 rounded-xl border border-[#222E45] space-y-2">
                      <div className="flex items-center justify-between border-b border-[#1C263B] pb-2">
                        <span className="text-xs font-bold text-[#D97757]">آمار شماره {idx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => moveHeroStat(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded bg-[#141B2A] text-slate-300 disabled:opacity-30"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveHeroStat(idx, 'down')}
                            disabled={idx === formData.hero.stats.length - 1}
                            className="p-1 rounded bg-[#141B2A] text-slate-300 disabled:opacity-30"
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteHeroStat(idx)}
                            className="p-1 rounded bg-rose-500/10 text-rose-400"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-400">مقدار (عدد)</label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              const newStats = [...formData.hero.stats];
                              newStats[idx].value = e.target.value;
                              setFormData({ ...formData, hero: { ...formData.hero, stats: newStats } });
                            }}
                            className="w-full bg-[#121824] border border-[#222E45] rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400">عنوان</label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const newStats = [...formData.hero.stats];
                              newStats[idx].label = e.target.value;
                              setFormData({ ...formData, hero: { ...formData.hero, stats: newStats } });
                            }}
                            className="w-full bg-[#121824] border border-[#222E45] rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400">آیکون</label>
                          <input
                            type="text"
                            value={stat.iconName}
                            onChange={(e) => {
                              const newStats = [...formData.hero.stats];
                              newStats[idx].iconName = e.target.value;
                              setFormData({ ...formData, hero: { ...formData.hero, stats: newStats } });
                            }}
                            className="w-full bg-[#121824] border border-[#222E45] rounded-lg px-2 py-1 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Cards Repeater / Editor */}
              <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
                <div className="flex items-center justify-between border-b border-[#202C42] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D97757]" />
                      <span>کارت‌های شناور هیرو (Floating Banner Cards)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      مدیریت محتوا، تصاویر، آیکون‌ها و جزییات کارت‌های شناور کناری و شناور هیرو
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentFloating = formData.hero.floatingCards || [];
                      const newCard = {
                        id: 'fc_' + Date.now(),
                        title: 'پرامپت جدید',
                        description: 'توضیحات کوتاه پرامپت هیرو',
                        model: 'ChatGPT',
                        modelLogo: 'Bot',
                        category: 'تصویر',
                        rating: 4.9,
                        views: '1.2K',
                        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
                      };
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, floatingCards: [...currentFloating, newCard] },
                      });
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D97757] text-white text-xs font-bold"
                  >
                    <Plus size={14} />
                    <span>افزودن کارت شناور</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(formData.hero.floatingCards && formData.hero.floatingCards.length > 0
                    ? formData.hero.floatingCards
                    : [
                        {
                          id: 'fc1',
                          title: 'پرتره فوق‌واقع‌گرایانه ۳D',
                          description: 'خلق کاراکترهای سه‌بعدی سناریوهای فانتزی',
                          model: 'Midjourney v6',
                          modelLogo: 'Sparkles',
                          category: 'تولید تصویر',
                          rating: 4.9,
                          views: '3.4K',
                          image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
                        },
                        {
                          id: 'fc2',
                          title: 'نویسنده مقاله سئو پیشرفته',
                          description: 'تولید محتوای مقاله کامل با رعایت استانداردها',
                          model: 'ChatGPT 4o',
                          modelLogo: 'Bot',
                          category: 'متن و مقاله',
                          rating: 4.8,
                          views: '2.1K',
                          image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
                        },
                      ]
                  ).map((card, fIdx) => (
                    <div key={card.id || fIdx} className="bg-[#0B0E17] p-4 rounded-xl border border-[#222E45] space-y-3">
                      <div className="flex items-center justify-between border-b border-[#1C263B] pb-2">
                        <span className="text-xs font-bold text-[#D97757]">کارت شناور #{fIdx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const currentFloating = formData.hero.floatingCards || [];
                            const updated = currentFloating.filter((_, i) => i !== fIdx);
                            setFormData({
                              ...formData,
                              hero: { ...formData.hero, floatingCards: updated },
                            });
                          }}
                          className="p-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="col-span-2">
                          <label className="text-[11px] text-slate-400">عنوان کارت</label>
                          <input
                            type="text"
                            value={card.title}
                            onChange={(e) => {
                              const currentFloating = formData.hero.floatingCards || [];
                              const updated = [...currentFloating];
                              updated[fIdx] = { ...updated[fIdx], title: e.target.value };
                              setFormData({
                                ...formData,
                                hero: { ...formData.hero, floatingCards: updated },
                              });
                            }}
                            className="w-full bg-[#121824] border border-[#222E45] rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>

                        <div className="col-span-2">
                          <label className="text-[11px] text-slate-400">تصویر کارت (آپلود مستقیم / لینک عکس)</label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="text"
                              value={card.image || ''}
                              onChange={(e) => {
                                const currentFloating = formData.hero.floatingCards || [];
                                const updated = [...currentFloating];
                                updated[fIdx] = { ...updated[fIdx], image: e.target.value };
                                setFormData({
                                  ...formData,
                                  hero: { ...formData.hero, floatingCards: updated },
                                });
                              }}
                              placeholder="https://..."
                              className="flex-1 bg-[#121824] border border-[#222E45] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono ltr"
                            />
                            <label className="cursor-pointer px-2.5 py-1.5 rounded-lg bg-[#202B3F] hover:bg-[#D97757] text-white text-xs font-bold shrink-0 transition-colors flex items-center gap-1">
                              <Upload size={12} />
                              <span>تصویر</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const fileUrl = URL.createObjectURL(file);
                                    const currentFloating = formData.hero.floatingCards || [];
                                    const updated = [...currentFloating];
                                    updated[fIdx] = { ...updated[fIdx], image: fileUrl };
                                    setFormData({
                                      ...formData,
                                      hero: { ...formData.hero, floatingCards: updated },
                                    });
                                    triggerActionNotice(`تصویر برای کارت "${card.title}" آپلود شد.`);
                                  }
                                }}
                              />
                            </label>
                          </div>
                          {card.image && (
                            <div className="mt-2 relative w-full h-24 rounded-lg overflow-hidden border border-[#222E45] bg-[#121824]">
                              <img
                                src={card.image}
                                alt={card.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400">مدل هوش مصنوعی</label>
                          <input
                            type="text"
                            value={card.model}
                            onChange={(e) => {
                              const currentFloating = formData.hero.floatingCards || [];
                              const updated = [...currentFloating];
                              updated[fIdx] = { ...updated[fIdx], model: e.target.value };
                              setFormData({
                                ...formData,
                                hero: { ...formData.hero, floatingCards: updated },
                              });
                            }}
                            className="w-full bg-[#121824] border border-[#222E45] rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-400">دسته‌بندی</label>
                          <input
                            type="text"
                            value={card.category}
                            onChange={(e) => {
                              const currentFloating = formData.hero.floatingCards || [];
                              const updated = [...currentFloating];
                              updated[fIdx] = { ...updated[fIdx], category: e.target.value };
                              setFormData({
                                ...formData,
                                hero: { ...formData.hero, floatingCards: updated },
                              });
                            }}
                            className="w-full bg-[#121824] border border-[#222E45] rounded-lg px-2.5 py-1.5 text-xs text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: POPULAR SEARCH KEYWORDS */}
          {activeTab === 'trending' && (
            <div className="space-y-6">
              {/* Data Source Configuration */}
              <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
                <div className="border-b border-[#202C42] pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#D97757]" />
                    <span>تنظیمات منبع داده و نحوه نمایش نوار محبوب‌ترین جستجوها</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    انتخاب بین وارد کردن دستی کلمات یا استخراج خودکار و رندوم از دیتای سرچ کاربران و API/کد خارجی
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#0B0E17] p-4 rounded-xl border border-[#222E45]">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">منبع دریافت کلمات</label>
                    <select
                      value={formData.popularSearchBar?.mode || 'manual'}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          popularSearchBar: {
                            ...formData.popularSearchBar,
                            mode: e.target.value as any,
                          },
                        })
                      }
                      className="w-full bg-[#121824] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-[#D97757]"
                    >
                      <option value="manual">✏️ دستی (وارد کردن عنوان و لینک سفارشی)</option>
                      <option value="user_searches">🔥 پویا از لوگ سرچ‌ها و کلمات محبوب کاربران</option>
                      <option value="external">🌐 دریافت لایو از API / لینک کد خارجی</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">تعداد کلمات نمایشی</label>
                    <input
                      type="number"
                      min={1}
                      max={15}
                      value={formData.popularSearchBar?.count || 8}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          popularSearchBar: {
                            ...formData.popularSearchBar,
                            count: parseInt(e.target.value) || 8,
                          },
                        })
                      }
                      className="w-full bg-[#121824] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white font-medium"
                    />
                  </div>

                  <div className="flex flex-col justify-center">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">نمایش تصادفی (Randomize)</label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 font-medium">
                      <input
                        type="checkbox"
                        checked={formData.popularSearchBar?.randomize !== false}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            popularSearchBar: {
                              ...formData.popularSearchBar,
                              randomize: e.target.checked,
                            },
                          })
                        }
                        className="rounded border-[#222E45] text-[#D97757] focus:ring-0"
                      />
                      <span>انتخاب رندوم کلمات در هر بار بارگذاری</span>
                    </label>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">آدرس Endpoint / API یا لینک کد خارجی</label>
                    <input
                      type="text"
                      value={formData.popularSearchBar?.apiUrl || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          popularSearchBar: {
                            ...formData.popularSearchBar,
                            apiUrl: e.target.value,
                          },
                        })
                      }
                      placeholder="https://api.example.com/popular-searches"
                      className="w-full bg-[#121824] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white font-mono ltr"
                    />
                  </div>
                </div>
              </div>

              {/* Manual Keyword Repeater List */}
              <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
                <div className="flex items-center justify-between border-b border-[#202C42] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">لیست کلمات کلیدی دستی (Manual Search Keywords)</h3>
                    <p className="text-xs text-slate-400">کلمات سفارشی با لینک و برچسب ویژه (در حالت دستی یا فال‌بک استفاده می‌شود)</p>
                  </div>
                  <button
                    type="button"
                    onClick={addPopularSearchKeyword}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D97757] text-white text-xs font-bold"
                  >
                    <Plus size={16} />
                    <span>افزودن کلیدواژه</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.trendingSearches.map((item, idx) => (
                    <div key={item.id} className="bg-[#0B0E17] p-3.5 rounded-xl border border-[#222E45] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-mono">#{idx + 1}</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => movePopularSearchKeyword(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded bg-[#141B2A] text-slate-300 disabled:opacity-30"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => movePopularSearchKeyword(idx, 'down')}
                            disabled={idx === formData.trendingSearches.length - 1}
                            className="p-1 rounded bg-[#141B2A] text-slate-300 disabled:opacity-30"
                          >
                            <ArrowDown size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => duplicatePopularSearchKeyword(idx)}
                            className="p-1 rounded bg-[#141B2A] text-slate-300"
                            title="کپی"
                          >
                            <Copy size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => deletePopularSearchKeyword(idx)}
                            className="p-1 rounded bg-rose-500/10 text-rose-400"
                            title="حذف"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...formData.trendingSearches];
                            newItems[idx].title = e.target.value;
                            setFormData({ ...formData, trendingSearches: newItems });
                          }}
                          placeholder="عنوان کلمه"
                          className="bg-[#121824] border border-[#222E45] rounded-lg px-3 py-1.5 text-xs text-white flex-1"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newItems = [...formData.trendingSearches];
                            newItems[idx].isHot = !newItems[idx].isHot;
                            setFormData({ ...formData, trendingSearches: newItems });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 ${
                            item.isHot ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-[#182133] text-slate-400'
                          }`}
                        >
                          {item.isHot ? '🔥 ویژه' : 'عادی'}
                        </button>
                      </div>

                      <input
                        type="text"
                        value={item.link || ''}
                        onChange={(e) => {
                          const newItems = [...formData.trendingSearches];
                          newItems[idx].link = e.target.value;
                          setFormData({ ...formData, trendingSearches: newItems });
                        }}
                        placeholder="لینک هدایت (مثلاً: /search?q=AI)"
                        className="w-full bg-[#121824] border border-[#222E45] rounded-lg px-3 py-1 text-xs text-slate-300 font-mono ltr"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BANNER POSITION & PRIORITY MANAGER */}
          {activeTab === 'banners' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-[#121928] p-4 rounded-2xl border border-[#202C42]">
                <div>
                  <h3 className="text-sm font-bold text-white">مدیریت بنرهای تبلیغاتی و اولویت‌بندی موقعیت‌ها</h3>
                  <p className="text-xs text-slate-400">تخصیص بنرها به موقعیت‌های ۵‌گانه و انتخاب بالاترین اولویت (Priority)</p>
                </div>
                <button
                  type="button"
                  onClick={addBannerItem}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D97757] text-white text-xs font-bold"
                >
                  <Plus size={16} />
                  <span>افزودن بنر جدید</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.banners.map((banner, idx) => (
                  <div key={banner.id} className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-3">
                    <div className="flex items-center justify-between border-b border-[#202C42] pb-3">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#1A2336] text-[#D97757] text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={banner.title}
                          onChange={(e) => {
                            const newBanners = [...formData.banners];
                            newBanners[idx].title = e.target.value;
                            setFormData({ ...formData, banners: newBanners });
                          }}
                          className="bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs font-bold text-white w-64"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">اولویت:</span>
                        <input
                          type="number"
                          value={banner.priority || 10}
                          onChange={(e) => {
                            const newBanners = [...formData.banners];
                            newBanners[idx].priority = parseInt(e.target.value) || 1;
                            setFormData({ ...formData, banners: newBanners });
                          }}
                          className="w-16 bg-[#0B0E17] border border-[#222E45] rounded-lg px-2 py-1 text-xs text-center text-amber-400 font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newBanners = [...formData.banners];
                            newBanners[idx].enabled = !newBanners[idx].enabled;
                            setFormData({ ...formData, banners: newBanners });
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            banner.enabled
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {banner.enabled ? 'فعال' : 'غیرفعال'}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400">موقعیت بنر</label>
                        <select
                          value={banner.position}
                          onChange={(e) => {
                            const newBanners = [...formData.banners];
                            newBanners[idx].position = e.target.value as any;
                            setFormData({ ...formData, banners: newBanners });
                          }}
                          className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-white"
                        >
                          <option value="after_hero">بعد از هیرو (Position #1)</option>
                          <option value="after_categories">بعد از دسته‌بندی‌ها (Position #2)</option>
                          <option value="between_prompts">بین بخش پرامپت‌ها (Position #3)</option>
                          <option value="before_newsletter">قبل از خبرنامه (Position #4)</option>
                          <option value="before_footer">قبل از فوتر (Position #5)</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-slate-400">تصویر دسکتاپ (Image URL)</label>
                        <input
                          type="text"
                          value={banner.desktopImage}
                          onChange={(e) => {
                            const newBanners = [...formData.banners];
                            newBanners[idx].desktopImage = e.target.value;
                            setFormData({ ...formData, banners: newBanners });
                          }}
                          className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: THEME OPTIONS & CUSTOM FONTS UPLOAD */}
          {activeTab === 'theme_options' && (
            <div className="space-y-6">
              {/* Custom Font Upload & Global Typography Settings */}
              <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-5">
                <div className="border-b border-[#202C42] pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D97757]" />
                      <span>مدیریت و آپلود فونت‌های کل قالب (Font Upload & Global Typography)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      آپلود فایل فونت در ۳ وزن (Regular, Medium, Bold) و قابلیت فعال/غیرفعال‌سازی فونت سفارشی
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const currentTypo = formData.themeOptions.typography || {
                        persianFontFamily: 'Vazirmatn',
                        englishFontFamily: 'Plus Jakarta Sans',
                        enabled: true,
                      };
                      setFormData({
                        ...formData,
                        themeOptions: {
                          ...formData.themeOptions,
                          typography: {
                            ...currentTypo,
                            enabled: currentTypo.enabled === false ? true : false,
                          },
                        },
                      });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      formData.themeOptions.typography?.enabled !== false
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {formData.themeOptions.typography?.enabled !== false ? 'فونت سفارشی: فعال' : 'فونت سفارشی: غیرفعال'}
                  </button>
                </div>

                {/* Font Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Persian Font Upload Box */}
                  <div className="bg-[#0B0E17] p-4 rounded-xl border border-[#222E45] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#1C263B] pb-2">
                      <span className="text-xs font-bold text-[#D97757]">🇮🇷 فونت فارسی اصلی سایت</span>
                      <span className="text-[10px] text-slate-400 font-mono">Persian Font</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">انتخاب خانواده فونت فارسی</label>
                      <select
                        value={formData.themeOptions.typography?.persianFontFamily || 'Vazirmatn'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            themeOptions: {
                              ...formData.themeOptions,
                              typography: {
                                ...(formData.themeOptions.typography || {
                                  persianFontFamily: 'Vazirmatn',
                                  englishFontFamily: 'Plus Jakarta Sans',
                                  enabled: true,
                                }),
                                persianFontFamily: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full bg-[#121824] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-[#D97757]"
                      >
                        <option value="Vazirmatn">وزیرمتن (Vazirmatn) - استاندارد وب</option>
                        <option value="YekanBakh">یکان بخ (Yekan Bakh)</option>
                        <option value="IRANSans">ایران سنس (IRANSans)</option>
                        <option value="Shabnam">شبنم (Shabnam)</option>
                        <option value="Dana">دانا (Dana)</option>
                        <option value="Custom">فونت سفارشی (آپلود فایل WOFF2/TTF)</option>
                      </select>
                    </div>

                    {/* 3 Sizes/Weights Upload for Persian Font */}
                    <div className="space-y-3 pt-1 border-t border-[#1C263B]">
                      <span className="text-[11px] font-bold text-slate-300 block">آپلود در ۳ وزن مختلف:</span>

                      {/* Weight 1: Regular (400) */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">۱. وزن عادی (Regular - 400)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={formData.themeOptions.typography?.persianFontRegularUrl || formData.themeOptions.typography?.persianFontUrl || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeOptions: {
                                  ...formData.themeOptions,
                                  typography: {
                                    ...(formData.themeOptions.typography || {
                                      persianFontFamily: 'Vazirmatn',
                                      englishFontFamily: 'Plus Jakarta Sans',
                                    }),
                                    persianFontRegularUrl: e.target.value,
                                    persianFontUrl: e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="لینک یا آپلود فایل Regular (.woff2 / .ttf)"
                            className="flex-1 bg-[#121824] border border-[#222E45] rounded-xl px-2.5 py-1.5 text-xs text-slate-200 ltr font-mono"
                          />
                          <label className="cursor-pointer px-2.5 py-1.5 rounded-xl bg-[#202B3F] hover:bg-[#D97757] text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0">
                            <Upload size={12} />
                            <span>فایل</span>
                            <input
                              type="file"
                              accept=".woff2,.woff,.ttf,.otf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const fileUrl = URL.createObjectURL(file);
                                  setFormData({
                                    ...formData,
                                    themeOptions: {
                                      ...formData.themeOptions,
                                      typography: {
                                        ...(formData.themeOptions.typography || {
                                          persianFontFamily: 'Custom',
                                          englishFontFamily: 'Plus Jakarta Sans',
                                        }),
                                        persianFontRegularUrl: fileUrl,
                                        persianFontUrl: fileUrl,
                                        persianFontFamily: 'Custom',
                                      },
                                    },
                                  });
                                  triggerActionNotice(`فونت فارسی عادی (Regular) انتخاب شد.`);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Weight 2: Medium (500) */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">۲. وزن متوسط (Medium - 500)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={formData.themeOptions.typography?.persianFontMediumUrl || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeOptions: {
                                  ...formData.themeOptions,
                                  typography: {
                                    ...(formData.themeOptions.typography || {
                                      persianFontFamily: 'Vazirmatn',
                                      englishFontFamily: 'Plus Jakarta Sans',
                                    }),
                                    persianFontMediumUrl: e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="لینک یا آپلود فایل Medium (.woff2 / .ttf)"
                            className="flex-1 bg-[#121824] border border-[#222E45] rounded-xl px-2.5 py-1.5 text-xs text-slate-200 ltr font-mono"
                          />
                          <label className="cursor-pointer px-2.5 py-1.5 rounded-xl bg-[#202B3F] hover:bg-[#D97757] text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0">
                            <Upload size={12} />
                            <span>فایل</span>
                            <input
                              type="file"
                              accept=".woff2,.woff,.ttf,.otf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const fileUrl = URL.createObjectURL(file);
                                  setFormData({
                                    ...formData,
                                    themeOptions: {
                                      ...formData.themeOptions,
                                      typography: {
                                        ...(formData.themeOptions.typography || {
                                          persianFontFamily: 'Custom',
                                          englishFontFamily: 'Plus Jakarta Sans',
                                        }),
                                        persianFontMediumUrl: fileUrl,
                                        persianFontFamily: 'Custom',
                                      },
                                    },
                                  });
                                  triggerActionNotice(`فونت فارسی متوسط (Medium) انتخاب شد.`);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Weight 3: Bold (700) */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">۳. وزن ضخیم (Bold - 700)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={formData.themeOptions.typography?.persianFontBoldUrl || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeOptions: {
                                  ...formData.themeOptions,
                                  typography: {
                                    ...(formData.themeOptions.typography || {
                                      persianFontFamily: 'Vazirmatn',
                                      englishFontFamily: 'Plus Jakarta Sans',
                                    }),
                                    persianFontBoldUrl: e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="لینک یا آپلود فایل Bold (.woff2 / .ttf)"
                            className="flex-1 bg-[#121824] border border-[#222E45] rounded-xl px-2.5 py-1.5 text-xs text-slate-200 ltr font-mono"
                          />
                          <label className="cursor-pointer px-2.5 py-1.5 rounded-xl bg-[#202B3F] hover:bg-[#D97757] text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0">
                            <Upload size={12} />
                            <span>فایل</span>
                            <input
                              type="file"
                              accept=".woff2,.woff,.ttf,.otf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const fileUrl = URL.createObjectURL(file);
                                  setFormData({
                                    ...formData,
                                    themeOptions: {
                                      ...formData.themeOptions,
                                      typography: {
                                        ...(formData.themeOptions.typography || {
                                          persianFontFamily: 'Custom',
                                          englishFontFamily: 'Plus Jakarta Sans',
                                        }),
                                        persianFontBoldUrl: fileUrl,
                                        persianFontFamily: 'Custom',
                                      },
                                    },
                                  });
                                  triggerActionNotice(`فونت فارسی ضخیم (Bold) انتخاب شد.`);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* English Font Upload Box */}
                  <div className="bg-[#0B0E17] p-4 rounded-xl border border-[#222E45] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#1C263B] pb-2">
                      <span className="text-xs font-bold text-[#D97757]">🇬🇧 فونت انگلیسی و اعداد لاتین</span>
                      <span className="text-[10px] text-slate-400 font-mono">English Font</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">انتخاب خانواده فونت انگلیسی</label>
                      <select
                        value={formData.themeOptions.typography?.englishFontFamily || 'Plus Jakarta Sans'}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            themeOptions: {
                              ...formData.themeOptions,
                              typography: {
                                ...(formData.themeOptions.typography || {
                                  persianFontFamily: 'Vazirmatn',
                                  englishFontFamily: 'Plus Jakarta Sans',
                                  enabled: true,
                                }),
                                englishFontFamily: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-full bg-[#121824] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-[#D97757]"
                      >
                        <option value="Plus Jakarta Sans">Plus Jakarta Sans (مدرن و خوانا)</option>
                        <option value="Inter">Inter (محبوب وب)</option>
                        <option value="Outfit">Outfit (خلاقانه)</option>
                        <option value="Roboto">Roboto (کلاسیک)</option>
                        <option value="Custom">فونت انگلیسی سفارشی (آپلود WOFF2)</option>
                      </select>
                    </div>

                    {/* 3 Sizes/Weights Upload for English Font */}
                    <div className="space-y-3 pt-1 border-t border-[#1C263B]">
                      <span className="text-[11px] font-bold text-slate-300 block">آپلود در ۳ وزن مختلف:</span>

                      {/* Weight 1: Regular (400) */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">۱. وزن عادی (Regular - 400)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={formData.themeOptions.typography?.englishFontRegularUrl || formData.themeOptions.typography?.englishFontUrl || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeOptions: {
                                  ...formData.themeOptions,
                                  typography: {
                                    ...(formData.themeOptions.typography || {
                                      persianFontFamily: 'Vazirmatn',
                                      englishFontFamily: 'Plus Jakarta Sans',
                                    }),
                                    englishFontRegularUrl: e.target.value,
                                    englishFontUrl: e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="لینک یا آپلود فایل Regular (.woff2 / .ttf)"
                            className="flex-1 bg-[#121824] border border-[#222E45] rounded-xl px-2.5 py-1.5 text-xs text-slate-200 ltr font-mono"
                          />
                          <label className="cursor-pointer px-2.5 py-1.5 rounded-xl bg-[#202B3F] hover:bg-[#D97757] text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0">
                            <Upload size={12} />
                            <span>فایل</span>
                            <input
                              type="file"
                              accept=".woff2,.woff,.ttf,.otf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const fileUrl = URL.createObjectURL(file);
                                  setFormData({
                                    ...formData,
                                    themeOptions: {
                                      ...formData.themeOptions,
                                      typography: {
                                        ...(formData.themeOptions.typography || {
                                          persianFontFamily: 'Vazirmatn',
                                          englishFontFamily: 'Custom',
                                        }),
                                        englishFontRegularUrl: fileUrl,
                                        englishFontUrl: fileUrl,
                                        englishFontFamily: 'Custom',
                                      },
                                    },
                                  });
                                  triggerActionNotice(`فونت انگلیسی عادی (Regular) انتخاب شد.`);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Weight 2: Medium (500) */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">۲. وزن متوسط (Medium - 500)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={formData.themeOptions.typography?.englishFontMediumUrl || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeOptions: {
                                  ...formData.themeOptions,
                                  typography: {
                                    ...(formData.themeOptions.typography || {
                                      persianFontFamily: 'Vazirmatn',
                                      englishFontFamily: 'Plus Jakarta Sans',
                                    }),
                                    englishFontMediumUrl: e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="لینک یا آپلود فایل Medium (.woff2 / .ttf)"
                            className="flex-1 bg-[#121824] border border-[#222E45] rounded-xl px-2.5 py-1.5 text-xs text-slate-200 ltr font-mono"
                          />
                          <label className="cursor-pointer px-2.5 py-1.5 rounded-xl bg-[#202B3F] hover:bg-[#D97757] text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0">
                            <Upload size={12} />
                            <span>فایل</span>
                            <input
                              type="file"
                              accept=".woff2,.woff,.ttf,.otf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const fileUrl = URL.createObjectURL(file);
                                  setFormData({
                                    ...formData,
                                    themeOptions: {
                                      ...formData.themeOptions,
                                      typography: {
                                        ...(formData.themeOptions.typography || {
                                          persianFontFamily: 'Vazirmatn',
                                          englishFontFamily: 'Custom',
                                        }),
                                        englishFontMediumUrl: fileUrl,
                                        englishFontFamily: 'Custom',
                                      },
                                    },
                                  });
                                  triggerActionNotice(`فونت انگلیسی متوسط (Medium) انتخاب شد.`);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      {/* Weight 3: Bold (700) */}
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">۳. وزن ضخیم (Bold - 700)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={formData.themeOptions.typography?.englishFontBoldUrl || ''}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                themeOptions: {
                                  ...formData.themeOptions,
                                  typography: {
                                    ...(formData.themeOptions.typography || {
                                      persianFontFamily: 'Vazirmatn',
                                      englishFontFamily: 'Plus Jakarta Sans',
                                    }),
                                    englishFontBoldUrl: e.target.value,
                                  },
                                },
                              })
                            }
                            placeholder="لینک یا آپلود فایل Bold (.woff2 / .ttf)"
                            className="flex-1 bg-[#121824] border border-[#222E45] rounded-xl px-2.5 py-1.5 text-xs text-slate-200 ltr font-mono"
                          />
                          <label className="cursor-pointer px-2.5 py-1.5 rounded-xl bg-[#202B3F] hover:bg-[#D97757] text-white text-xs font-bold transition-colors flex items-center gap-1 shrink-0">
                            <Upload size={12} />
                            <span>فایل</span>
                            <input
                              type="file"
                              accept=".woff2,.woff,.ttf,.otf"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const fileUrl = URL.createObjectURL(file);
                                  setFormData({
                                    ...formData,
                                    themeOptions: {
                                      ...formData.themeOptions,
                                      typography: {
                                        ...(formData.themeOptions.typography || {
                                          persianFontFamily: 'Vazirmatn',
                                          englishFontFamily: 'Custom',
                                        }),
                                        englishFontBoldUrl: fileUrl,
                                        englishFontFamily: 'Custom',
                                      },
                                    },
                                  });
                                  triggerActionNotice(`فونت انگلیسی ضخیم (Bold) انتخاب شد.`);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dynamic Font Preview Box */}
                <div className="bg-[#0B0E17] p-4 rounded-xl border border-[#222E45] space-y-2">
                  <span className="text-xs font-bold text-[#D97757] block">👁️ پیش‌نمایش زنده فونت‌های تنظیم شده:</span>
                  <div className="p-3 bg-[#121824] rounded-lg border border-[#1C263B] space-y-1">
                    <p className="text-sm font-bold text-white">
                      پیش‌نمایش فارسی ({formData.themeOptions.typography?.persianFontFamily || 'Vazirmatn'}): پرامپت‌جو مرجع هوش مصنوعی و پرامپت‌های خروجی محور
                    </p>
                    <p className="text-xs text-slate-400 ltr font-mono">
                      English Preview ({formData.themeOptions.typography?.englishFontFamily || 'Plus Jakarta Sans'}): PromptJo AI Marketplace 2026 - 1234567890
                    </p>
                  </div>
                </div>
              </div>

              {/* Theme Options Box */}
              <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-[#202C42] pb-2 flex items-center gap-2">
                  <Palette size={16} className="text-[#D97757]" />
                  تنظیمات ظاهری و استایل قالب (Theme Options)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">عرض کانتینر اصلی</label>
                    <input
                      type="text"
                      value={formData.themeOptions.containerWidth}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          themeOptions: { ...formData.themeOptions, containerWidth: e.target.value },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">شعاع انحنای گردی کارت‌ها (Border Radius)</label>
                    <input
                      type="text"
                      value={formData.themeOptions.borderRadius}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          themeOptions: { ...formData.themeOptions, borderRadius: e.target.value },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">سرعت انیمیشن‌ها</label>
                    <select
                      value={formData.themeOptions.animationSpeed}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          themeOptions: { ...formData.themeOptions, animationSpeed: e.target.value as any },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="fast">سریع (Fast)</option>
                      <option value="normal">عادی (Normal)</option>
                      <option value="slow">آهسته (Slow)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">فاصله کارت‌ها (Card Gap)</label>
                    <input
                      type="text"
                      value={formData.themeOptions.cardGap}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          themeOptions: { ...formData.themeOptions, cardGap: e.target.value },
                        })
                      }
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Default SEO Settings Box */}
              <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
                <h3 className="text-sm font-bold text-white border-b border-[#202C42] pb-2 flex items-center gap-2">
                  <Search size={16} className="text-[#D97757]" />
                  تنظیمات SEO پیش‌فرض (Default SEO Settings)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">عنوان متا (Meta Title)</label>
                    <input
                      type="text"
                      value={formData.globalSettings.seo.metaTitle}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          globalSettings: {
                            ...formData.globalSettings,
                            seo: {
                              ...formData.globalSettings.seo,
                              metaTitle: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="پرامپتجو - بزرگترین مارکتپلیس پرامپتهای هوش مصنوعی"
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D97757]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">توضیحات متا (Meta Description)</label>
                    <textarea
                      rows={3}
                      value={formData.globalSettings.seo.metaDescription}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          globalSettings: {
                            ...formData.globalSettings,
                            seo: {
                              ...formData.globalSettings.seo,
                              metaDescription: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="دانلود و اشتراکگذاری پرامپتهای حرفهای ChatGPT, Midjourney, Claude و DALL-E"
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D97757]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">کلمات کلیدی (Keywords)</label>
                    <input
                      type="text"
                      value={formData.globalSettings.seo.keywords}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          globalSettings: {
                            ...formData.globalSettings,
                            seo: {
                              ...formData.globalSettings.seo,
                              keywords: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="پرامپت, هوش مصنوعی, چت جی پی تی, میدجرنی, Prompt, AI"
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D97757]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: DEVELOPER SETTINGS & SYSTEM DIAGNOSTICS */}
          {activeTab === 'developer_settings' && (
            <div className="space-y-6">
              <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
                <div className="flex items-center justify-between border-b border-[#202C42] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Wrench size={18} className="text-[#D97757]" />
                      پنل تنظیمات توسعه‌دهندگان و عیب‌یابی (Developer Diagnostics Panel)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      کنترل‌های سطح سرور، عیب‌یابی کدهای هوک، پاکسازی Transientها و اطلاعات سیستم
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportDebugLog}
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1A2438] border border-[#2B3A58] text-xs font-semibold text-slate-200 hover:text-white hover:bg-[#222E46]"
                  >
                    <Download size={14} />
                    <span>خروجی لاگ دیباگ (.txt)</span>
                  </button>
                </div>

                {/* Developer Toggles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#0B0E17] p-4 rounded-xl border border-[#222E45] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">حالت دیباگ (Debug Mode)</span>
                      <span className="text-[10px] text-slate-400">نمایش پیام‌های خطای وردپرس</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          developerSettings: {
                            ...formData.developerSettings,
                            debugMode: !formData.developerSettings.debugMode,
                          },
                        })
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        formData.developerSettings.debugMode
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-[#182133] text-slate-400'
                      }`}
                    >
                      {formData.developerSettings.debugMode ? 'فعال' : 'غیرفعال'}
                    </button>
                  </div>

                  <div className="bg-[#0B0E17] p-4 rounded-xl border border-[#222E45] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">غیرفعال‌سازی کش</span>
                      <span className="text-[10px] text-slate-400">جلوگیری از کش استایل‌ها</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          developerSettings: {
                            ...formData.developerSettings,
                            disableCache: !formData.developerSettings.disableCache,
                          },
                        })
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        formData.developerSettings.disableCache
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          : 'bg-[#182133] text-slate-400'
                      }`}
                    >
                      {formData.developerSettings.disableCache ? 'فعال' : 'غیرفعال'}
                    </button>
                  </div>

                  <div className="bg-[#0B0E17] p-4 rounded-xl border border-[#222E45] flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-white block">غیرفعال‌سازی انیمیشن‌ها</span>
                      <span className="text-[10px] text-slate-400">برای تست سرعت بارگذاری</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          developerSettings: {
                            ...formData.developerSettings,
                            disableAnimations: !formData.developerSettings.disableAnimations,
                          },
                        })
                      }
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        formData.developerSettings.disableAnimations
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-[#182133] text-slate-400'
                      }`}
                    >
                      {formData.developerSettings.disableAnimations ? 'فعال' : 'غیرفعال'}
                    </button>
                  </div>
                </div>

                {/* Quick Developer Actions */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => triggerActionNotice('فایل CSS پویا با موفقیت بازسازی شد.')}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#172033] border border-[#283754] text-xs font-bold text-slate-200 hover:text-white hover:bg-[#1E2C48]"
                  >
                    <RefreshCw size={14} className="text-[#D97757]" />
                    <span>بازسازی CSS پویا</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerActionNotice('قواعد بازنویسی پیوندهای یکتا تخلیه شدند.')}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#172033] border border-[#283754] text-xs font-bold text-slate-200 hover:text-white hover:bg-[#1E2C48]"
                  >
                    <Database size={14} className="text-emerald-400" />
                    <span>Flush Rewrite Rules</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerActionNotice('تمامی داده‌های موقت و Transient پاکسازی شدند.')}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#172033] border border-[#283754] text-xs font-bold text-slate-200 hover:text-white hover:bg-[#1E2C48]"
                  >
                    <Trash2 size={14} className="text-amber-400" />
                    <span>Clear Transients</span>
                  </button>
                </div>

                {/* System Information Table */}
                <div className="bg-[#0B0E17] p-4 rounded-xl border border-[#222E45] space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 border-b border-[#1C263B] pb-2 flex items-center gap-2">
                    <Cpu size={14} className="text-[#D97757]" />
                    اطلاعات سیستم و سرور (System & Environment Info)
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    <div className="bg-[#121824] p-2.5 rounded-lg border border-[#1E273A]">
                      <span className="text-[10px] text-slate-400 block">نسخه PHP</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{formData.developerSettings.systemInfo.phpVersion}</span>
                    </div>
                    <div className="bg-[#121824] p-2.5 rounded-lg border border-[#1E273A]">
                      <span className="text-[10px] text-slate-400 block">نسخه وردپرس</span>
                      <span className="text-xs font-mono font-bold text-blue-400">{formData.developerSettings.systemInfo.wpVersion}</span>
                    </div>
                    <div className="bg-[#121824] p-2.5 rounded-lg border border-[#1E273A]">
                      <span className="text-[10px] text-slate-400 block">نسخه قالب</span>
                      <span className="text-xs font-mono font-bold text-[#D97757]">{formData.developerSettings.systemInfo.themeVersion}</span>
                    </div>
                    <div className="bg-[#121824] p-2.5 rounded-lg border border-[#1E273A]">
                      <span className="text-[10px] text-slate-400 block">Memory Limit</span>
                      <span className="text-xs font-mono font-bold text-purple-400">{formData.developerSettings.systemInfo.memoryLimit}</span>
                    </div>
                    <div className="bg-[#121824] p-2.5 rounded-lg border border-[#1E273A]">
                      <span className="text-[10px] text-slate-400 block">Max Execution</span>
                      <span className="text-xs font-mono font-bold text-amber-400">{formData.developerSettings.systemInfo.maxExecutionTime}s</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: IMPORT / EXPORT / SECTION RESETS */}
          {activeTab === 'import_export_reset' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Export & Import */}
                <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-[#202C42] pb-2 flex items-center gap-2">
                    <Download size={16} className="text-[#D97757]" />
                    ورود و خروج تنظیمات (Import / Export JSON)
                  </h3>

                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D97757] text-white text-xs font-bold shadow-glow-sm hover:brightness-110"
                  >
                    <Download size={16} />
                    <span>دانلود فایل پشتیبان کامل JSON</span>
                  </button>

                  <div className="pt-2 border-t border-[#202C42] space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">بازیابی از فایل JSON (Import Settings)</label>
                    <textarea
                      rows={4}
                      value={importJsonText}
                      onChange={(e) => setImportJsonText(e.target.value)}
                      placeholder="محتوای فایل JSON را اینجا پیست کنید..."
                      className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl p-3 text-xs text-white font-mono"
                    />
                    {importStatus && (
                      <p className={`text-xs font-bold ${importStatus.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {importStatus.message}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={handleImportJson}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#1A2336] text-slate-200 hover:text-white text-xs font-bold"
                    >
                      <Upload size={14} />
                      <span>اعمال و فراخوانی JSON</span>
                    </button>
                  </div>
                </div>

                {/* Section Resets */}
                <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
                  <h3 className="text-sm font-bold text-white border-b border-[#202C42] pb-2 flex items-center gap-2">
                    <RotateCcw size={16} className="text-rose-400" />
                    بازنشانی بخش‌ها (Reset Individual Sections)
                  </h3>
                  <p className="text-xs text-slate-400">بازگردانی هر بخش به حالت کارخانه بدون تغییر سایر بخش‌ها</p>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {[
                      { id: 'global', label: 'ریست تنظیمات عمومی' },
                      { id: 'theme', label: 'ریست تنظیمات قالب' },
                      { id: 'sectionSettings', label: 'ریست تنظیمات بخش‌ها' },
                      { id: 'developer', label: 'ریست پنل توسعه‌دهندگان' },
                      { id: 'hero', label: 'ریست هیرو و آمارها' },
                      { id: 'categories', label: 'ریست کارت‌های دسته‌بندی' },
                      { id: 'newsletter', label: 'ریست بخش خبرنامه' },
                      { id: 'footer', label: 'ریست فوتر' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => resetSection(item.id)}
                        className="px-3 py-2 rounded-xl bg-[#0B0E17] border border-[#222E45] text-slate-300 hover:text-white hover:border-rose-500/50 text-xs font-semibold text-right transition-all"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#202C42]">
                    <button
                      type="button"
                      onClick={() => resetSection('all')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-bold"
                    >
                      <RotateCcw size={14} />
                      <span>بازنشانی کامل به تنظیمات اولیه کارخانه (Factory Reset All)</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 10: PROMPTS CPT INFO */}
          {activeTab === 'prompts' && (
            <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-[#202C42] pb-2">مدیریت پرامپت‌ها (Custom Post Type 'prompt')</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                در وردپرس واقعی، تمامی این کارت‌ها از Custom Post Type به نام <code className="text-[#D97757]">prompt</code> و تاکسونومی <code className="text-[#D97757]">prompt_category</code> به صورت خودکار کوئری گرفته می‌شوند.
              </p>
            </div>
          )}

          {/* TAB 11: HEADER */}
          {activeTab === 'header' && (
            <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-[#202C42] pb-2">تنظیمات هدر و منو</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300">متن لوگو بخش اول</label>
                  <input
                    type="text"
                    value={formData.header.logoTextPrimary}
                    onChange={(e) => setFormData({ ...formData, header: { ...formData.header, logoTextPrimary: e.target.value } })}
                    className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300">متن لوگو بخش دوم</label>
                  <input
                    type="text"
                    value={formData.header.logoTextSecondary}
                    onChange={(e) => setFormData({ ...formData, header: { ...formData.header, logoTextSecondary: e.target.value } })}
                    className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 12: FOOTER */}
          {activeTab === 'footer' && (
            <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-[#202C42] pb-2">تنظیمات فوتر</h3>
              <div>
                <label className="text-xs text-slate-300">متن کپی‌رایت</label>
                <input
                  type="text"
                  value={formData.footer.copyrightText}
                  onChange={(e) => setFormData({ ...formData, footer: { ...formData.footer, copyrightText: e.target.value } })}
                  className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>
          )}

          {/* TAB: VERSION CONTROL & PAGE LOCKS */}
          {activeTab === 'version_control' && (
            <div className="space-y-6">
              {/* Rules banner */}
              <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <ShieldAlert size={18} />
                  <span>قوانین پنج‌گانه استودیو و معماری PromptJo Studio (Architecture Rules)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs text-slate-300 pt-1">
                  <div className="bg-[#0B0E17]/60 p-3 rounded-xl border border-amber-500/20">
                    <span className="block font-bold text-amber-300 mb-1">قانون ۱: Isolation</span>
                    صفحه Home ثبت و قفل است (v1.0). هیچ صفحه‌ای حق تغییر کدهای صفحه اصلی را ندارد.
                  </div>
                  <div className="bg-[#0B0E17]/60 p-3 rounded-xl border border-amber-500/20">
                    <span className="block font-bold text-amber-300 mb-1">قانون ۲: WP Source</span>
                    خروجی واقعی وردپرس در فایل‌های theme اولویت شماره ۱ و مرجع مطلق نهایی است.
                  </div>
                  <div className="bg-[#0B0E17]/60 p-3 rounded-xl border border-amber-500/20">
                    <span className="block font-bold text-amber-300 mb-1">قانون ۳: Core Layer</span>
                    بخش‌های مشترک مانند header, footer, colors در لایه core ایزوله می‌باشند.
                  </div>
                  <div className="bg-[#0B0E17]/60 p-3 rounded-xl border border-amber-500/20">
                    <span className="block font-bold text-amber-300 mb-1">قانون ۴: Dependencies</span>
                    هیچ صفحه‌ای نباید به صفحه دیگر وابسته باشد. ارث‌بری فقط از core/* آزاد است.
                  </div>
                  <div className="bg-[#0B0E17]/60 p-3 rounded-xl border border-amber-500/20">
                    <span className="block font-bold text-amber-300 mb-1">قانون ۵: Protection</span>
                    خروجی صفحات جدید هرگز نباید فایل‌های قفل‌شده قبلی (front-page.php) را دستکاری کند.
                  </div>
                </div>
                <div className="pt-2 border-t border-amber-500/20 text-xs text-amber-300/90 font-mono flex flex-wrap items-center justify-between gap-2">
                  <span>🚦 چرخه توسعه اجباری هر صفحه: 📝 Draft ➔ 🧪 Testing ➔ ✅ Published (نسخه پایدار با قابلیت Rollback)</span>
                  <span className="text-[11px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-200">فایل ذخیره‌سازی: config/version-control.json</span>
                </div>
              </div>

              {/* Version Control Matrix Table */}
              <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
                <div className="flex items-center justify-between border-b border-[#202C42] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>ماتریس وضعیت و قفل صفحات (Page Version & Lock Matrix)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      ذخیره‌شده در هر دو فایل <code className="text-amber-400 font-mono">config/version-control.json</code> و <code className="text-amber-400 font-mono">wp_options</code>
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
                    Home Status: PUBLISHED ✅ v1.0
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-[#0B0E17] text-slate-400 border-b border-[#202C42]">
                        <th className="p-3">نام صفحه</th>
                        <th className="p-3">نسخه (Version)</th>
                        <th className="p-3">وضعیت (Status)</th>
                        <th className="p-3">قفل تغییرات</th>
                        <th className="p-3">تاریخ خروجی</th>
                        <th className="p-3">توضیحات معماری</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1D273A] text-slate-200">
                      {[
                        {
                          name: 'صفحه اصلی (Home Page)',
                          version: 'v1.0',
                          status: 'Published',
                          locked: true,
                          exportDate: '2026-08-01',
                          desc: 'ثبت و منتشرشده (LOCKED). غیرقابل دستکاری توسط صفحات دیگر.',
                        },
                        {
                          name: 'تکی پرامپت (Single Prompt)',
                          version: 'v1.0',
                          status: 'Published',
                          locked: true,
                          exportDate: '2026-08-01',
                          desc: 'نمایش کامل پرامپت با دکمه کپی و متغیرها (LOCKED).',
                        },
                        {
                          name: 'آرشیو موضوعات (Categories)',
                          version: 'v1.0',
                          status: 'Published',
                          locked: true,
                          exportDate: '2026-08-01',
                          desc: 'شبکه دسته بندی ها و موضوعات هوش مصنوعی (LOCKED).',
                        },
                        {
                          name: 'صفحه کاوش (Explore Page)',
                          version: 'v0.8',
                          status: 'Testing',
                          locked: false,
                          exportDate: 'در حال تست',
                          desc: 'فیلترها و نمایش پیشرفته پرامپت‌ها.',
                        },
                        {
                          name: 'آکادمی (Academy Page)',
                          version: 'v0.1',
                          status: 'Draft',
                          locked: false,
                          exportDate: 'پیش‌نویس اولیه',
                          desc: 'بخش دوره‌های آموزشی و ویدیوها.',
                        },
                        {
                          name: 'تکی آکادمی (Single Academy)',
                          version: 'v0.1',
                          status: 'Draft',
                          locked: false,
                          exportDate: 'پیش‌نویس اولیه',
                          desc: 'صفحه پخش دوره یا درس آموزشی.',
                        },
                        {
                          name: 'مجله خبری (Magazine)',
                          version: 'v0.1',
                          status: 'Pending',
                          locked: false,
                          exportDate: 'در انتظار',
                          desc: 'اخبار و مقالات هوش مصنوعی.',
                        },
                        {
                          name: 'تکی مجله (Single Magazine)',
                          version: 'v0.1',
                          status: 'Pending',
                          locked: false,
                          exportDate: 'در انتظار',
                          desc: 'صفحه مطالعه مقاله خبری.',
                        },
                      ].map((pg, i) => (
                        <tr key={i} className="hover:bg-[#182133]/50 transition-colors">
                          <td className="p-3 font-bold text-white">{pg.name}</td>
                          <td className="p-3 font-mono text-[#D97757] font-bold">{pg.version}</td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                pg.status === 'Published' || pg.status === 'Locked'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : pg.status === 'Testing'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                  : pg.status === 'Draft'
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                  : 'bg-slate-500/10 text-slate-400 border border-slate-500/30'
                              }`}
                            >
                              {(pg.status === 'Published' || pg.status === 'Locked') && '✅ Published'}
                              {pg.status === 'Testing' && '🧪 Testing'}
                              {pg.status === 'Draft' && '📝 Draft'}
                              {pg.status === 'Pending' && '⏳ Pending'}
                            </span>
                          </td>
                          <td className="p-3 font-bold">
                            {pg.locked ? (
                              <span className="text-emerald-400 flex items-center gap-1">🔒 قفل شده</span>
                            ) : (
                              <span className="text-slate-400 flex items-center gap-1">🔓 باز</span>
                            )}
                          </td>
                          <td className="p-3 font-mono text-slate-400">{pg.exportDate}</td>
                          <td className="p-3 text-slate-400 text-[11px]">{pg.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FEATURE TOGGLES */}
          {activeTab === 'feature_toggles' && (
            <div className="space-y-6">
              <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
                <div className="flex items-center justify-between border-b border-[#202C42] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sliders size={18} className="text-[#D97757]" />
                      <span>مدیریت قابلیت‌ها و فیچرفلگ‌ها (Feature Toggles)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      تنظیم وضعیت سه‌گانه برای کنترل قابلیت‌های لایه UI، دیتابیس و کدهای بک‌اند
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
                    ذخیره خودکار در config/feature-toggles.json
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#0B0E17] p-3 rounded-xl border border-emerald-500/30 text-emerald-300">
                    <span className="font-bold block mb-1">✅ Enabled (فعال)</span>
                    کاملاً در UI، منوها و بک‌اند فعال و در دسترس کاربران است.
                  </div>
                  <div className="bg-[#0B0E17] p-3 rounded-xl border border-amber-500/30 text-amber-300">
                    <span className="font-bold block mb-1">👁️‍🗨️ Hidden (مخفی / آماده)</span>
                    معمارها و کدهای دیتابیس آماده است، اما فعلاً در UI مخفی نگه داشته می‌شود.
                  </div>
                  <div className="bg-[#0B0E17] p-3 rounded-xl border border-rose-500/30 text-rose-300">
                    <span className="font-bold block mb-1">❌ Disabled (خاموش)</span>
                    قابلیت کاملاً غیرفعال و خاموش است.
                  </div>
                </div>

                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="bg-[#0B0E17] text-slate-400 border-b border-[#202C42]">
                        <th className="p-3">عنوان قابلیت</th>
                        <th className="p-3">دسته‌بندی</th>
                        <th className="p-3">وضعیت سه‌گانه (Toggle)</th>
                        <th className="p-3">توضیحات و رفتار فنی</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1D273A] text-slate-200">
                      {featureFlags.map((feat, idx) => (
                        <tr key={feat.id} className="hover:bg-[#182133]/50 transition-colors">
                          <td className="p-3 font-bold text-white">{feat.title}</td>
                          <td className="p-3 text-slate-400 font-mono text-[11px]">
                            <span className="bg-[#0B0E17] px-2 py-0.5 rounded border border-[#222E45]">
                              {feat.category}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const newFlags = [...featureFlags];
                                  newFlags[idx].status = 'Enabled';
                                  setFeatureFlags(newFlags);
                                  triggerActionNotice(`وضعیت ${feat.title} به Enabled تغییر یافت.`);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                  feat.status === 'Enabled'
                                    ? 'bg-emerald-500 text-slate-950 font-black shadow-glow-sm'
                                    : 'bg-[#0B0E17] text-slate-400 hover:text-white border border-[#222E45]'
                                }`}
                              >
                                ✅ Enabled
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const newFlags = [...featureFlags];
                                  newFlags[idx].status = 'Hidden';
                                  setFeatureFlags(newFlags);
                                  triggerActionNotice(`وضعیت ${feat.title} به Hidden (مخفی) تغییر یافت.`);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                  feat.status === 'Hidden'
                                    ? 'bg-amber-500 text-slate-950 font-black shadow-glow-sm'
                                    : 'bg-[#0B0E17] text-slate-400 hover:text-white border border-[#222E45]'
                                }`}
                              >
                                👁️‍🗨️ Hidden
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const newFlags = [...featureFlags];
                                  newFlags[idx].status = 'Disabled';
                                  setFeatureFlags(newFlags);
                                  triggerActionNotice(`وضعیت ${feat.title} به Disabled تغییر یافت.`);
                                }}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                  feat.status === 'Disabled'
                                    ? 'bg-rose-500 text-white font-black shadow-glow-sm'
                                    : 'bg-[#0B0E17] text-slate-400 hover:text-white border border-[#222E45]'
                                }`}
                              >
                                ❌ Disabled
                              </button>
                            </div>
                          </td>
                          <td className="p-3 text-slate-400 text-[11px]">{feat.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PAGE LAYOUT MANAGER */}
          {activeTab === 'layout_manager' && (
            <div className="space-y-6">
              <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-5">
                <div className="flex items-center justify-between border-b border-[#202C42] pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Layers size={18} className="text-[#D97757]" />
                      <span>مدیریت چیدمان صفحات (Page Layout Manager & Builder)</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      کنترل کامل ترتیب نمایش، پریست‌ها، قفل سطح سکشن و ورود/خروج کدهای چیدمان
                    </p>
                  </div>
                  <span className="text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full font-bold">
                    ذخیره خودکار در config/page-layouts.json
                  </span>
                </div>

                {/* Page Switcher */}
                <div className="flex items-center justify-between border-b border-[#202C42] pb-3 text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveLayoutPage('explore')}
                      className={`px-4 py-2 rounded-xl transition-all ${
                        activeLayoutPage === 'explore'
                          ? 'bg-amber-500 text-slate-950 font-black shadow-glow-sm'
                          : 'bg-[#0B0E17] text-slate-400 hover:text-white border border-[#222E45]'
                      }`}
                    >
                      🔎 صفحه کاوش (Explore)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLayoutPage('home')}
                      className={`px-4 py-2 rounded-xl transition-all ${
                        activeLayoutPage === 'home'
                          ? 'bg-amber-500 text-slate-950 font-black shadow-glow-sm'
                          : 'bg-[#0B0E17] text-slate-400 hover:text-white border border-[#222E45]'
                      }`}
                    >
                      🏠 صفحه اصلی (Home)
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (activeLayoutPage === 'explore') {
                        setLayoutSections({
                          ...layoutSections,
                          explore: [
                            { id: 'hero', label: 'Hero Section (بخش هدر و معرفی کاوش)', status: 'enabled', order: 1, file: 'template-parts/explore/hero.php', removable: false, locked: true },
                            { id: 'active_filters', label: 'Active Filters (نوار فیلترهای فعال)', status: 'enabled', order: 2, file: 'template-parts/explore/active-filters.php', removable: true, locked: false },
                            { id: 'filters_sidebar', label: 'Sidebar Filters (سایدبار فیلترهای پیشرفته)', status: 'enabled', order: 3, file: 'template-parts/explore/filters.php', removable: true, locked: false },
                            { id: 'grid', label: 'Prompts Grid (شبکه کارت‌های پرامپت)', status: 'enabled', order: 4, file: 'template-parts/explore/grid.php', removable: false, locked: false },
                            { id: 'pagination', label: 'Pagination (صفحه‌بندی)', status: 'enabled', order: 5, file: 'template-parts/explore/pagination.php', removable: true, locked: false },
                          ]
                        });
                      }
                      triggerActionNotice(`چیدمان صفحه ${activeLayoutPage} به حالت پیش‌فرض اولیه بازنشانی شد.`);
                    }}
                    className="text-rose-400 hover:text-rose-300 font-bold bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-lg text-xs transition-all"
                  >
                    🔄 بازنشانی چیدمان (Reset Layout)
                  </button>
                </div>

                {/* Explore Presets */}
                {activeLayoutPage === 'explore' && (
                  <div className="bg-[#0B0E17] p-3.5 rounded-xl border border-[#222E45] space-y-2 text-xs">
                    <span className="font-bold text-amber-400 block">🎨 پریست‌های سریع چیدمان صفحه کاوش (Explore Presets):</span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setLayoutSections({
                            ...layoutSections,
                            explore: [
                              { id: 'hero', label: 'Hero Section (بخش هدر و معرفی کاوش)', status: 'enabled', order: 1, file: 'template-parts/explore/hero.php', removable: false, locked: true },
                              { id: 'active_filters', label: 'Active Filters (نوار فیلترهای فعال)', status: 'enabled', order: 2, file: 'template-parts/explore/active-filters.php', removable: true, locked: false },
                              { id: 'filters_sidebar', label: 'Sidebar Filters (سایدبار فیلترهای پیشرفته)', status: 'enabled', order: 3, file: 'template-parts/explore/filters.php', removable: true, locked: false },
                              { id: 'grid', label: 'Prompts Grid (شبکه کارت‌های پرامپت)', status: 'enabled', order: 4, file: 'template-parts/explore/grid.php', removable: false, locked: false },
                              { id: 'pagination', label: 'Pagination (صفحه‌بندی)', status: 'enabled', order: 5, file: 'template-parts/explore/pagination.php', removable: true, locked: false },
                            ]
                          });
                          triggerActionNotice('پریست 🅰️ Default با موفقیت اعمال گردید.');
                        }}
                        className="bg-[#121928] hover:bg-[#1C283F] text-slate-200 border border-[#222E45] px-3 py-1.5 rounded-lg font-bold transition-all"
                      >
                        🅰️ Default Layout
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setLayoutSections({
                            ...layoutSections,
                            explore: [
                              { id: 'hero', label: 'Hero Section (بخش هدر و معرفی کاوش)', status: 'enabled', order: 1, file: 'template-parts/explore/hero.php', removable: false, locked: true },
                              { id: 'filters_sidebar', label: 'Sidebar Filters (سایدبار سمت راست)', status: 'enabled', order: 2, file: 'template-parts/explore/filters.php', removable: true, locked: false },
                              { id: 'active_filters', label: 'Active Filters (نوار فیلترهای فعال)', status: 'enabled', order: 3, file: 'template-parts/explore/active-filters.php', removable: true, locked: false },
                              { id: 'grid', label: 'Prompts Grid (شبکه کارت‌های پرامپت)', status: 'enabled', order: 4, file: 'template-parts/explore/grid.php', removable: false, locked: false },
                              { id: 'pagination', label: 'Pagination (صفحه‌بندی)', status: 'enabled', order: 5, file: 'template-parts/explore/pagination.php', removable: true, locked: false },
                            ]
                          });
                          triggerActionNotice('پریست 🅱️ Sidebar Right با موفقیت اعمال گردید.');
                        }}
                        className="bg-[#121928] hover:bg-[#1C283F] text-slate-200 border border-[#222E45] px-3 py-1.5 rounded-lg font-bold transition-all"
                      >
                        🅱️ Sidebar Right
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setLayoutSections({
                            ...layoutSections,
                            explore: [
                              { id: 'hero', label: 'Hero Section (بخش هدر و معرفی کاوش)', status: 'enabled', order: 1, file: 'template-parts/explore/hero.php', removable: false, locked: true },
                              { id: 'active_filters', label: 'Active Filters (نوار فیلترهای فعال)', status: 'enabled', order: 2, file: 'template-parts/explore/active-filters.php', removable: true, locked: false },
                              { id: 'filters_sidebar', label: 'Sidebar Filters (مخفی برای حالت تمام‌عرض)', status: 'hidden', order: 3, file: 'template-parts/explore/filters.php', removable: true, locked: false },
                              { id: 'grid', label: 'Prompts Grid (شبکه کارت‌های پرامپت ۴ ستونه)', status: 'enabled', order: 4, file: 'template-parts/explore/grid.php', removable: false, locked: false },
                              { id: 'pagination', label: 'Pagination (صفحه‌بندی)', status: 'enabled', order: 5, file: 'template-parts/explore/pagination.php', removable: true, locked: false },
                            ]
                          });
                          triggerActionNotice('پریست 🅲️ Full Width با موفقیت اعمال گردید.');
                        }}
                        className="bg-[#121928] hover:bg-[#1C283F] text-slate-200 border border-[#222E45] px-3 py-1.5 rounded-lg font-bold transition-all"
                      >
                        🅲️ Full Width
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setLayoutSections({
                            ...layoutSections,
                            explore: [
                              { id: 'hero', label: 'Hero Section (بخش هدر و معرفی کاوش)', status: 'enabled', order: 1, file: 'template-parts/explore/hero.php', removable: false, locked: true },
                              { id: 'grid', label: 'Prompts Grid (شبکه مجله‌ای پرامپت‌ها)', status: 'enabled', order: 2, file: 'template-parts/explore/grid.php', removable: false, locked: false },
                              { id: 'active_filters', label: 'Active Filters (نوار فیلترهای فعال)', status: 'enabled', order: 3, file: 'template-parts/explore/active-filters.php', removable: true, locked: false },
                              { id: 'filters_sidebar', label: 'Sidebar Filters (سایدبار فیلترهای پیشرفته)', status: 'hidden', order: 4, file: 'template-parts/explore/filters.php', removable: true, locked: false },
                              { id: 'pagination', label: 'Pagination (صفحه‌بندی)', status: 'enabled', order: 5, file: 'template-parts/explore/pagination.php', removable: true, locked: false },
                            ]
                          });
                          triggerActionNotice('پریست 🅳️ Magazine Style با موفقیت اعمال گردید.');
                        }}
                        className="bg-[#121928] hover:bg-[#1C283F] text-slate-200 border border-[#222E45] px-3 py-1.5 rounded-lg font-bold transition-all"
                      >
                        🅳️ Magazine Style
                      </button>
                    </div>
                  </div>
                )}

                {/* Sections List */}
                <div className="space-y-3 pt-2">
                  {layoutSections[activeLayoutPage].map((sec, idx) => {
                    const lockLevel = sec.lock_level || 'free';
                    const isHardLocked = lockLevel === 'hard_lock';
                    const isSoftLocked = lockLevel === 'soft_lock';

                    return (
                      <div
                        key={sec.id}
                        className={`flex flex-wrap items-center justify-between gap-3 bg-[#0B0E17] p-3.5 rounded-xl border transition-all ${
                          isHardLocked
                            ? 'border-rose-500/40 bg-[#190C11]'
                            : isSoftLocked
                            ? 'border-amber-500/40 bg-[#18130B]'
                            : 'border-[#222E45] hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Reorder Buttons (Disabled for Hard Lock) */}
                          <div className="flex flex-col gap-1 text-slate-500">
                            <button
                              type="button"
                              disabled={idx === 0 || isHardLocked}
                              onClick={() => {
                                if (idx === 0 || isHardLocked) return;
                                const currentList = [...layoutSections[activeLayoutPage]];
                                const temp = currentList[idx];
                                currentList[idx] = currentList[idx - 1];
                                currentList[idx - 1] = temp;
                                currentList.forEach((s, i) => (s.order = i + 1));
                                setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                                triggerActionNotice(`ترتیب سکشن ${sec.label} تغییر یافت.`);
                              }}
                              className="hover:text-amber-400 disabled:opacity-20 transition-colors"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              disabled={idx === layoutSections[activeLayoutPage].length - 1 || isHardLocked}
                              onClick={() => {
                                if (idx === layoutSections[activeLayoutPage].length - 1 || isHardLocked) return;
                                const currentList = [...layoutSections[activeLayoutPage]];
                                const temp = currentList[idx];
                                currentList[idx] = currentList[idx + 1];
                                currentList[idx + 1] = temp;
                                currentList.forEach((s, i) => (s.order = i + 1));
                                setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                                triggerActionNotice(`ترتیب سکشن ${sec.label} تغییر یافت.`);
                              }}
                              className="hover:text-amber-400 disabled:opacity-20 transition-colors"
                            >
                              ▼
                            </button>
                          </div>

                          <span className="w-6 h-6 rounded-lg bg-slate-800 text-amber-400 font-mono font-bold text-xs flex items-center justify-center">
                            {idx + 1}
                          </span>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-white">{sec.label}</h4>
                              {isHardLocked && (
                                <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  🛡️ Hard Lock
                                </span>
                              )}
                              {isSoftLocked && (
                                <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  🔒 Soft Lock
                                </span>
                              )}
                              {lockLevel === 'free' && (
                                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  🔓 Free
                                </span>
                              )}
                            </div>
                            <code className="text-[11px] text-slate-400 font-mono">{sec.file}</code>
                          </div>
                        </div>

                        {/* Controls: Section Settings + Lock Selector + Status */}
                        <div className="flex items-center gap-2">
                          {/* Section Settings Button */}
                          <button
                            type="button"
                            onClick={() => setEditingSectionId(sec.id)}
                            className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                          >
                            <Sliders size={13} />
                            <span>تنظیمات</span>
                          </button>

                          {/* 3-Level Lock Selector */}
                          <select
                            value={lockLevel}
                            onChange={(e) => {
                              const newLevel = e.target.value as 'free' | 'soft_lock' | 'hard_lock';
                              const currentList = [...layoutSections[activeLayoutPage]];
                              currentList[idx].lock_level = newLevel;
                              setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                              triggerActionNotice(`سطح قفل ${sec.label} به ${newLevel} تغییر کرد.`);
                            }}
                            className="bg-[#121928] border border-[#222E45] text-white text-xs font-bold px-2 py-1 rounded-lg outline-none focus:border-amber-500"
                          >
                            <option value="free">🔓 Free (آزاد)</option>
                            <option value="soft_lock">🔒 Soft Lock (ویرایش مجاز)</option>
                            <option value="hard_lock">🛡️ Hard Lock (ثابت)</option>
                          </select>

                          {/* Status Toggles */}
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                const currentList = [...layoutSections[activeLayoutPage]];
                                currentList[idx].status = 'enabled';
                                setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                                triggerActionNotice(`وضعیت ${sec.label} به enabled تغییر یافت.`);
                              }}
                              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                                sec.status === 'enabled'
                                  ? 'bg-emerald-500 text-slate-950 shadow-glow-sm'
                                  : 'bg-[#121928] text-slate-400 border border-[#222E45] hover:text-white'
                              }`}
                            >
                              ✅ enabled
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                const currentList = [...layoutSections[activeLayoutPage]];
                                currentList[idx].status = 'hidden';
                                setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                                triggerActionNotice(`وضعیت ${sec.label} به hidden تغییر یافت.`);
                              }}
                              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                                sec.status === 'hidden'
                                  ? 'bg-amber-500 text-slate-950 shadow-glow-sm'
                                  : 'bg-[#121928] text-slate-400 border border-[#222E45] hover:text-white'
                              }`}
                            >
                              👁️ hidden
                            </button>

                            <button
                              type="button"
                              disabled={isSoftLocked || isHardLocked}
                              onClick={() => {
                                if (isSoftLocked || isHardLocked) return;
                                const currentList = [...layoutSections[activeLayoutPage]];
                                currentList[idx].status = 'disabled';
                                setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                                triggerActionNotice(`وضعیت ${sec.label} به disabled تغییر یافت.`);
                              }}
                              className={`px-2 py-1 rounded-lg text-xs font-bold transition-all ${
                                sec.status === 'disabled'
                                  ? 'bg-rose-500 text-white shadow-glow-sm'
                                  : 'bg-[#121928] text-slate-400 border border-[#222E45] hover:text-white disabled:opacity-30'
                              }`}
                            >
                              ❌ disabled
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Modal / Drawer for Section Settings */}
                {editingSectionId && (
                  <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#121928] border border-[#202C42] rounded-2xl max-w-lg w-full p-6 space-y-5 text-right dir-rtl shadow-2xl relative">
                      <div className="flex items-center justify-between border-b border-[#202C42] pb-3">
                        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                          <Sliders size={18} />
                          <span>
                            تنظیمات اختصاصی سکشن: {layoutSections[activeLayoutPage].find((s) => s.id === editingSectionId)?.label}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingSectionId(null)}
                          className="text-slate-400 hover:text-white"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* HERO SETTINGS */}
                      {editingSectionId === 'hero' && (
                        <div className="space-y-4 text-xs">
                          <div>
                            <label className="font-bold text-slate-300 block mb-1">عنوان اصلی (Title):</label>
                            <input
                              type="text"
                              value={layoutSections[activeLayoutPage].find((s) => s.id === 'hero')?.settings?.title || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const currentList = [...layoutSections[activeLayoutPage]];
                                const targetSec = currentList.find((s) => s.id === 'hero');
                                if (targetSec) {
                                  targetSec.settings = { ...targetSec.settings, title: val };
                                  setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                                }
                              }}
                              className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="font-bold text-slate-300 block mb-1">زیرعنوان (Subtitle):</label>
                            <textarea
                              rows={2}
                              value={layoutSections[activeLayoutPage].find((s) => s.id === 'hero')?.settings?.subtitle || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                const currentList = [...layoutSections[activeLayoutPage]];
                                const targetSec = currentList.find((s) => s.id === 'hero');
                                if (targetSec) {
                                  targetSec.settings = { ...targetSec.settings, subtitle: val };
                                  setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                                }
                              }}
                              className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <label className="flex items-center gap-2 text-slate-300 cursor-pointer bg-[#0B0E17] p-2.5 rounded-xl border border-[#222E45]">
                              <input
                                type="checkbox"
                                checked={layoutSections[activeLayoutPage].find((s) => s.id === 'hero')?.settings?.show_search_box !== false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const currentList = [...layoutSections[activeLayoutPage]];
                                  const targetSec = currentList.find((s) => s.id === 'hero');
                                  if (targetSec) {
                                    targetSec.settings = { ...targetSec.settings, show_search_box: checked };
                                    setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                                  }
                                }}
                              />
                              <span>نمایش باکس جستجو</span>
                            </label>

                            <label className="flex items-center gap-2 text-slate-300 cursor-pointer bg-[#0B0E17] p-2.5 rounded-xl border border-[#222E45]">
                              <input
                                type="checkbox"
                                checked={layoutSections[activeLayoutPage].find((s) => s.id === 'hero')?.settings?.show_popular_tags !== false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const currentList = [...layoutSections[activeLayoutPage]];
                                  const targetSec = currentList.find((s) => s.id === 'hero');
                                  if (targetSec) {
                                    targetSec.settings = { ...targetSec.settings, show_popular_tags: checked };
                                    setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                                  }
                                }}
                              />
                              <span>نمایش تگ‌های محبوب</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* GRID SETTINGS */}
                      {(editingSectionId === 'grid' || editingSectionId === 'featured_prompts') && (
                        <div className="space-y-4 text-xs">
                          <div className="grid grid-cols-3 gap-3">
                            <div>
                              <label className="font-bold text-slate-300 block mb-1">ستون دسکتاپ:</label>
                              <select
                                value={layoutSections[activeLayoutPage].find((s) => s.id === editingSectionId)?.settings?.columns_desktop || 3}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  const currentList = [...layoutSections[activeLayoutPage]];
                                  const targetSec = currentList.find((s) => s.id === editingSectionId);
                                  if (targetSec) {
                                    targetSec.settings = { ...targetSec.settings, columns_desktop: val };
                                    setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                                  }
                                }}
                                className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                              >
                                <option value={3}>3 ستونه</option>
                                <option value={4}>4 ستونه</option>
                                <option value={5}>5 ستونه</option>
                              </select>
                            </div>

                            <div>
                              <label className="font-bold text-slate-300 block mb-1">ستون تبلت:</label>
                              <select
                                value={layoutSections[activeLayoutPage].find((s) => s.id === editingSectionId)?.settings?.columns_tablet || 2}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  const currentList = [...layoutSections[activeLayoutPage]];
                                  const targetSec = currentList.find((s) => s.id === editingSectionId);
                                  if (targetSec) {
                                    targetSec.settings = { ...targetSec.settings, columns_tablet: val };
                                    setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                                  }
                                }}
                                className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500"
                              >
                                <option value={2}>2 ستونه</option>
                                <option value={3}>3 ستونه</option>
                              </select>
                            </div>

                            <div>
                              <label className="font-bold text-slate-300 block mb-1">کارت در صفحه:</label>
                              <input
                                type="number"
                                min={2}
                                max={24}
                                value={layoutSections[activeLayoutPage].find((s) => s.id === editingSectionId)?.settings?.cards_per_page || 8}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value, 10);
                                  const currentList = [...layoutSections[activeLayoutPage]];
                                  const targetSec = currentList.find((s) => s.id === editingSectionId);
                                  if (targetSec) {
                                    targetSec.settings = { ...targetSec.settings, cards_per_page: val };
                                    setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                                  }
                                }}
                                className="w-full bg-[#0B0E17] border border-[#222E45] rounded-xl px-3 py-2 text-white outline-none focus:border-amber-500 font-bold text-center"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <label className="flex items-center gap-2 text-slate-300 cursor-pointer bg-[#0B0E17] p-2.5 rounded-xl border border-[#222E45]">
                              <input
                                type="checkbox"
                                checked={layoutSections[activeLayoutPage].find((s) => s.id === editingSectionId)?.settings?.show_excerpt !== false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const currentList = [...layoutSections[activeLayoutPage]];
                                  const targetSec = currentList.find((s) => s.id === editingSectionId);
                                  if (targetSec) {
                                    targetSec.settings = { ...targetSec.settings, show_excerpt: checked };
                                    setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                                  }
                                }}
                              />
                              <span>نمایش توضیح کوتاه</span>
                            </label>

                            <label className="flex items-center gap-2 text-slate-300 cursor-pointer bg-[#0B0E17] p-2.5 rounded-xl border border-[#222E45]">
                              <input
                                type="checkbox"
                                checked={layoutSections[activeLayoutPage].find((s) => s.id === editingSectionId)?.settings?.show_copy_button !== false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const currentList = [...layoutSections[activeLayoutPage]];
                                  const targetSec = currentList.find((s) => s.id === editingSectionId);
                                  if (targetSec) {
                                    targetSec.settings = { ...targetSec.settings, show_copy_button: checked };
                                    setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                                  }
                                }}
                              />
                              <span>نمایش دکمه کپی</span>
                            </label>

                            <label className="flex items-center gap-2 text-slate-300 cursor-pointer bg-[#0B0E17] p-2.5 rounded-xl border border-[#222E45]">
                              <input
                                type="checkbox"
                                checked={layoutSections[activeLayoutPage].find((s) => s.id === editingSectionId)?.settings?.show_ai_model_badge !== false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const currentList = [...layoutSections[activeLayoutPage]];
                                  const targetSec = currentList.find((s) => s.id === editingSectionId);
                                  if (targetSec) {
                                    targetSec.settings = { ...targetSec.settings, show_ai_model_badge: checked };
                                    setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                                  }
                                }}
                              />
                              <span>نمایش مدل هوش مصنوعی</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* ACTIVE FILTERS SETTINGS */}
                      {editingSectionId === 'active_filters' && (
                        <div className="space-y-4 text-xs">
                          <div className="grid grid-cols-2 gap-3">
                            <label className="flex items-center gap-2 text-slate-300 cursor-pointer bg-[#0B0E17] p-2.5 rounded-xl border border-[#222E45]">
                              <input
                                type="checkbox"
                                checked={layoutSections[activeLayoutPage].find((s) => s.id === 'active_filters')?.settings?.show_clear_all !== false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const currentList = [...layoutSections[activeLayoutPage]];
                                  const targetSec = currentList.find((s) => s.id === 'active_filters');
                                  if (targetSec) {
                                    targetSec.settings = { ...targetSec.settings, show_clear_all: checked };
                                    setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                                  }
                                }}
                              />
                              <span>نمایش دکمه پاکسازی همه</span>
                            </label>

                            <label className="flex items-center gap-2 text-slate-300 cursor-pointer bg-[#0B0E17] p-2.5 rounded-xl border border-[#222E45]">
                              <input
                                type="checkbox"
                                checked={layoutSections[activeLayoutPage].find((s) => s.id === 'active_filters')?.settings?.show_icons !== false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  const currentList = [...layoutSections[activeLayoutPage]];
                                  const targetSec = currentList.find((s) => s.id === 'active_filters');
                                  if (targetSec) {
                                    targetSec.settings = { ...targetSec.settings, show_icons: checked };
                                    setLayoutSections({ ...layoutSections, [activeLayoutPage]: currentList });
                                  }
                                }}
                              />
                              <span>نمایش آیکون‌ها</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Default settings for other sections */}
                      {!['hero', 'grid', 'featured_prompts', 'active_filters'].includes(editingSectionId) && (
                        <div className="p-4 bg-[#0B0E17] rounded-xl border border-[#222E45] text-xs text-slate-400 text-center">
                          این سکشن دارای تنظیمات پارامتری عمومی است و به‌صورت خودکار در الگوی PHP فراخوانی می‌شود.
                        </div>
                      )}

                      <div className="pt-3 border-t border-[#202C42] flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingSectionId(null);
                            triggerActionNotice('تنظیمات اختصاصی سکشن با موفقیت به‌روزرسانی شد.');
                          }}
                          className="bg-amber-500 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs shadow-glow-sm"
                        >
                          تأیید و ذخیره تنظیمات
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Import / Export Layout Tool */}
                <div className="border-t border-[#202C42] pt-4 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Export Box */}
                  <div className="bg-[#0B0E17] p-3.5 rounded-xl border border-[#222E45] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">📤 خروجی چیدمان (Export Layout JSON):</span>
                      <button
                        type="button"
                        onClick={() => {
                          const exportData = JSON.stringify({ page: activeLayoutPage, layout: layoutSections[activeLayoutPage] }, null, 2);
                          navigator.clipboard.writeText(exportData);
                          triggerActionNotice('کد JSON چیدمان با موفقیت در کلیپ‌بورد کپی شد.');
                        }}
                        className="text-[11px] bg-amber-500 text-slate-950 px-2.5 py-1 rounded font-bold hover:bg-amber-400 transition-colors"
                      >
                        کپی JSON
                      </button>
                    </div>
                    <textarea
                      readOnly
                      rows={4}
                      value={JSON.stringify({ page: activeLayoutPage, layout: layoutSections[activeLayoutPage] }, null, 2)}
                      className="w-full bg-[#121928] text-amber-300 font-mono text-[11px] p-2 rounded-lg border border-[#202C42] focus:outline-none"
                    />
                  </div>

                  {/* Import Box */}
                  <div className="bg-[#0B0E17] p-3.5 rounded-xl border border-[#222E45] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">📥 ورودی چیدمان (Import Layout JSON):</span>
                      <button
                        type="button"
                        onClick={() => {
                          try {
                            const parsed = JSON.parse(importJsonText);
                            if (parsed && parsed.layout && Array.isArray(parsed.layout)) {
                              setLayoutSections({ ...layoutSections, [activeLayoutPage]: parsed.layout });
                              setImportJsonText('');
                              triggerActionNotice(`چیدمان جدید با موفقیت برای صفحه ${activeLayoutPage} اعمال گردید.`);
                            } else {
                              triggerActionNotice('خطا: ساختار JSON وارد شده معتبر نیست.');
                            }
                          } catch {
                            triggerActionNotice('خطا: کد JSON معتبر نیست.');
                          }
                        }}
                        className="text-[11px] bg-emerald-500 text-slate-950 px-2.5 py-1 rounded font-bold hover:bg-emerald-400 transition-colors"
                      >
                        اعمال Import
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={importJsonText}
                      onChange={(e) => setImportJsonText(e.target.value)}
                      placeholder='{"page": "explore", "layout": [...] }'
                      className="w-full bg-[#121928] text-slate-200 font-mono text-[11px] p-2 rounded-lg border border-[#202C42] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 13: MEDIA */}
          {activeTab === 'media' && (
            <div className="bg-[#121928] p-5 rounded-2xl border border-[#202C42] space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-[#202C42] pb-2">کتابخانه رسانه وردپرس (Native Media Library)</h3>
              <p className="text-xs text-slate-400">
                تمامی آدرس‌های تصاویر دسکتاپ و موبایل پس از نصب در وردپرس مستقیماً از Media Library فراخوانی خواهند شد.
              </p>
            </div>
          )}

          {/* TAB 14: PRODUCTION NATIVE PHP CODE GENERATOR */}
          {activeTab === 'wp_php_code' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121928] p-4 rounded-2xl border border-[#202C42]">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D97757]" />
                    <span>کدهای PHP تولیدشده اختصاصی برای قالب وردپرس</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    کدهای تماماً نیتیو، امن، منطبق بر استاندارد Coding Standards وردپرس همراه با فایل قالب اختصاصی کاوش (page-explore.php)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="/promptjo-theme-v4.0.2.zip"
                    download="promptjo-theme-v4.0.2.zip"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D97757] hover:bg-[#E58A66] text-white text-xs font-bold transition-all shadow-glow-sm"
                  >
                    <Download size={15} />
                    <span>دانلود پوسته کامل وردپرس (v4.0.2 ZIP)</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      const filenameMap: Record<string, string> = {
                        functions: 'functions.php',
                        cpt: 'custom-post-types.php',
                        metaboxes: 'meta-boxes.php',
                        settings: 'admin-settings.php',
                        bannermanager: 'banner-manager.php',
                        frontpage: 'front-page.php',
                        pageexplore: 'page-explore.php',
                      };
                      const fname = filenameMap[activePhpFile] || `${activePhpFile}.php`;
                      const content = (phpFiles as any)[activePhpFile];
                      const blob = new Blob([content], { type: 'text/x-php;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = fname;
                      a.click();
                      URL.revokeObjectURL(url);
                      triggerActionNotice(`فایل ${fname} مجزا با موفقیت دانلود شد.`);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
                  >
                    <Download size={15} />
                    <span>دانلود مجزای این فایل ({activePhpFile === 'pageexplore' ? 'page-explore.php' : `${activePhpFile}.php`})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyPhp((phpFiles as any)[activePhpFile], activePhpFile)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D97757] text-white text-xs font-bold shadow-glow-sm hover:brightness-110"
                  >
                    {copiedCodeFile === activePhpFile ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copiedCodeFile === activePhpFile ? 'کپی شد!' : 'کپی کدهای PHP'}</span>
                  </button>
                </div>
              </div>

              {/* Sub-tabs for PHP files */}
              <div className="flex flex-wrap items-center gap-2 border-b border-[#202C42] pb-2">
                {[
                  { id: 'pageexplore', label: '✨ page-explore.php (قالب اختصاصی کاوش)' },
                  { id: 'functions', label: 'functions.php' },
                  { id: 'cpt', label: 'inc/custom-post-types.php' },
                  { id: 'metaboxes', label: 'inc/meta-boxes.php' },
                  { id: 'settings', label: 'inc/admin-settings.php' },
                  { id: 'bannermanager', label: 'inc/banner-manager.php' },
                  { id: 'frontpage', label: 'front-page.php' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActivePhpFile(f.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                      activePhpFile === f.id
                        ? 'bg-[#D97757] text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200 bg-[#121928] border border-[#202C42]'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="relative bg-[#070A11] border border-[#1E293B] rounded-2xl p-4 overflow-x-auto dir-ltr">
                <pre className="text-xs font-mono text-emerald-400 leading-relaxed whitespace-pre">
                  {(phpFiles as any)[activePhpFile]}
                </pre>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
