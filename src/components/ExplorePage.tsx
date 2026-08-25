import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PromptItemData, CategoryCardData } from '../types';
import { ChevronDown, X } from 'lucide-react';
import { PromptCard } from './PromptCard';
import { SearchComponent } from './SearchComponent';
import { useElementWidth, MeasurementBadge } from './UXLayoutInspector';

interface ExplorePageProps {
  prompts: PromptItemData[];
  categories: CategoryCardData[];
  selectedCategory?: string;
  onCopyPrompt: (text: string, title: string) => void;
  copiedPromptId: string | null;
  onBookmarkToggle: (id: string) => void;
  onOpenPromptModal: (prompt: PromptItemData) => void;
  isInspectorEnabled?: boolean;
}

// MAIN TOPICS LIST (5 Core PromptJo Categories + Auxiliary)
const TOPIC_ITEMS = [
  { id: 'image', label: 'تولید تصویر' },
  { id: 'video', label: 'تولید ویدیو' },
  { id: 'code', label: 'برنامه‌نویسی' },
  { id: 'marketing', label: 'مارکتینگ' },
  { id: 'content', label: 'تولید محتوا' },
  { id: 'anime', label: 'انیمه' },
  { id: 'photography', label: 'عکاسی' },
  { id: 'music', label: 'موسیقی' },
];

// ==========================================
// CONTEXT-AWARE FILTER MATRIX DEFINITIONS
// ==========================================

// 1. IMAGE CONTEXT FILTERS (تولید تصویر)
const IMAGE_SUBJECT_ITEMS = [
  { id: 'portrait', label: 'پرتره' },
  { id: 'logo', label: 'لوگو' },
  { id: 'product', label: 'محصول' },
  { id: 'poster', label: 'پوستر' },
  { id: 'advertising', label: 'تبلیغاتی' },
  { id: 'architecture', label: 'معماری' },
  { id: 'nature', label: 'طبیعت' },
];

const IMAGE_STYLE_ITEMS = [
  { id: 'realistic', label: 'رئال' },
  { id: 'cinematic', label: 'سینمایی' },
  { id: 'minimal', label: 'مینیمال' },
  { id: '3d', label: 'سه‌بعدی' },
  { id: 'anime', label: 'انیمه' },
  { id: 'fantasy', label: 'فانتزی' },
  { id: 'painting', label: 'نقاشی' },
];

const IMAGE_MODEL_ITEMS = [
  { id: 'midjourney', label: 'Midjourney' },
  { id: 'flux', label: 'Flux' },
  { id: 'dalle', label: 'DALL·E' },
  { id: 'stable-diffusion', label: 'Stable Diffusion' },
  { id: 'gemini', label: 'Gemini' },
];

// 2. VIDEO CONTEXT FILTERS (تولید ویدیو)
const VIDEO_SUBJECT_ITEMS = [
  { id: 'advertising', label: 'تبلیغاتی' },
  { id: 'cinematic', label: 'سینمایی' },
  { id: 'social-media', label: 'شبکه اجتماعی' },
  { id: 'music-video', label: 'موزیک ویدئو' },
  { id: 'animation', label: 'انیمیشن' },
  { id: 'educational', label: 'آموزشی' },
  { id: 'product', label: 'محصول' },
];

const VIDEO_STYLE_ITEMS = [
  { id: 'cinematic', label: 'سینمایی' },
  { id: 'documentary', label: 'مستند' },
  { id: 'commercial', label: 'تبلیغاتی' },
  { id: 'realistic', label: 'واقع‌گرایانه' },
  { id: 'animated', label: 'انیمیشنی' },
  { id: 'motion-graphics', label: 'موشن گرافیک' },
];

const VIDEO_MODEL_ITEMS = [
  { id: 'veo', label: 'Veo' },
  { id: 'kling', label: 'Kling' },
  { id: 'runway', label: 'Runway' },
  { id: 'sora', label: 'Sora' },
  { id: 'gemini', label: 'Gemini' },
];

// 3. PROGRAMMING CONTEXT FILTERS (برنامه‌نویسی)
const CODE_DOMAIN_ITEMS = [
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Database' },
  { id: 'api', label: 'API' },
  { id: 'automation', label: 'Automation' },
  { id: 'devops', label: 'DevOps' },
  { id: 'wordpress', label: 'WordPress' },
];

const CODE_TECH_ITEMS = [
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'php', label: 'PHP' },
  { id: 'react', label: 'React' },
  { id: 'sql', label: 'SQL' },
  { id: 'html-css', label: 'HTML/CSS' },
];

const CODE_TASK_ITEMS = [
  { id: 'code-gen', label: 'تولید کد' },
  { id: 'debug', label: 'Debug' },
  { id: 'code-review', label: 'Code Review' },
  { id: 'refactor', label: 'Refactor' },
  { id: 'code-explain', label: 'توضیح کد' },
  { id: 'testing', label: 'تست‌نویسی' },
  { id: 'documentation', label: 'مستندسازی' },
  { id: 'optimization', label: 'بهینه‌سازی' },
];

const CODE_MODEL_ITEMS = [
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'claude', label: 'Claude' },
  { id: 'gemini', label: 'Gemini' },
];

// 4. CONTENT CREATION CONTEXT FILTERS (تولید محتوا)
const CONTENT_TYPE_ITEMS = [
  { id: 'article', label: 'مقاله' },
  { id: 'blog-post', label: 'پست وبلاگ' },
  { id: 'caption', label: 'کپشن' },
  { id: 'script', label: 'سناریو' },
  { id: 'email', label: 'ایمیل' },
  { id: 'newsletter', label: 'خبرنامه' },
  { id: 'product-desc', label: 'توضیحات محصول' },
  { id: 'ad-copy', label: 'متن تبلیغاتی' },
];

const CONTENT_GOAL_ITEMS = [
  { id: 'educational', label: 'آموزشی' },
  { id: 'advertising', label: 'تبلیغاتی' },
  { id: 'sales', label: 'فروش' },
  { id: 'informational', label: 'اطلاع‌رسانی' },
  { id: 'entertainment', label: 'سرگرمی' },
  { id: 'seo', label: 'SEO' },
];

const CONTENT_TONE_ITEMS = [
  { id: 'formal', label: 'رسمی' },
  { id: 'friendly', label: 'دوستانه' },
  { id: 'professional', label: 'حرفه‌ای' },
  { id: 'persuasive', label: 'متقاعدکننده' },
  { id: 'creative', label: 'خلاقانه' },
  { id: 'specialized', label: 'تخصصی' },
];

const CONTENT_MODEL_ITEMS = [
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'claude', label: 'Claude' },
  { id: 'gemini', label: 'Gemini' },
];

// 5. MARKETING CONTEXT FILTERS (مارکتینگ)
const MARKETING_FIELD_ITEMS = [
  { id: 'advertising', label: 'تبلیغات' },
  { id: 'seo', label: 'SEO' },
  { id: 'social-media', label: 'شبکه‌های اجتماعی' },
  { id: 'email-marketing', label: 'ایمیل مارکتینگ' },
  { id: 'sales', label: 'فروش' },
  { id: 'branding', label: 'برندینگ' },
  { id: 'campaign', label: 'کمپین' },
  { id: 'acquisition', label: 'جذب مشتری' },
];

const MARKETING_GOAL_ITEMS = [
  { id: 'sales', label: 'افزایش فروش' },
  { id: 'acquisition', label: 'جذب مشتری' },
  { id: 'brand-awareness', label: 'آگاهی از برند' },
  { id: 'engagement', label: 'افزایش تعامل' },
  { id: 'lead-gen', label: 'جذب لید' },
];

const MARKETING_OUTPUT_ITEMS = [
  { id: 'ad-copy', label: 'متن تبلیغاتی' },
  { id: 'campaign', label: 'Campaign' },
  { id: 'landing-page', label: 'Landing Page' },
  { id: 'email', label: 'Email' },
  { id: 'social-post', label: 'Social Post' },
  { id: 'strategy', label: 'Strategy' },
];

const MARKETING_MODEL_ITEMS = [
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'claude', label: 'Claude' },
  { id: 'gemini', label: 'Gemini' },
];

// AUXILIARY TOPIC FILTERS (Anime, Photography, Music)
const AUX_SUBCATEGORIES: Record<string, { id: string; label: string }[]> = {
  anime: [
    { id: 'character', label: 'کاراکتر دیزاین' },
    { id: 'background', label: 'بک‌گراند انیمه' },
    { id: 'manga', label: 'مانگا' },
  ],
  photography: [
    { id: 'portrait', label: 'پرتره' },
    { id: 'landscape', label: 'طبیعت' },
    { id: 'studio', label: 'آتلیه' },
  ],
  music: [
    { id: 'composition', label: 'آهنگسازی' },
    { id: 'arrangement', label: 'تنظیم' },
    { id: 'songwriting', label: 'ترانه‌سرایی' },
  ],
};

// GENERAL AI MODELS LIST (When no category is selected)
const GENERAL_MODEL_ITEMS = [
  { id: 'chatgpt', label: 'ChatGPT' },
  { id: 'claude', label: 'Claude' },
  { id: 'midjourney', label: 'Midjourney' },
  { id: 'flux', label: 'Flux' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'runway', label: 'Runway' },
];

// SORT OPTIONS LIST
const SORT_ITEMS = [
  { id: 'newest', label: 'جدیدترین' },
  { id: 'popular', label: 'محبوب‌ترین' },
  { id: 'most-copied', label: 'بیشترین کپی' },
  { id: 'rating', label: 'بالاترین امتیاز' },
];

const mapCategoryToTopic = (cat: string | undefined | null): string | null => {
  if (!cat) return null;
  const c = cat.toLowerCase();
  if (c === 'programming' || c === 'coding' || c === 'code' || c === 'cat3' || c.includes('برنامه‌نویسی') || c.includes('پایتون')) return 'code';
  if (c === 'image' || c === 'image-generation' || c === 'cat1' || c.includes('تصویر')) return 'image';
  if (c === 'video' || c === 'video-generation' || c === 'cat2' || c.includes('ویدیو') || c.includes('ویدئو')) return 'video';
  if (c === 'marketing' || c === 'advertising' || c === 'cat4' || c.includes('مارکتینگ') || c.includes('تبلیغات')) return 'marketing';
  if (c === 'content' || c === 'content-creation' || c === 'text' || c === 'cat5' || c.includes('محتوا') || c.includes('متن')) return 'content';
  if (c === 'anime' || c.includes('انیمه')) return 'anime';
  if (c === 'photography' || c.includes('عکاسی')) return 'photography';
  if (c === 'music' || c.includes('موسیقی')) return 'music';
  return cat;
};

export const ExplorePage: React.FC<ExplorePageProps> = ({
  prompts,
  categories,
  selectedCategory,
  onCopyPrompt,
  copiedPromptId,
  onBookmarkToggle,
  onOpenPromptModal,
  isInspectorEnabled = false,
}) => {
  // Measurement Refs for UX Layout Inspector
  const [containerRef, containerWidth] = useElementWidth<HTMLDivElement>();
  const [searchRef, searchWidth] = useElementWidth<HTMLDivElement>();
  const [filtersRef, filtersWidth] = useElementWidth<HTMLDivElement>();

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Primary Context State (Topic / Category)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(() => mapCategoryToTopic(selectedCategory));

  // Context-Aware Sub-Filter States
  const [selectedSub, setSelectedSub] = useState<string | null>(null);         // Image/Video Subject, or Aux Sub
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);     // Image/Video Style
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);   // Programming Domain
  const [selectedTech, setSelectedTech] = useState<string | null>(null);       // Programming Tech
  const [selectedTask, setSelectedTask] = useState<string | null>(null);       // Programming Task
  const [selectedType, setSelectedType] = useState<string | null>(null);       // Content Type
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);       // Content/Marketing Goal
  const [selectedTone, setSelectedTone] = useState<string | null>(null);       // Content Tone
  const [selectedField, setSelectedField] = useState<string | null>(null);     // Marketing Field
  const [selectedOutput, setSelectedOutput] = useState<string | null>(null);   // Marketing Output
  const [selectedModel, setSelectedModel] = useState<string | null>(null);     // Model Filter
  const [selectedSort, setSelectedSort] = useState<string>('newest');          // Sort

  // Reset context-specific sub-filters when selectedTopic changes
  const handleTopicChange = (newTopic: string | null) => {
    setSelectedTopic(newTopic);
    setSelectedSub(null);
    setSelectedStyle(null);
    setSelectedDomain(null);
    setSelectedTech(null);
    setSelectedTask(null);
    setSelectedType(null);
    setSelectedGoal(null);
    setSelectedTone(null);
    setSelectedField(null);
    setSelectedOutput(null);
    setSelectedModel(null);
    updateUrlParams({
      topic: newTopic,
      sub: null,
      style: null,
      domain: null,
      tech: null,
      task: null,
      type: null,
      goal: null,
      tone: null,
      field: null,
      output: null,
      model: null,
    });
  };

  // Sync with URL query params on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const topicParam = params.get('topic') || params.get('category');
      const searchParam = params.get('search');
      const sortParam = params.get('sort');
      const modelParam = params.get('model');
      const styleParam = params.get('style');
      const subParam = params.get('sub') || params.get('subcategory');
      const domainParam = params.get('domain');
      const techParam = params.get('tech');
      const taskParam = params.get('task');
      const typeParam = params.get('type');
      const goalParam = params.get('goal');
      const toneParam = params.get('tone');
      const fieldParam = params.get('field');
      const outputParam = params.get('output');

      if (topicParam) setSelectedTopic(mapCategoryToTopic(topicParam));
      if (searchParam) setSearchQuery(searchParam);
      if (sortParam) setSelectedSort(sortParam);
      if (modelParam) setSelectedModel(modelParam);
      if (styleParam) setSelectedStyle(styleParam);
      if (subParam) setSelectedSub(subParam);
      if (domainParam) setSelectedDomain(domainParam);
      if (techParam) setSelectedTech(techParam);
      if (taskParam) setSelectedTask(taskParam);
      if (typeParam) setSelectedType(typeParam);
      if (goalParam) setSelectedGoal(goalParam);
      if (toneParam) setSelectedTone(toneParam);
      if (fieldParam) setSelectedField(fieldParam);
      if (outputParam) setSelectedOutput(outputParam);
    }
  }, []);

  // Sync state changes back to prop selectedCategory
  useEffect(() => {
    if (selectedCategory) {
      setSelectedTopic(mapCategoryToTopic(selectedCategory));
    }
  }, [selectedCategory]);

  // Helper to update URL search params without reload
  const updateUrlParams = (newParams: Record<string, string | null>) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    window.history.replaceState({}, '', url.toString());
  };

  // State for Load More Pagination System
  const PAGE_SIZE = 12;
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Dropdown Open state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownSearch, setDropdownSearch] = useState('');

  // Dropdown reference for click-outside closure
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [
    searchQuery,
    selectedTopic,
    selectedSub,
    selectedStyle,
    selectedDomain,
    selectedTech,
    selectedTask,
    selectedType,
    selectedGoal,
    selectedTone,
    selectedField,
    selectedOutput,
    selectedModel,
    selectedSort,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setDropdownSearch('');
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  // Dynamic Context-Aware Hero Content Calculator
  const heroContent = useMemo(() => {
    if (searchQuery.trim()) {
      return {
        breadcrumb: `نتایج جستجو / ${searchQuery.trim()}`,
        title: `نتایج جستجو برای «${searchQuery.trim()}»`,
        description: `پرامپت‌های بهینه‌شده مرتبط با جستجوی شما در بانک اطلاعاتی پرامپت‌جو.`,
        badge: 'نتایج جستجو',
      };
    }

    if (selectedTopic) {
      switch (selectedTopic) {
        case 'image':
          return {
            breadcrumb: 'موضوعات / پرامپت‌های تصویری',
            title: 'پرامپت‌های تولید تصویر',
            description: 'پرامپت‌های خلاقانه و تخصصی برای خلق تصاویر خیره‌کننده با ابزارهای Midjourney، Flux و DALL·E.',
            badge: 'تولید تصویر',
          };
        case 'video':
          return {
            breadcrumb: 'موضوعات / پرامپت‌های ویدیو',
            title: 'پرامپت‌های تولید ویدیو',
            description: 'پرامپت‌های سینمایی و هوشمند برای تولید ویدیو، موشن‌گرافیک و تیزرهای تبلیغاتی با Veo، Kling و Runway.',
            badge: 'تولید ویدیو',
          };
        case 'code':
        case 'programming':
          return {
            breadcrumb: 'موضوعات / پرامپت‌های برنامه‌نویسی',
            title: 'پرامپت‌های برنامه‌نویسی و توسعه',
            description: 'پرامپت‌های کاربردی برای کدنویسی، دیباگ، ریفکتور، معماری سیستم و حل مسائل فنی با ChatGPT و Claude.',
            badge: 'برنامه‌نویسی',
          };
        case 'content':
        case 'text':
          return {
            breadcrumb: 'موضوعات / پرامپت‌های تولید محتوا',
            title: 'پرامپت‌های تولید محتوا و نگارش',
            description: 'پرامپت‌های هوشمند برای نگارش مقاله، پست وبلاگ، کپشن، سناریو و کپی‌رایتینگ سئو شده.',
            badge: 'تولید محتوا',
          };
        case 'marketing':
          return {
            breadcrumb: 'موضوعات / پرامپت‌های مارکتینگ',
            title: 'پرامپت‌های مارکتینگ و بازاریابی',
            description: 'پرامپت‌های استراتژیک برای طراحی کمپین، تبلیغات، ایمیل مارکتینگ، جذب لید و رشد کسب‌وکار.',
            badge: 'مارکتینگ',
          };
        case 'anime':
          return {
            breadcrumb: 'موضوعات / پرامپت‌های انیمه',
            title: 'پرامپت‌های انیمه و مانگا',
            description: 'پرامپت‌های منتخب برای خلق تصاویر، کاراکترها و محتوای انیمه با هوش مصنوعی.',
            badge: 'انیمه',
          };
        case 'photography':
          return {
            breadcrumb: 'موضوعات / پرامپت‌های عکاسی',
            title: 'پرامپت‌های عکاسی و پرتره',
            description: 'پرامپت‌های حرفه‌ای برای خلق عکس‌های رئالیستی، پرتره، معماری و عکاسی آتلیه‌ای.',
            badge: 'عکاسی',
          };
        case 'music':
          return {
            breadcrumb: 'موضوعات / پرامپت‌های موسیقی',
            title: 'پرامپت‌های موسیقی و صدا',
            description: 'پرامپت‌های الهام‌بخش برای ترانه‌سرایی، آهنگسازی و ساخت موزیک با هوش مصنوعی.',
            badge: 'موسیقی',
          };
        default: {
          const topicObj = TOPIC_ITEMS.find((t) => t.id === selectedTopic);
          const label = topicObj ? topicObj.label : selectedTopic;
          return {
            breadcrumb: `موضوعات / پرامپت‌های ${label}`,
            title: `پرامپت‌های ${label}`,
            description: `مجموعه‌ای از بهترین پرامپت‌های کاربردی در دسته ${label} با هوش مصنوعی.`,
            badge: label,
          };
        }
      }
    }

    if (selectedModel) {
      const modelObj = GENERAL_MODEL_ITEMS.find((m) => m.id === selectedModel);
      const mLabel = modelObj ? modelObj.label : selectedModel;
      return {
        breadcrumb: `مدل‌ها / ${mLabel}`,
        title: `پرامپت‌های ${mLabel}`,
        description: `پرامپت‌های بهینه‌سازی‌شده برای مدل هوش مصنوعی ${mLabel}.`,
        badge: mLabel,
      };
    }

    if (selectedSort === 'popular' || selectedSort === 'most-copied') {
      return {
        breadcrumb: 'کاوش / پرامپت‌های محبوب',
        title: 'پرامپت‌های محبوب',
        description: 'محبوب‌ترین و پرکاربردترین پرامپت‌ها براساس کپی و بازخورد کاربران.',
        badge: 'محبوب‌ترین‌ها',
      };
    }

    if (selectedSort === 'rating') {
      return {
        breadcrumb: 'کاوش / برترین پرامپت‌ها',
        title: 'برترین پرامپت‌ها',
        description: 'پرامپت‌های دارای بالاترین امتیاز و بیشترین بازخورد مثبت.',
        badge: 'بالاترین امتیاز',
      };
    }

    return {
      breadcrumb: 'پایگاه پرامپت‌ها / کاوش',
      title: 'پرامپت‌های هوش مصنوعی',
      description: 'مجموعه‌ای از پرامپت‌های کاربردی و منتخب برای پیدا کردن ایده و ساخت خروجی بهتر با هوش مصنوعی.',
      badge: 'آرشیو پرامپت‌ها',
    };
  }, [searchQuery, selectedTopic, selectedModel, selectedSort]);

  // Context-Aware Prompts Filtering Logic
  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) => {
      const pCat = (prompt.category || '').toLowerCase();
      const pTitle = (prompt.title || '').toLowerCase();
      const pDesc = (prompt.description || '').toLowerCase();
      const pText = (prompt.fullPromptText || '').toLowerCase();
      const pTags = (prompt.tags || []).map((t) => t.toLowerCase()).join(' ');
      const pModel = (prompt.aiModel || '').toLowerCase();

      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !pTitle.includes(q) &&
          !pDesc.includes(q) &&
          !pCat.includes(q) &&
          !pText.includes(q) &&
          !pTags.includes(q) &&
          !pModel.includes(q)
        ) {
          return false;
        }
      }

      // 2. Primary Topic Context Filter
      if (selectedTopic) {
        switch (selectedTopic) {
          case 'image': {
            const isImage =
              pCat.includes('تصویر') ||
              pCat.includes('عکاسی') ||
              pTitle.includes('تصویر') ||
              pTags.includes('تصویر') ||
              pTags.includes('میدجرنی') ||
              pTags.includes('flux') ||
              pModel.includes('midjourney') ||
              pModel.includes('flux') ||
              pModel.includes('dall');
            if (!isImage) return false;

            // Sub-filters for Image
            if (selectedSub) {
              const subObj = IMAGE_SUBJECT_ITEMS.find((s) => s.id === selectedSub);
              if (subObj) {
                const sLabel = subObj.label.toLowerCase();
                if (!pTitle.includes(sLabel) && !pDesc.includes(sLabel) && !pTags.includes(sLabel) && !pText.includes(sLabel)) {
                  return false;
                }
              }
            }
            if (selectedStyle) {
              const stObj = IMAGE_STYLE_ITEMS.find((s) => s.id === selectedStyle);
              if (stObj) {
                const stLabel = stObj.label.toLowerCase();
                if (!pTitle.includes(stLabel) && !pDesc.includes(stLabel) && !pTags.includes(stLabel) && !pText.includes(stLabel)) {
                  return false;
                }
              }
            }
            if (selectedModel) {
              const mObj = IMAGE_MODEL_ITEMS.find((m) => m.id === selectedModel);
              if (mObj) {
                const mLabel = mObj.label.toLowerCase();
                if (!pModel.includes(mLabel) && !pTitle.includes(mLabel) && !pTags.includes(mLabel)) {
                  return false;
                }
              }
            }
            break;
          }

          case 'video': {
            const isVideo =
              pCat.includes('ویدیو') ||
              pCat.includes('ویدئو') ||
              pTitle.includes('ویدیو') ||
              pTitle.includes('تیزر') ||
              pTitle.includes('موشن') ||
              pTags.includes('ویدیو') ||
              pTags.includes('تیزر') ||
              pTags.includes('موشن') ||
              pModel.includes('runway') ||
              pModel.includes('veo') ||
              pModel.includes('kling') ||
              pModel.includes('sora');
            if (!isVideo) return false;

            // Sub-filters for Video
            if (selectedSub) {
              const subObj = VIDEO_SUBJECT_ITEMS.find((s) => s.id === selectedSub);
              if (subObj) {
                const sLabel = subObj.label.toLowerCase();
                if (!pTitle.includes(sLabel) && !pDesc.includes(sLabel) && !pTags.includes(sLabel) && !pText.includes(sLabel)) {
                  return false;
                }
              }
            }
            if (selectedStyle) {
              const stObj = VIDEO_STYLE_ITEMS.find((s) => s.id === selectedStyle);
              if (stObj) {
                const stLabel = stObj.label.toLowerCase();
                if (!pTitle.includes(stLabel) && !pDesc.includes(stLabel) && !pTags.includes(stLabel) && !pText.includes(stLabel)) {
                  return false;
                }
              }
            }
            if (selectedModel) {
              const mObj = VIDEO_MODEL_ITEMS.find((m) => m.id === selectedModel);
              if (mObj) {
                const mLabel = mObj.label.toLowerCase();
                if (!pModel.includes(mLabel) && !pTitle.includes(mLabel) && !pTags.includes(mLabel)) {
                  return false;
                }
              }
            }
            break;
          }

          case 'code':
          case 'programming': {
            const isCode =
              pCat.includes('برنامه‌نویسی') ||
              pCat.includes('پایتون') ||
              pCat.includes('کد') ||
              pCat.includes('طراحی رابط کاربری') ||
              pTitle.includes('کد') ||
              pTitle.includes('پایتون') ||
              pTitle.includes('react') ||
              pTitle.includes('اسکریپت') ||
              pTags.includes('برنامه‌نویسی') ||
              pTags.includes('کدنویسی') ||
              pTags.includes('react') ||
              pTags.includes('پایتون');
            if (!isCode) return false;

            // Sub-filters for Programming
            if (selectedDomain) {
              const dObj = CODE_DOMAIN_ITEMS.find((d) => d.id === selectedDomain);
              if (dObj) {
                const dLabel = dObj.label.toLowerCase();
                if (!pTitle.includes(dLabel) && !pDesc.includes(dLabel) && !pTags.includes(dLabel) && !pText.includes(dLabel)) {
                  return false;
                }
              }
            }
            if (selectedTech) {
              const tObj = CODE_TECH_ITEMS.find((t) => t.id === selectedTech);
              if (tObj) {
                const tLabel = tObj.label.toLowerCase();
                if (!pTitle.includes(tLabel) && !pDesc.includes(tLabel) && !pTags.includes(tLabel) && !pText.includes(tLabel)) {
                  return false;
                }
              }
            }
            if (selectedTask) {
              const tkObj = CODE_TASK_ITEMS.find((t) => t.id === selectedTask);
              if (tkObj) {
                const tkLabel = tkObj.label.toLowerCase();
                if (!pTitle.includes(tkLabel) && !pDesc.includes(tkLabel) && !pTags.includes(tkLabel) && !pText.includes(tkLabel)) {
                  return false;
                }
              }
            }
            if (selectedModel) {
              const mObj = CODE_MODEL_ITEMS.find((m) => m.id === selectedModel);
              if (mObj) {
                const mLabel = mObj.label.toLowerCase();
                if (!pModel.includes(mLabel) && !pTitle.includes(mLabel) && !pTags.includes(mLabel)) {
                  return false;
                }
              }
            }
            break;
          }

          case 'content':
          case 'text': {
            const isContent =
              pCat.includes('تولید محتوا') ||
              pCat.includes('محتوا') ||
              pCat.includes('متن') ||
              pCat.includes('مقاله') ||
              pTitle.includes('محتوا') ||
              pTitle.includes('مقاله') ||
              pTitle.includes('سناریو') ||
              pTags.includes('محتوا') ||
              pTags.includes('سئو') ||
              pTags.includes('مقاله');
            if (!isContent) return false;

            // Sub-filters for Content
            if (selectedType) {
              const tpObj = CONTENT_TYPE_ITEMS.find((t) => t.id === selectedType);
              if (tpObj) {
                const tpLabel = tpObj.label.toLowerCase();
                if (!pTitle.includes(tpLabel) && !pDesc.includes(tpLabel) && !pTags.includes(tpLabel) && !pText.includes(tpLabel)) {
                  return false;
                }
              }
            }
            if (selectedGoal) {
              const gObj = CONTENT_GOAL_ITEMS.find((g) => g.id === selectedGoal);
              if (gObj) {
                const gLabel = gObj.label.toLowerCase();
                if (!pTitle.includes(gLabel) && !pDesc.includes(gLabel) && !pTags.includes(gLabel) && !pText.includes(gLabel)) {
                  return false;
                }
              }
            }
            if (selectedTone) {
              const tnObj = CONTENT_TONE_ITEMS.find((t) => t.id === selectedTone);
              if (tnObj) {
                const tnLabel = tnObj.label.toLowerCase();
                if (!pTitle.includes(tnLabel) && !pDesc.includes(tnLabel) && !pTags.includes(tnLabel) && !pText.includes(tnLabel)) {
                  return false;
                }
              }
            }
            if (selectedModel) {
              const mObj = CONTENT_MODEL_ITEMS.find((m) => m.id === selectedModel);
              if (mObj) {
                const mLabel = mObj.label.toLowerCase();
                if (!pModel.includes(mLabel) && !pTitle.includes(mLabel) && !pTags.includes(mLabel)) {
                  return false;
                }
              }
            }
            break;
          }

          case 'marketing': {
            const isMarketing =
              pCat.includes('مارکتینگ') ||
              pCat.includes('بازاریابی') ||
              pCat.includes('تبلیغات') ||
              pTitle.includes('مارکتینگ') ||
              pTitle.includes('کپی‌رایتینگ') ||
              pTitle.includes('شعار') ||
              pTags.includes('مارکتینگ') ||
              pTags.includes('کپی‌رایتینگ') ||
              pTags.includes('شعار') ||
              pTags.includes('بازاریابی');
            if (!isMarketing) return false;

            // Sub-filters for Marketing
            if (selectedField) {
              const fObj = MARKETING_FIELD_ITEMS.find((f) => f.id === selectedField);
              if (fObj) {
                const fLabel = fObj.label.toLowerCase();
                if (!pTitle.includes(fLabel) && !pDesc.includes(fLabel) && !pTags.includes(fLabel) && !pText.includes(fLabel)) {
                  return false;
                }
              }
            }
            if (selectedGoal) {
              const gObj = MARKETING_GOAL_ITEMS.find((g) => g.id === selectedGoal);
              if (gObj) {
                const gLabel = gObj.label.toLowerCase();
                if (!pTitle.includes(gLabel) && !pDesc.includes(gLabel) && !pTags.includes(gLabel) && !pText.includes(gLabel)) {
                  return false;
                }
              }
            }
            if (selectedOutput) {
              const oObj = MARKETING_OUTPUT_ITEMS.find((o) => o.id === selectedOutput);
              if (oObj) {
                const oLabel = oObj.label.toLowerCase();
                if (!pTitle.includes(oLabel) && !pDesc.includes(oLabel) && !pTags.includes(oLabel) && !pText.includes(oLabel)) {
                  return false;
                }
              }
            }
            if (selectedModel) {
              const mObj = MARKETING_MODEL_ITEMS.find((m) => m.id === selectedModel);
              if (mObj) {
                const mLabel = mObj.label.toLowerCase();
                if (!pModel.includes(mLabel) && !pTitle.includes(mLabel) && !pTags.includes(mLabel)) {
                  return false;
                }
              }
            }
            break;
          }

          default: {
            const topicObj = TOPIC_ITEMS.find((t) => t.id === selectedTopic);
            if (topicObj) {
              const tLabel = topicObj.label.toLowerCase();
              const matchesCat = pCat.includes(tLabel) || pTitle.includes(tLabel) || pTags.includes(tLabel);
              if (!matchesCat) return false;

              if (selectedSub && AUX_SUBCATEGORIES[selectedTopic]) {
                const subObj = AUX_SUBCATEGORIES[selectedTopic].find((s) => s.id === selectedSub);
                if (subObj) {
                  const sLabel = subObj.label.toLowerCase();
                  if (!pTitle.includes(sLabel) && !pDesc.includes(sLabel) && !pTags.includes(sLabel)) {
                    return false;
                  }
                }
              }
            }
            break;
          }
        }
      } else {
        // General Model Filter when no topic is selected
        if (selectedModel) {
          const mObj = GENERAL_MODEL_ITEMS.find((m) => m.id === selectedModel);
          if (mObj) {
            const mLabel = mObj.label.toLowerCase();
            if (!pModel.includes(mLabel) && !pTitle.includes(mLabel) && !pTags.includes(mLabel)) {
              return false;
            }
          }
        }
      }

      return true;
    }).sort((a, b) => {
      if (selectedSort === 'popular') {
        const vA = parseInt(String(a.views || '0').replace(/[^0-9]/g, ''), 10) || 0;
        const vB = parseInt(String(b.views || '0').replace(/[^0-9]/g, ''), 10) || 0;
        return vB - vA;
      }
      if (selectedSort === 'most-copied') {
        const sA = parseInt(String(a.saves || '0').replace(/[^0-9]/g, ''), 10) || 0;
        const sB = parseInt(String(b.saves || '0').replace(/[^0-9]/g, ''), 10) || 0;
        return sB - sA;
      }
      if (selectedSort === 'rating') {
        const scoreA = Number(a.prompt_score ?? a.rating ?? 0);
        const scoreB = Number(b.prompt_score ?? b.rating ?? 0);
        return scoreB - scoreA;
      }
      // Default: NEWEST PROMPTS FIRST (post_date DESC / createdAt DESC)
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return (b.id || '').localeCompare(a.id || '', undefined, { numeric: true });
    });
  }, [
    prompts,
    searchQuery,
    selectedTopic,
    selectedSub,
    selectedStyle,
    selectedDomain,
    selectedTech,
    selectedTask,
    selectedType,
    selectedGoal,
    selectedTone,
    selectedField,
    selectedOutput,
    selectedModel,
    selectedSort,
  ]);

  // Active label calculations
  const activeTopicObj = TOPIC_ITEMS.find((t) => t.id === selectedTopic);

  const activeFiltersCount =
    (selectedTopic ? 1 : 0) +
    (selectedSub ? 1 : 0) +
    (selectedStyle ? 1 : 0) +
    (selectedDomain ? 1 : 0) +
    (selectedTech ? 1 : 0) +
    (selectedTask ? 1 : 0) +
    (selectedType ? 1 : 0) +
    (selectedGoal ? 1 : 0) +
    (selectedTone ? 1 : 0) +
    (selectedField ? 1 : 0) +
    (selectedOutput ? 1 : 0) +
    (selectedModel ? 1 : 0) +
    (selectedSort !== 'newest' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // Pagination slicing & Load More logic
  const displayedPrompts = useMemo(() => {
    return filteredPrompts.slice(0, page * PAGE_SIZE);
  }, [filteredPrompts, page]);

  const hasMore = displayedPrompts.length < filteredPrompts.length;

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 300);
  };

  // Helper renderer for Context-Aware Filter Pills
  const renderFilterPill = (
    name: string,
    label: string,
    selectedValue: string | null,
    activeLabel: string | undefined,
    items: { id: string; label: string }[],
    onSelect: (val: string | null) => void
  ) => {
    const isOpen = activeDropdown === name;
    return (
      <div key={name} className="relative">
        {!selectedValue ? (
          <button
            onClick={() => toggleDropdown(name)}
            className={`h-[34px] px-3.5 rounded-[12px] text-xs font-medium inline-flex items-center justify-center cursor-pointer bg-[#282D38] border transition-all duration-200 ${
              isOpen
                ? 'border-[#D97757] text-[#F8FAFC]'
                : 'border-[#3A4150] text-[#F8FAFC] hover:border-[#D97757]/60'
            }`}
          >
            {label} +
          </button>
        ) : (
          <button
            onClick={() => toggleDropdown(name)}
            className="h-[34px] px-3.5 rounded-[12px] text-xs font-medium bg-[#282D38] border border-[#D97757] cursor-pointer inline-flex items-center transition-all duration-200"
          >
            <span className="text-[#A8B0C0]">{label}</span>
            <span className="w-[1px] h-[12px] bg-white/12 mx-[10px] inline-block shrink-0" />
            <span className="text-[#D97757] font-semibold inline-flex items-center gap-1.5">
              {activeLabel}
              <ChevronDown size={12} className="text-[#D97757] inline-block shrink-0" />
            </span>
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(null);
                updateUrlParams({ [name]: null });
              }}
              title={`حذف فیلتر ${label}`}
              className="mr-2 p-0.5 rounded-[6px] text-[#A8B0C0] hover:text-[#D97757] hover:bg-[#D97757]/10 transition-all cursor-pointer inline-flex items-center justify-center shrink-0"
            >
              <X size={13} />
            </span>
          </button>
        )}

        {isOpen && (
          <div className="absolute top-[42px] right-0 w-[190px] bg-[#282D38] border border-[#3A4150] rounded-xl shadow-2xl z-50 p-2 space-y-1">
            {items.length > 6 && (
              <input
                type="text"
                placeholder={`جستجو ${label}...`}
                value={dropdownSearch}
                onChange={(e) => setDropdownSearch(e.target.value)}
                className="w-full h-8 bg-[#1C1F26] border border-[#3A4150] focus:border-[#D97757] rounded-lg px-2 text-xs text-[#F8FAFC] placeholder:text-[#A8B0C0] outline-none shrink-0 mb-1"
              />
            )}
            <div className="flex-1 overflow-y-auto space-y-1 max-h-[220px]">
              {items
                .filter((item) => !dropdownSearch || item.label.toLowerCase().includes(dropdownSearch.toLowerCase()))
                .map((item) => {
                  const isSelected = selectedValue === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        const newVal = isSelected ? null : item.id;
                        onSelect(newVal);
                        updateUrlParams({ [name]: newVal });
                        setActiveDropdown(null);
                      }}
                      className={`w-full text-right px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#D97757]/15 border border-[#D97757]/40 text-[#D97757] font-bold'
                          : 'text-[#F8FAFC] hover:bg-[#1C1F26] hover:text-[#D97757]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isSelected && <span className="text-[#D97757]">✓</span>}
                    </button>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#1C1F26] text-[#F8FAFC] dir-rtl font-sans pb-16">
      
      {/* Main Page Layout Wrapper */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 lg:px-16 xl:px-[52px] pt-8">
        
        {/* Wrapper for click-outside detection across search and filter dropdowns */}
        <div 
          ref={(el) => {
            dropdownRef.current = el;
            containerRef.current = el;
          }} 
          className={`w-full relative ${
            isInspectorEnabled ? 'ring-2 ring-red-500/80 bg-red-500/5 rounded-2xl p-4' : ''
          }`}
        >
          {isInspectorEnabled && (
            <MeasurementBadge
              label="Explore Container (RED)"
              widthPx={containerWidth}
              colorClass="text-red-400 border-red-500/40"
              bgClass="bg-red-950/90"
              position="top-right"
            />
          )}

          {/* COMPACT DYNAMIC EXPLORE HERO */}
          <div className="w-full max-w-3xl mx-auto text-center mb-8 px-2">
            {/* Dynamic Title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#F8FAFC] tracking-tight leading-tight mb-3">
              {heroContent.title}
            </h1>

            {/* Dynamic Description */}
            <p className="text-xs sm:text-sm text-[#A8B0C0] max-w-xl mx-auto leading-relaxed font-normal">
              {heroContent.description}
            </p>
          </div>

          {/* 3. UNIFIED SEARCH & FILTER BLOCK (620px Width, Centered, Single Visual Unit) */}
          <div className="w-full max-w-[620px] mx-auto mb-10 flex flex-col items-center gap-5 relative z-30">
            
            {/* SEARCH BAR COMPONENT (BLUE) */}
            <div 
              ref={searchRef}
              className={`w-full relative z-30 flex justify-center ${
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
                onChange={(q) => {
                  setSearchQuery(q);
                  updateUrlParams({ search: q || null });
                }}
                placeholder="جستجو در بین هزاران پرامپت..."
                buttonText="جستجو"
              />
            </div>

            {/* FILTER ROW SYSTEM (PURPLE) */}
            <div 
              ref={filtersRef}
              className={`w-full relative z-20 ${
                isInspectorEnabled ? 'ring-2 ring-purple-500/80 bg-purple-500/5 rounded-2xl p-2' : ''
              }`}
            >
              {isInspectorEnabled && (
                <MeasurementBadge
                  label="Filters Row (PURPLE)"
                  widthPx={filtersWidth}
                  colorClass="text-purple-400 border-purple-500/40"
                  bgClass="bg-purple-950/90"
                  position="top"
                />
              )}
              <div className="flex items-center gap-2 flex-wrap justify-center text-xs w-full">
              
                {/* 1. PRIMARY TOPIC FILTER PILL */}
                <div className="relative">
                  {!selectedTopic ? (
                    <button
                      onClick={() => toggleDropdown('topic')}
                      className={`h-[34px] px-3.5 rounded-[12px] text-xs font-medium inline-flex items-center justify-center cursor-pointer bg-[#282D38] border transition-all duration-200 ${
                        activeDropdown === 'topic'
                          ? 'border-[#D97757] text-[#F8FAFC]'
                          : 'border-[#3A4150] text-[#F8FAFC] hover:border-[#D97757]/60'
                      }`}
                    >
                      موضوع +
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleDropdown('topic')}
                      className="h-[34px] px-3.5 rounded-[12px] text-xs font-medium bg-[#282D38] border border-[#D97757] cursor-pointer inline-flex items-center transition-all duration-200"
                    >
                      <span className="text-[#A8B0C0]">موضوع</span>
                      <span className="w-[1px] h-[12px] bg-white/12 mx-[10px] inline-block shrink-0" />
                      <span className="text-[#D97757] font-semibold inline-flex items-center gap-1.5">
                        {activeTopicObj?.label || selectedTopic}
                        <ChevronDown size={12} className="text-[#D97757] inline-block shrink-0" />
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTopicChange(null);
                        }}
                        title="حذف فیلتر موضوع"
                        className="mr-2 p-0.5 rounded-[6px] text-[#A8B0C0] hover:text-[#D97757] hover:bg-[#D97757]/10 transition-all cursor-pointer inline-flex items-center justify-center shrink-0"
                      >
                        <X size={13} />
                      </span>
                    </button>
                  )}

                  {/* Topic Dropdown Menu */}
                  {activeDropdown === 'topic' && (
                    <div className="absolute top-[42px] right-0 w-[200px] bg-[#282D38] border border-[#3A4150] rounded-xl shadow-2xl z-50 p-2 space-y-2">
                      <input
                        type="text"
                        placeholder="جستجو موضوع..."
                        value={dropdownSearch}
                        onChange={(e) => setDropdownSearch(e.target.value)}
                        className="w-full h-8 bg-[#1C1F26] border border-[#3A4150] focus:border-[#D97757] rounded-lg px-2 text-xs text-[#F8FAFC] placeholder:text-[#A8B0C0] outline-none shrink-0"
                      />
                      <div className="flex-1 overflow-y-auto space-y-1 max-h-[220px]">
                        {TOPIC_ITEMS.filter((t) => t.label.includes(dropdownSearch)).map((t) => {
                          const isSelected = selectedTopic === t.id;
                          return (
                            <button
                              key={t.id}
                              onClick={() => {
                                handleTopicChange(isSelected ? null : t.id);
                                setActiveDropdown(null);
                              }}
                              className={`w-full text-right px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                                isSelected
                                  ? 'bg-[#D97757]/15 border border-[#D97757]/40 text-[#D97757] font-bold'
                                  : 'text-[#F8FAFC] hover:bg-[#1C1F26] hover:text-[#D97757]'
                              }`}
                            >
                              <span>{t.label}</span>
                              {isSelected && <span className="text-[#D97757]">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. CONTEXT-AWARE SUB-FILTERS BY PROMPT TYPE */}

                {/* CASE A: تولید تصویر (Image) */}
                {selectedTopic === 'image' && (
                  <>
                    {renderFilterPill(
                      'sub',
                      'موضوع',
                      selectedSub,
                      IMAGE_SUBJECT_ITEMS.find((s) => s.id === selectedSub)?.label,
                      IMAGE_SUBJECT_ITEMS,
                      setSelectedSub
                    )}
                    {renderFilterPill(
                      'style',
                      'سبک',
                      selectedStyle,
                      IMAGE_STYLE_ITEMS.find((s) => s.id === selectedStyle)?.label,
                      IMAGE_STYLE_ITEMS,
                      setSelectedStyle
                    )}
                    {renderFilterPill(
                      'model',
                      'مدل',
                      selectedModel,
                      IMAGE_MODEL_ITEMS.find((m) => m.id === selectedModel)?.label,
                      IMAGE_MODEL_ITEMS,
                      setSelectedModel
                    )}
                  </>
                )}

                {/* CASE B: تولید ویدیو (Video) */}
                {selectedTopic === 'video' && (
                  <>
                    {renderFilterPill(
                      'sub',
                      'موضوع',
                      selectedSub,
                      VIDEO_SUBJECT_ITEMS.find((s) => s.id === selectedSub)?.label,
                      VIDEO_SUBJECT_ITEMS,
                      setSelectedSub
                    )}
                    {renderFilterPill(
                      'style',
                      'سبک / فرم',
                      selectedStyle,
                      VIDEO_STYLE_ITEMS.find((s) => s.id === selectedStyle)?.label,
                      VIDEO_STYLE_ITEMS,
                      setSelectedStyle
                    )}
                    {renderFilterPill(
                      'model',
                      'مدل',
                      selectedModel,
                      VIDEO_MODEL_ITEMS.find((m) => m.id === selectedModel)?.label,
                      VIDEO_MODEL_ITEMS,
                      setSelectedModel
                    )}
                  </>
                )}

                {/* CASE C: برنامه‌نویسی (Programming / Code) — NO VISUAL STYLES */}
                {(selectedTopic === 'code' || selectedTopic === 'programming') && (
                  <>
                    {renderFilterPill(
                      'domain',
                      'حوزه',
                      selectedDomain,
                      CODE_DOMAIN_ITEMS.find((d) => d.id === selectedDomain)?.label,
                      CODE_DOMAIN_ITEMS,
                      setSelectedDomain
                    )}
                    {renderFilterPill(
                      'tech',
                      'زبان / فناوری',
                      selectedTech,
                      CODE_TECH_ITEMS.find((t) => t.id === selectedTech)?.label,
                      CODE_TECH_ITEMS,
                      setSelectedTech
                    )}
                    {renderFilterPill(
                      'task',
                      'نوع کار',
                      selectedTask,
                      CODE_TASK_ITEMS.find((t) => t.id === selectedTask)?.label,
                      CODE_TASK_ITEMS,
                      setSelectedTask
                    )}
                    {renderFilterPill(
                      'model',
                      'مدل',
                      selectedModel,
                      CODE_MODEL_ITEMS.find((m) => m.id === selectedModel)?.label,
                      CODE_MODEL_ITEMS,
                      setSelectedModel
                    )}
                  </>
                )}

                {/* CASE D: تولید محتوا (Content Creation / Text) — NO VISUAL STYLES */}
                {(selectedTopic === 'content' || selectedTopic === 'text') && (
                  <>
                    {renderFilterPill(
                      'type',
                      'نوع محتوا',
                      selectedType,
                      CONTENT_TYPE_ITEMS.find((t) => t.id === selectedType)?.label,
                      CONTENT_TYPE_ITEMS,
                      setSelectedType
                    )}
                    {renderFilterPill(
                      'goal',
                      'هدف',
                      selectedGoal,
                      CONTENT_GOAL_ITEMS.find((g) => g.id === selectedGoal)?.label,
                      CONTENT_GOAL_ITEMS,
                      setSelectedGoal
                    )}
                    {renderFilterPill(
                      'tone',
                      'لحن',
                      selectedTone,
                      CONTENT_TONE_ITEMS.find((t) => t.id === selectedTone)?.label,
                      CONTENT_TONE_ITEMS,
                      setSelectedTone
                    )}
                    {renderFilterPill(
                      'model',
                      'مدل',
                      selectedModel,
                      CONTENT_MODEL_ITEMS.find((m) => m.id === selectedModel)?.label,
                      CONTENT_MODEL_ITEMS,
                      setSelectedModel
                    )}
                  </>
                )}

                {/* CASE E: مارکتینگ (Marketing) — NO VISUAL STYLES */}
                {selectedTopic === 'marketing' && (
                  <>
                    {renderFilterPill(
                      'field',
                      'حوزه',
                      selectedField,
                      MARKETING_FIELD_ITEMS.find((f) => f.id === selectedField)?.label,
                      MARKETING_FIELD_ITEMS,
                      setSelectedField
                    )}
                    {renderFilterPill(
                      'goal',
                      'هدف',
                      selectedGoal,
                      MARKETING_GOAL_ITEMS.find((g) => g.id === selectedGoal)?.label,
                      MARKETING_GOAL_ITEMS,
                      setSelectedGoal
                    )}
                    {renderFilterPill(
                      'output',
                      'نوع خروجی',
                      selectedOutput,
                      MARKETING_OUTPUT_ITEMS.find((o) => o.id === selectedOutput)?.label,
                      MARKETING_OUTPUT_ITEMS,
                      setSelectedOutput
                    )}
                    {renderFilterPill(
                      'model',
                      'مدل',
                      selectedModel,
                      MARKETING_MODEL_ITEMS.find((m) => m.id === selectedModel)?.label,
                      MARKETING_MODEL_ITEMS,
                      setSelectedModel
                    )}
                  </>
                )}

                {/* CASE F: AUXILIARY TOPICS (Anime, Photography, Music) */}
                {selectedTopic && AUX_SUBCATEGORIES[selectedTopic] && (
                  <>
                    {renderFilterPill(
                      'sub',
                      'زیرمجموعه',
                      selectedSub,
                      AUX_SUBCATEGORIES[selectedTopic].find((s) => s.id === selectedSub)?.label,
                      AUX_SUBCATEGORIES[selectedTopic],
                      setSelectedSub
                    )}
                    {renderFilterPill(
                      'model',
                      'مدل',
                      selectedModel,
                      GENERAL_MODEL_ITEMS.find((m) => m.id === selectedModel)?.label,
                      GENERAL_MODEL_ITEMS,
                      setSelectedModel
                    )}
                  </>
                )}

                {/* CASE G: NO TOPIC SELECTED (General Explore) */}
                {!selectedTopic && (
                  <>
                    {renderFilterPill(
                      'model',
                      'مدل',
                      selectedModel,
                      GENERAL_MODEL_ITEMS.find((m) => m.id === selectedModel)?.label,
                      GENERAL_MODEL_ITEMS,
                      setSelectedModel
                    )}
                  </>
                )}

                {/* Vertical Divider separating Sort filter */}
                <div className="h-4 w-[1px] bg-[#3A4150] mx-1 shrink-0 self-center hidden sm:block" />

                {/* SORT FILTER PILL */}
                <div className="relative">
                  {selectedSort === 'newest' ? (
                    <button
                      onClick={() => toggleDropdown('sort')}
                      className={`h-[34px] px-3.5 rounded-[12px] text-xs font-medium inline-flex items-center justify-center cursor-pointer bg-[#282D38] border transition-all duration-200 ${
                        activeDropdown === 'sort'
                          ? 'border-[#D97757] text-[#F8FAFC]'
                          : 'border-[#3A4150] text-[#F8FAFC] hover:border-[#D97757]/60'
                      }`}
                    >
                      مرتب‌سازی +
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleDropdown('sort')}
                      className="h-[34px] px-3.5 rounded-[12px] text-xs font-medium bg-[#282D38] border border-[#D97757] cursor-pointer inline-flex items-center transition-all duration-200"
                    >
                      <span className="text-[#A8B0C0]">مرتب‌سازی</span>
                      <span className="w-[1px] h-[12px] bg-white/12 mx-[10px] inline-block shrink-0" />
                      <span className="text-[#D97757] font-semibold inline-flex items-center gap-1.5">
                        {SORT_ITEMS.find((s) => s.id === selectedSort)?.label}
                        <ChevronDown size={12} className="text-[#D97757] inline-block shrink-0" />
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSort('newest');
                          updateUrlParams({ sort: null });
                        }}
                        title="حذف فیلتر مرتب‌سازی"
                        className="mr-2 p-0.5 rounded-[6px] text-[#A8B0C0] hover:text-[#D97757] hover:bg-[#D97757]/10 transition-all cursor-pointer inline-flex items-center justify-center shrink-0"
                      >
                        <X size={13} />
                      </span>
                    </button>
                  )}

                  {activeDropdown === 'sort' && (
                    <div className="absolute top-[42px] right-0 w-[180px] bg-[#282D38] border border-[#3A4150] rounded-xl shadow-2xl z-50 p-2 space-y-1">
                      {SORT_ITEMS.map((s) => {
                        const isSelected = selectedSort === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => {
                              setSelectedSort(s.id);
                              updateUrlParams({ sort: s.id === 'newest' ? null : s.id });
                              setActiveDropdown(null);
                            }}
                            className={`w-full text-right px-2.5 py-1.5 text-xs rounded-lg transition-colors flex items-center justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-[#D97757]/15 border border-[#D97757]/40 text-[#D97757] font-bold'
                                : 'text-[#F8FAFC] hover:bg-[#1C1F26] hover:text-[#D97757]'
                            }`}
                          >
                            <span>{s.label}</span>
                            {isSelected && <span className="text-[#D97757]">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* GLOBAL RESET BUTTON */}
                {activeFiltersCount >= 1 && (
                  <button
                    onClick={() => {
                      handleTopicChange(null);
                      setSelectedSort('newest');
                      setSearchQuery('');
                      setActiveDropdown(null);
                      updateUrlParams({
                        topic: null,
                        sub: null,
                        style: null,
                        domain: null,
                        tech: null,
                        task: null,
                        type: null,
                        goal: null,
                        tone: null,
                        field: null,
                        output: null,
                        model: null,
                        sort: null,
                        search: null,
                      });
                    }}
                    title="پاک کردن همه فیلترها"
                    className="h-[34px] px-2.5 rounded-[12px] bg-transparent border border-white/10 text-[#A8B0C0] hover:text-[#D97757] hover:border-[#D97757] hover:bg-[#D97757]/10 transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-1 font-medium shrink-0"
                  >
                    <X size={15} />
                    <span>بازنشانی</span>
                  </button>
                )}

              </div>
            </div>
          </div>
        </div>

        {/* PROMPT CARD GRID RESULTS (Master PromptCard v1.0 Frozen Component) */}
        <div className="w-full pt-6">
          {filteredPrompts.length === 0 ? (
            <div className="text-center py-16 bg-[#282D38] border border-[#3A4150] rounded-2xl p-8 space-y-3">
              <p className="text-sm text-[#A8B0C0]">هیچ پرامپتی با فیلترهای انتخابی یافت نشد.</p>
              <button
                onClick={() => {
                  handleTopicChange(null);
                  setSelectedSort('newest');
                  setSearchQuery('');
                  updateUrlParams({
                    topic: null,
                    sub: null,
                    style: null,
                    domain: null,
                    tech: null,
                    task: null,
                    type: null,
                    goal: null,
                    tone: null,
                    field: null,
                    output: null,
                    model: null,
                    sort: null,
                    search: null,
                  });
                }}
                className="inline-block px-4 py-2 bg-[#D97757] text-white rounded-xl text-xs font-bold hover:bg-[#E58A66] transition-all cursor-pointer"
              >
                بازنشانی جستجو و فیلترها
              </button>
            </div>
          ) : (
            <>
              {/* Frozen Prompt Grid Layout (270x350 Cards, Gap 32px, 4-5-6 Columns) */}
              <div id="js-explore-grid-container" className="pj-prompt-grid">
                {displayedPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    prompt={prompt}
                    onCopy={onCopyPrompt}
                    isCopied={copiedPromptId === prompt.id}
                    onBookmarkToggle={onBookmarkToggle}
                    onOpenModal={onOpenPromptModal}
                  />
                ))}
              </div>

              {/* Load More System */}
              <div id="js-explore-load-more-wrapper" className="mt-12 flex flex-col items-center justify-center gap-3">
                {hasMore ? (
                  <button
                    id="js-explore-load-more"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="h-11 px-8 rounded-2xl bg-[#282D38] border border-[#3A4150] text-[#F8FAFC] hover:border-[#D97757] hover:text-[#D97757] transition-all duration-200 text-xs font-bold shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                  filteredPrompts.length > 0 && (
                    <div className="px-6 py-2.5 rounded-xl bg-[#282D38]/50 border border-[#3A4150]/50 text-xs font-semibold text-[#A8B0C0] select-none">
                      همه پرامپت‌ها نمایش داده شدند
                    </div>
                  )
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
