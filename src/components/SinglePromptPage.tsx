import React, { useState, useMemo } from 'react';
import { PromptItemData, CategoryCardData, PromptComment, CommentReply, UserRole, UserProfile, PromptFeatureToggles } from '../types';
import { PromptCard } from './PromptCard';
import { DEFAULT_USAGE_GUIDES, INITIAL_COMMENTS } from '../data/singlePromptData';
import {
  Copy,
  Check,
  Heart,
  Bookmark,
  Share2,
  Maximize2,
  X,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MessageSquare,
  Flag,
  Pin,
  CornerDownLeft,
  GraduationCap,
  Newspaper,
  Lock,
  Eye,
  Layers,
  Cpu,
  Globe2,
  Gauge,
  FileText,
  FileCode2,
  Play,
  CheckCircle2,
  AlertCircle,
  Crown,
  Medal,
  Award,
  Compass,
  Trophy,
  Star,
  SlidersHorizontal,
  RefreshCw,
  ShieldCheck,
  ShieldAlert,
  Terminal,
  Zap,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { WatermarkPosition } from './SinglePromptVariantSwitcher';

export type SinglePromptVariant = 'image' | 'standard';
export type ImageAspectRatio = '16:9' | '1:1' | '9:16';

export interface SinglePromptSpecItem {
  label: string;
  value: string;
}

export interface SinglePromptContextMeta {
  contextType: 'image' | 'video' | 'programming' | 'content' | 'marketing' | 'general';
  contextLabel: string;
  specs: SinglePromptSpecItem[];
}

export function getSinglePromptContextMeta(prompt: PromptItemData): SinglePromptContextMeta {
  const cat = (prompt.category || '').toLowerCase();
  const title = (prompt.title || '').toLowerCase();
  const desc = (prompt.description || '').toLowerCase();
  const tags = (prompt.tags || []).map((t) => t.toLowerCase());
  const allText = `${cat} ${title} ${desc} ${tags.join(' ')}`;

  // 1. VIDEO CONTEXT
  if (cat.includes('ویدیو') || cat.includes('ویدئو') || cat.includes('video') || prompt.isVideo) {
    let topic = prompt.subcategory || '';
    if (!topic) {
      if (allText.includes('تبلیغ') || allText.includes('commercial')) topic = 'تبلیغاتی و تیزر';
      else if (allText.includes('سوشال') || allText.includes('اینستا') || allText.includes('social')) topic = 'سوشال مدیا و ریلز';
      else if (allText.includes('طبیعت') || allText.includes('منظره') || allText.includes('nature')) topic = 'طبیعت و محیط زیست';
      else if (allText.includes('انیمیشن') || allText.includes('سه بعدی') || allText.includes('3d')) topic = 'انیمیشن و سه‌بعدی';
      else topic = 'سینمایی و روایی';
    }

    let style = '';
    if (allText.includes('موشن') || allText.includes('motion')) style = 'موشن گرافیک و تایپوگرافی';
    else if (allText.includes('تیزر') || allText.includes('teaser')) style = 'تیزر تبلیغاتی سریع';
    else if (allText.includes('مستند') || allText.includes('documentary')) style = 'مستند و رئال';
    else if (allText.includes('اسلو') || allText.includes('slow motion')) style = 'اسلو موشن و سینمایی';
    else if (allText.includes('سایبرپانک') || allText.includes('cyberpunk')) style = 'سینمایی سایبرپانک و نئون';
    else style = 'سینمایی با عمق میدان بالا';

    const specs: SinglePromptSpecItem[] = [
      { label: 'موضوع', value: topic },
      { label: 'فرم / سبک', value: style },
    ];
    if (prompt.outputFormat) {
      specs.push({ label: 'نوع خروجی', value: prompt.outputFormat });
    }

    return {
      contextType: 'video',
      contextLabel: 'تولید ویدیو',
      specs,
    };
  }

  // 2. PROGRAMMING CONTEXT
  if (cat.includes('برنامه') || cat.includes('کد') || cat.includes('coding') || cat.includes('programming') || cat.includes('توسعه')) {
    let domain = '';
    if (allText.includes('فرانت') || allText.includes('frontend') || allText.includes('react') || allText.includes('vue')) domain = 'فرانت‌اند (Frontend)';
    else if (allText.includes('داده') || allText.includes('data') || allText.includes('هوش') || allText.includes('ai')) domain = 'علم داده و هوش مصنوعی';
    else if (allText.includes('دیتابیس') || allText.includes('database') || allText.includes('sql')) domain = 'پایگاه داده و معماری داده';
    else if (allText.includes('موبایل') || allText.includes('mobile') || allText.includes('flutter')) domain = 'توسعه موبایل';
    else if (allText.includes('دوآپس') || allText.includes('devops') || allText.includes('docker')) domain = 'دوآپس و زیرساخت';
    else domain = 'بک‌اند و اسکریپت‌نویسی';

    let tech = '';
    if (allText.includes('پایتون') || allText.includes('python') || allText.includes('pandas')) tech = 'Python / Pandas / Seaborn';
    else if (allText.includes('تایپ') || allText.includes('typescript')) tech = 'TypeScript / Node.js';
    else if (allText.includes('جاوا') || allText.includes('javascript') || allText.includes('js')) tech = 'JavaScript / React';
    else if (allText.includes('پی اچ پی') || allText.includes('php') || allText.includes('laravel')) tech = 'PHP / Laravel / WordPress';
    else if (allText.includes('sql') || allText.includes('پستگرس')) tech = 'PostgreSQL / SQL';
    else tech = prompt.outputFormat || 'Python / JavaScript';

    let task = '';
    if (allText.includes('تحلیل') || allText.includes('analysis')) task = 'تحلیل داده و پردازش آماری';
    else if (allText.includes('باگ') || allText.includes('debug') || allText.includes('اشکال')) task = 'رفع باگ و اشکال‌زدایی';
    else if (allText.includes('ریفکتور') || allText.includes('refactor') || allText.includes('بهینه')) task = 'ریفکتور و بهینه‌سازی کد';
    else if (allText.includes('ریویو') || allText.includes('review')) task = 'کد ریویو و امنیت';
    else if (allText.includes('تست') || allText.includes('test')) task = 'تست‌نویسی و QA';
    else task = 'توسعه ویژگی و پیاده‌سازی لاجیک';

    return {
      contextType: 'programming',
      contextLabel: 'برنامه‌نویسی',
      specs: [
        { label: 'حوزه', value: domain },
        { label: 'فناوری', value: tech },
        { label: 'نوع کار', value: task },
      ],
    };
  }

  // 3. CONTENT CREATION CONTEXT
  if (cat.includes('محتوا') || cat.includes('content') || cat.includes('متن') || cat.includes('نویسندگی') || cat.includes('سئو')) {
    let contentType = prompt.subcategory || '';
    if (!contentType) {
      if (allText.includes('یوتیوب') || allText.includes('اسکریپت') || allText.includes('فیلم‌نامه') || allText.includes('script')) contentType = 'اسکریپت ویدیو و یوتیوب';
      else if (allText.includes('سئو') || allText.includes('مقاله') || allText.includes('article') || allText.includes('blog')) contentType = 'مقاله سئو و بلاگ‌پست';
      else if (allText.includes('کپشن') || allText.includes('اینستا') || allText.includes('caption')) contentType = 'کپشن سوشال مدیا';
      else if (allText.includes('ایمیل') || allText.includes('خبرنامه') || allText.includes('newsletter')) contentType = 'خبرنامه و ایمیل مستقیم';
      else contentType = 'تولید متن خلاقانه';
    }

    let goal = '';
    if (allText.includes('سئو') || allText.includes('رتبه') || allText.includes('گوگل')) goal = 'افزایش ورودی ارگانیک سئو';
    else if (allText.includes('فروش') || allText.includes('اقدام') || allText.includes('تبدیل')) goal = 'متقاعدسازی و فروش';
    else if (allText.includes('آموزش') || allText.includes('راهنما')) goal = 'آموزش گام‌به‌گام و راهنمایی';
    else goal = 'افزایش واچ‌تایم و تعامل مخاطب';

    let tone = '';
    if (allText.includes('صمیمی') || allText.includes('دوستانه')) tone = 'صمیمی، پرانرژی و روان';
    else if (allText.includes('رسمی') || allText.includes('تخصصی') || allText.includes('آکادمیک')) tone = 'تخصصی، دقیق و رسمی';
    else if (allText.includes('داستانی') || allText.includes('قصه')) tone = 'روایی و داستانی جذاب';
    else if (allText.includes('طنز') || allText.includes('شوخ')) tone = 'طنزآمیز و گیرا';
    else tone = 'حرفه‌ای، جذاب و متقاعدکننده';

    return {
      contextType: 'content',
      contextLabel: 'تولید محتوا',
      specs: [
        { label: 'نوع محتوا', value: contentType },
        { label: 'هدف', value: goal },
        { label: 'لحن', value: tone },
      ],
    };
  }

  // 4. MARKETING CONTEXT
  if (cat.includes('مارکت') || cat.includes('marketing') || cat.includes('تبلیغ') || cat.includes('فروش') || cat.includes('کمپین')) {
    let field = '';
    if (allText.includes('کمپین') || allText.includes('استراتژی') || allText.includes('strategy')) field = 'استراتژی کمپین و رشد';
    else if (allText.includes('اینستا') || allText.includes('سوشال') || allText.includes('social')) field = 'سوشال مدیا مارکتینگ';
    else if (allText.includes('ایمیل') || allText.includes('email')) field = 'ایمیل مارکتینگ و اتومیشن';
    else if (allText.includes('قیف') || allText.includes('funnel') || allText.includes('لندینگ')) field = 'قیف فروش و صفحات فرود';
    else field = 'تبلیغات آنلاین و دیجیتال مارکتینگ';

    let goal = '';
    if (allText.includes('لید') || allText.includes('lead')) goal = 'تولید سرنخ فروش (Lead Gen)';
    else if (allText.includes('فروش') || allText.includes('تبدیل') || allText.includes('conversion')) goal = 'افزایش نرخ تبدیل و فروش مستقیم';
    else if (allText.includes('برند') || allText.includes('آگاهی') || allText.includes('awareness')) goal = 'آگاهی از برند و جایگاه‌سازی';
    else goal = 'درگیرسازی مخاطب و افزایش فروش';

    let outputType = '';
    if (allText.includes('استراتژی') || allText.includes('پلن') || allText.includes('plan')) outputType = 'سند جامع استراتژی و تقویم';
    else if (allText.includes('کپی') || allText.includes('متن تبلیغ') || allText.includes('copy')) outputType = 'کپی‌رایتینگ تبلیغاتی و CTA';
    else if (allText.includes('سناریو') || allText.includes('سناریوی فروش')) outputType = 'سناریوی فروش و اسکریپت پرزنت';
    else outputType = prompt.outputFormat || 'سناریو و متن کمپین';

    return {
      contextType: 'marketing',
      contextLabel: 'مارکتینگ',
      specs: [
        { label: 'حوزه', value: field },
        { label: 'هدف', value: goal },
        { label: 'نوع خروجی', value: outputType },
      ],
    };
  }

  // 5. IMAGE GENERATION CONTEXT
  let imgTopic = prompt.subcategory || '';
  if (!imgTopic) {
    if (allText.includes('پرتره') || allText.includes('چهره') || allText.includes('portrait')) imgTopic = 'پرتره و کاراکتر';
    else if (allText.includes('لوگو') || allText.includes('آیکون') || allText.includes('logo')) imgTopic = 'لوگو و آیکونگرافی';
    else if (allText.includes('معماری') || allText.includes('دکوراسیون') || allText.includes('architecture')) imgTopic = 'معماری و طراحی داخلی';
    else if (allText.includes('منظره') || allText.includes('طبیعت') || allText.includes('landscape')) imgTopic = 'منظره و محیط طبیعی';
    else if (allText.includes('محصول') || allText.includes('product')) imgTopic = 'عکاسی تبلیغاتی محصول';
    else imgTopic = 'کانسپت آرت و تصویرسازی';
  }

  let imgStyle = '';
  if (allText.includes('مینیمال') || allText.includes('minimal')) imgStyle = 'مینیمال و مدرن';
  else if (allText.includes('سه‌بعدی') || allText.includes('سه بعدی') || allText.includes('3d') || allText.includes('octane') || allText.includes('blender')) imgStyle = 'رندر سه‌بعدی و اکتان';
  else if (allText.includes('انیمه') || allText.includes('anime')) imgStyle = 'انیمه و مانگا ژاپنی';
  else if (allText.includes('سایبرپانک') || allText.includes('نئون') || allText.includes('cyberpunk')) imgStyle = 'سایبرپانک و نورپردازی نئونی';
  else if (allText.includes('فانتزی') || allText.includes('fantasy')) imgStyle = 'فانتزی و تصویرسازی دیجیتال';
  else if (allText.includes('رئال') || allText.includes('واقع') || allText.includes('photorealistic')) imgStyle = 'فوتورئالیستیک و عکاسی واقعی';
  else imgStyle = 'سینمایی، پرجزئیات و شارپ';

  const imgSpecs: SinglePromptSpecItem[] = [
    { label: 'موضوع', value: imgTopic },
    { label: 'سبک', value: imgStyle },
  ];
  if (prompt.outputFormat) {
    imgSpecs.push({ label: 'نوع خروجی', value: prompt.outputFormat });
  }

  return {
    contextType: 'image',
    contextLabel: 'تولید تصویر',
    specs: imgSpecs,
  };
}

interface SinglePromptPageProps {
  prompt: PromptItemData;
  allPrompts: PromptItemData[];
  categories: CategoryCardData[];
  onSelectPrompt: (prompt: PromptItemData) => void;
  onNavigateHome: () => void;
  onNavigateExplore: (categorySlug?: string, tag?: string) => void;
  onCopyPrompt: (promptText: string, title: string) => void;
  copiedPromptId: string | null;
  onBookmarkToggle: (promptId: string) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  variant?: SinglePromptVariant;
  aspectRatio?: ImageAspectRatio;
  featureToggles?: PromptFeatureToggles;
  isWatermarkEnabled?: boolean;
  watermarkPosition?: WatermarkPosition;
}

export const SinglePromptPage: React.FC<SinglePromptPageProps> = ({
  prompt,
  allPrompts,
  categories: _categories,
  onSelectPrompt,
  onNavigateHome,
  onNavigateExplore,
  onCopyPrompt,
  copiedPromptId,
  onBookmarkToggle,
  onShowToast,
  variant = 'image',
  aspectRatio = '16:9',
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
    model: true,
    language: true,
    stats: true,
    tags: true,
    comments: true,
  },
  isWatermarkEnabled = true,
  watermarkPosition = 'bottom-right',
}) => {
  // Lightbox Modal state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Like in Hero state
  const [likesCount, setLikesCount] = useState<number>(() => {
    const raw = prompt.likes;
    if (typeof raw === 'number') return raw;
    if (typeof raw === 'string') return parseInt(raw.replace(/[^\d]/g, ''), 10) || 124;
    return 124;
  });
  const [isHeroLiked, setIsHeroLiked] = useState(false);

  // Expand/Collapse on Long Prompt
  const [isPromptExpanded, setIsPromptExpanded] = useState(false);

  // Variables interactive form values state
  const [customVariableValues, setCustomVariableValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (prompt.variables && prompt.variables.length > 0) {
      prompt.variables.forEach((v) => {
        initial[v.key] = v.defaultValue;
      });
    }
    return initial;
  });

  // Comments state
  const [comments, setComments] = useState<PromptComment[]>(() => {
    return INITIAL_COMMENTS[prompt.id] || INITIAL_COMMENTS['p1'] || [];
  });
  const [newCommentText, setNewCommentText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [commentFeedback, setCommentFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Visible comments pagination
  const [visibleCommentsCount, setVisibleCommentsCount] = useState(4);

  // User auth state toggle for testing Member vs Guest
  const [isMemberLoggedIn, setIsMemberLoggedIn] = useState(true);

  // Report Modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [_reportingTargetId, setReportingTargetId] = useState<string | null>(null);
  const [selectedReportReason, setSelectedReportReason] = useState('محتوای نامناسب');
  const [reportOtherText, setReportOtherText] = useState('');

  // Guide data for the current prompt
  const guide = useMemo(() => {
    return DEFAULT_USAGE_GUIDES[prompt.id] || DEFAULT_USAGE_GUIDES['default'];
  }, [prompt.id]);

  // Related Prompts (4 cards, same category or others from allPrompts)
  const relatedPrompts = useMemo(() => {
    const sameCategory = allPrompts.filter((p) => p.id !== prompt.id && p.category === prompt.category);
    if (sameCategory.length >= 4) return sameCategory.slice(0, 4);
    const others = allPrompts.filter((p) => p.id !== prompt.id && !sameCategory.includes(p));
    return [...sameCategory, ...others].slice(0, 4);
  }, [allPrompts, prompt]);

  // Check if prompt text is English / Code
  const isEnglishPrompt = useMemo(() => {
    return /^[\x00-\x7F\s\p{P}]+$/u.test(prompt.fullPromptText.slice(0, 80));
  }, [prompt.fullPromptText]);

  // Context-Aware Metadata for Single Prompt Hero
  const contextMeta = useMemo(() => {
    return getSinglePromptContextMeta(prompt);
  }, [prompt]);

  // Calculate live generated prompt text based on customized variables
  const customizedPromptText = useMemo(() => {
    let result = prompt.fullPromptText;
    if (prompt.variables && prompt.variables.length > 0) {
      prompt.variables.forEach((v) => {
        const val = customVariableValues[v.key] || v.defaultValue;
        const regex = new RegExp(`\\[${v.key}\\]`, 'g');
        result = result.replace(regex, val);
      });
    }
    return result;
  }, [prompt.fullPromptText, prompt.variables, customVariableValues]);

  // Check if prompt is Paid / Premium variant
  const isPaidPrompt = useMemo(() => {
    if (prompt.isFree === false) return true;
    if (prompt.paidAccess && prompt.paidAccess.isPaid) return true;
    if (typeof prompt.price === 'number' && prompt.price > 0) return true;
    return false;
  }, [prompt.isFree, prompt.paidAccess, prompt.price]);

  const paidPrice = prompt.paidAccess?.price || prompt.price || 299000;
  const paidCurrency = prompt.paidAccess?.currency || prompt.currency || 'تومان';
  const formattedPaidPrice = paidPrice.toLocaleString('fa-IR');

  // Handle Like in Hero
  const handleHeroLike = () => {
    if (isHeroLiked) {
      setLikesCount((prev) => Math.max(0, prev - 1));
      setIsHeroLiked(false);
      onShowToast('پسندیدن پرامپت لغو شد.', 'info');
    } else {
      setLikesCount((prev) => prev + 1);
      setIsHeroLiked(true);
      onShowToast('پرامپت پسندیده شد.', 'success');
    }
  };

  // Handle Save in Hero
  const handleHeroSave = () => {
    if (!isMemberLoggedIn) {
      onShowToast('برای این کار عضو PromptJo شوید.', 'info');
      return;
    }
    onBookmarkToggle(prompt.id);
    if (!prompt.isBookmarked) {
      onShowToast('پرامپت ذخیره شد.', 'success');
    } else {
      onShowToast('پرامپت از ذخیره‌ها حذف شد.', 'info');
    }
  };

  // Handle Share in Hero
  const handleHeroShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: prompt.title,
          text: prompt.description,
          url: window.location.href,
        });
        onShowToast('لینک پرامپت کپی شد.', 'success');
        return;
      } catch (e) {
        // Fallback
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      onShowToast('لینک پرامپت کپی شد.', 'success');
    } catch (err) {
      onShowToast('لینک پرامپت کپی شد.', 'info');
    }
  };

  // Highlight variables like [نام متغیر] inline inside continuous natural text flow
  const renderHighlightedPromptText = (text: string) => {
    const parts = text.split(/(\[[^\]]+\])/g);
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        const cleanKey = part.slice(1, -1);
        const customVal = customVariableValues[cleanKey];
        return (
          <span
            key={index}
            className="inline-block mx-1 px-2 py-0.5 rounded-md bg-[#D97757]/20 border border-[#D97757]/40 text-[#E58A66] font-bold text-[0.94em] select-all cursor-help"
            title={`متغیر قابل شخصی‌سازی: ${customVal ? `مقدار فعلی: ${customVal}` : 'با مقدار دلخواه جایگزین کنید'}`}
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Role Badge Helper
  const renderRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'استاد':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <span>استاد</span>
            <Crown className="w-2.5 h-2.5" />
          </span>
        );
      case 'متخصص':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-500/15 border border-purple-500/30 text-purple-400">
            <span>متخصص</span>
            <Medal className="w-2.5 h-2.5" />
          </span>
        );
      case 'فعال':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/15 border border-blue-500/30 text-blue-400">
            <span>فعال</span>
            <Star className="w-2.5 h-2.5" />
          </span>
        );
      case 'کاوشگر':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <span>کاوشگر</span>
            <Compass className="w-2.5 h-2.5" />
          </span>
        );
    }
  };

  // Handle Submit Comment
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) {
      setCommentFeedback({
        type: 'error',
        message: 'ارسال دیدگاه انجام نشد. لطفاً دوباره تلاش کنید.',
      });
      return;
    }

    if (!isMemberLoggedIn) {
      setCommentFeedback({
        type: 'error',
        message: 'ارسال دیدگاه انجام نشد. لطفاً دوباره تلاش کنید.',
      });
      return;
    }

    setNewCommentText('');
    setCommentFeedback({
      type: 'success',
      message: 'دیدگاه شما دریافت شد و پس از تأیید منتشر می‌شود.',
    });
  };

  // Handle Reply Submit
  const handleReplySubmit = (commentId: string) => {
    if (!replyText.trim()) return;

    if (!isMemberLoggedIn) {
      onShowToast('برای این کار عضو PromptJo شوید.', 'info');
      return;
    }

    const newReply: CommentReply = {
      id: `r_${Date.now()}`,
      user: {
        id: 'u_current',
        name: 'شما (کاربر پرامپت‌جو)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        role: 'فعال',
        bio: 'عضو جامعه پرامپت‌نویسان و پژوهشگران هوش مصنوعی.',
        interest: 'تولید محتوا · پرامپت‌های خلاقانه',
      },
      relativeDate: 'همین الان',
      content: replyText.trim(),
      likes: 0,
      isLiked: false,
    };

    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return { ...c, replies: [...(c.replies || []), newReply] };
        }
        return c;
      })
    );

    setReplyText('');
    setActiveReplyId(null);
    onShowToast('پاسخ شما ثبت شد.', 'success');
  };

  // Handle Like Comment
  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          const likes = isLiked ? c.likes + 1 : Math.max(0, c.likes - 1);
          return { ...c, isLiked, likes };
        }
        return c;
      })
    );
    onShowToast('لایک شما ثبت شد.', 'success');
  };

  // Handle Send Report
  const handleSendReport = () => {
    setIsReportModalOpen(false);
    setReportingTargetId(null);
    setReportOtherText('');
    setSelectedReportReason('محتوای نامناسب');
    onShowToast('گزارش شما دریافت شد و پس از بررسی تیم PromptJo اقدام خواهد شد.', 'success');
  };

  // Automatic Best Answer & Sorting Logic
  const sortedComments = useMemo(() => {
    if (comments.length === 0) return [];

    const scored = comments.map((c) => {
      const score = (c.likes || 0) + ((c.replies?.length || 0) * 2);
      return { ...c, calculatedScore: score };
    });

    let maxScore = -1;
    let bestId = '';
    scored.forEach((c) => {
      if (c.calculatedScore > maxScore && c.calculatedScore >= 8) {
        maxScore = c.calculatedScore;
        bestId = c.id;
      }
    });

    const finalized = scored.map((c) => {
      const isAutoBest = c.id === bestId || c.isBestAnswer;
      return { ...c, isBestAnswer: isAutoBest };
    });

    return finalized.sort((a, b) => {
      if (b.isPinned !== a.isPinned) return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
      if (b.isBestAnswer !== a.isBestAnswer) return (b.isBestAnswer ? 1 : 0) - (a.isBestAnswer ? 1 : 0);
      return b.calculatedScore - a.calculatedScore;
    });
  }, [comments]);

  const displayedComments = useMemo(() => {
    return sortedComments.slice(0, visibleCommentsCount);
  }, [sortedComments, visibleCommentsCount]);

  return (
    <div className="w-full bg-[#1C1F26] text-[#F8FAFC] min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* BREADCRUMB */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-slate-400 font-medium overflow-x-auto whitespace-nowrap py-1 border-b border-[#3A4150]/40 pb-3"
        >
          <button
            onClick={onNavigateHome}
            className="hover:text-[#D97757] transition-colors flex items-center gap-1"
          >
            <span>خانه</span>
          </button>
          <span className="text-slate-600">/</span>
          <button
            onClick={() => onNavigateExplore()}
            className="hover:text-[#D97757] transition-colors"
          >
            پرامپت‌ها
          </button>
          <span className="text-slate-600">/</span>
          <button
            onClick={() => onNavigateExplore(prompt.category)}
            className="hover:text-[#D97757] transition-colors"
          >
            {prompt.category || 'تولید تصویر'}
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-slate-200 font-semibold truncate max-w-[200px] sm:max-w-none">
            {prompt.title}
          </span>
        </nav>

        {/* ======================================================== */}
        {/* ONE UNIFIED SINGLE PROMPT SURFACE CONTAINER              */}
        {/* Contains: 1. Hero, 2. Prompt + Guide, 3. Variables Form, */}
        {/*           4. Negative Prompt & Tech Params, 5. Tags      */}
        {/* ======================================================== */}
        <article className="single-prompt-surface bg-[#232833] rounded-[24px] border border-[#3A4150] shadow-xl overflow-hidden p-5 sm:p-6 lg:p-7 space-y-6 sm:space-y-7 text-right">
          
          {/* SECTION 1: HERO */}
          <div className="single-prompt-hero">
            {variant === 'image' ? (
              /* ================= IMAGE-FIRST HERO ================= */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                
                {/* RIGHT COLUMN (Desktop): Title, Description, Metadata, Stats, Interaction Bar */}
                <div className="lg:col-span-5 flex flex-col justify-between space-y-4 order-2 lg:order-1 text-right">
                  <div className="space-y-2.5">
                    {/* TITLE */}
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight tracking-tight">
                      {prompt.title}
                    </h1>

                    {/* DESCRIPTION */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {prompt.description}
                    </p>
                  </div>

                  {/* PRIMARY BASIC ACCESS & METADATA CHIPS (Model, Language, VIP/Free, Difficulty) */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-0.5 text-xs text-slate-300">
                    {/* VIP / Paid vs Free Access Badge */}
                    {isPaidPrompt ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300 font-extrabold text-xs shadow-sm">
                        <Lock size={13} className="text-amber-400" />
                        <span>پرامپت ویژه — {formattedPaidPrice} {paidCurrency}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span>دسترسی: رایگان</span>
                      </div>
                    )}

                    {/* AI Model Chip (Supports multi-model badge wrapping with clean layout) */}
                    {featureToggles.model && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1C1F26] border border-[#3A4150] text-slate-200">
                        <Cpu size={14} className="text-[#D97757] shrink-0" />
                        <span className="text-slate-400 font-medium text-xs shrink-0">مدل:</span>
                        {prompt.compatibleModels && prompt.compatibleModels.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {prompt.compatibleModels.map((m, mIdx) => (
                              <span key={mIdx} className="font-bold text-xs">
                                {m}{mIdx < (prompt.compatibleModels?.length || 1) - 1 ? '،' : ''}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="font-bold text-xs">{prompt.aiModel || 'هوش مصنوعی'}</span>
                        )}
                      </div>
                    )}

                    {/* Language Chip */}
                    {featureToggles.language && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1C1F26] border border-[#3A4150] text-slate-200">
                        <Globe2 size={14} className="text-blue-400 shrink-0" />
                        <span className="text-slate-400 font-medium text-xs shrink-0">زبان:</span>
                        <span className="font-bold text-xs">
                          {prompt.language || (/^[\x00-\x7F\s\p{P}]+$/u.test(prompt.fullPromptText.slice(0, 80)) ? 'انگلیسی' : 'فارسی')}
                        </span>
                      </div>
                    )}

                    {/* Difficulty */}
                    {featureToggles.difficulty && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1C1F26] border border-[#3A4150] text-slate-200">
                        <Gauge size={14} className="text-amber-400 shrink-0" />
                        <span className="text-slate-400 font-medium text-xs shrink-0">سطح:</span>
                        <span className="font-bold text-xs">{prompt.level || 'متوسط'}</span>
                      </div>
                    )}
                  </div>

                  {/* CONTEXT-AWARE METADATA (Domain-specific: Topic, Style, Task, Output, etc.) */}
                  {contextMeta.specs.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <span className="text-[#D97757]">✦</span>
                        <span>مشخصات پرامپت</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300">
                        {contextMeta.specs.map((spec, sIdx) => {
                          let icon = <Layers size={14} className="text-teal-400 shrink-0" />;
                          if (spec.label.includes('سبک') || spec.label.includes('لحن')) icon = <Sparkles size={14} className="text-purple-400 shrink-0" />;
                          else if (spec.label.includes('فناوری') || spec.label.includes('خروجی')) icon = <FileCode2 size={14} className="text-emerald-400 shrink-0" />;
                          else if (spec.label.includes('هدف') || spec.label.includes('کار')) icon = <Zap size={14} className="text-amber-400 shrink-0" />;

                          return (
                            <div key={sIdx} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1C1F26] border border-[#3A4150] text-slate-200">
                              {icon}
                              <span className="text-slate-400 font-medium text-xs">{spec.label}:</span>
                              <span className="font-bold text-xs">{spec.value}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STATS ROW (Rendered ONLY if stats enabled) */}
                  {featureToggles.stats && (
                    <div className="flex items-center gap-3.5 pt-4 text-xs text-slate-400">
                      {prompt.views && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1C1F26]/70 border border-[#3A4150]/60 text-slate-300 text-xs">
                          <Eye size={14} className="text-slate-400" />
                          <span>{prompt.views} بازدید</span>
                        </div>
                      )}

                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1C1F26]/70 border border-[#3A4150]/60 text-slate-300 text-xs">
                        <Heart size={14} className="text-slate-400" />
                        <span>{likesCount.toLocaleString('fa-IR')} پسندیده شده</span>
                      </div>
                    </div>
                  )}

                  {/* INTERACTION BUTTONS */}
                  <div className="flex items-center gap-3 pt-4">
                    {/* LIKE */}
                    <button
                      onClick={handleHeroLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all ${
                        isHeroLiked
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                          : 'bg-[#1C1F26] text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 border border-[#3A4150]'
                      }`}
                      title="پسندیدن پرامپت"
                    >
                      <Heart size={15} className={isHeroLiked ? 'fill-current text-rose-400' : ''} />
                      <span>{isHeroLiked ? 'پسندیده شد' : 'لایک'}</span>
                    </button>

                    {/* SAVE */}
                    <button
                      onClick={handleHeroSave}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all ${
                        prompt.isBookmarked
                          ? 'bg-[#D97757]/20 text-[#D97757] border border-[#D97757]/40 shadow-sm'
                          : 'bg-[#1C1F26] text-slate-300 hover:text-[#D97757] hover:bg-[#D97757]/10 hover:border-[#D97757]/40 border border-[#3A4150]'
                      }`}
                      title="ذخیره پرامپت"
                    >
                      <Bookmark size={15} className={prompt.isBookmarked ? 'fill-current text-[#D97757]' : ''} />
                      <span>{prompt.isBookmarked ? 'ذخیره شده' : 'ذخیره پرامپت'}</span>
                    </button>

                    {/* SHARE */}
                    <button
                      onClick={handleHeroShare}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-bold bg-[#1C1F26] text-slate-300 hover:text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/40 border border-[#3A4150] transition-all"
                      title="اشتراک‌گذاری پرامپت"
                    >
                      <Share2 size={15} />
                      <span>اشتراک‌گذاری</span>
                    </button>
                  </div>
                </div>

                {/* LEFT COLUMN (Desktop): ADAPTIVE LARGE IMAGE PREVIEW */}
                <div className="lg:col-span-7 order-1 lg:order-2 flex items-center justify-center w-full">
                  <div
                    data-hero-image-stage="true"
                    className={`relative w-full rounded-[20px] bg-[#14171F] border border-[#3A4150] shadow-2xl p-2.5 sm:p-3.5 flex items-center justify-center overflow-hidden transition-all duration-300 group hover:border-[#D97757] hover:shadow-[0_0_30px_rgba(217,119,87,0.25)] ${
                      aspectRatio === '9:16'
                        ? 'h-[500px] sm:h-[560px] lg:h-[590px]'
                        : aspectRatio === '1:1'
                        ? 'h-[440px] sm:h-[490px] lg:h-[510px]'
                        : 'h-[340px] sm:h-[380px] lg:h-[400px]'
                    }`}
                  >
                    <img
                      src={prompt.featuredImage}
                      alt={prompt.title}
                      className="w-full h-full max-w-full max-h-full object-contain rounded-[14px] shadow-lg transition-transform duration-300 group-hover:scale-[1.01]"
                      referrerPolicy="no-referrer"
                    />

                    {/* WATERMARK OVERLAY SIMULATION (Rendered ONLY if feature is ON) */}
                    {featureToggles.watermark && isWatermarkEnabled && (
                      <div
                        className={`absolute z-10 pointer-events-none px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 text-white/90 text-[11px] font-extrabold flex items-center gap-1.5 shadow-lg tracking-wider ${
                          watermarkPosition === 'bottom-left' ? 'bottom-4 left-4' : 'bottom-4 right-4'
                        }`}
                      >
                        <ShieldCheck size={13} className="text-[#D97757]" />
                        <span>PromptJo.ir</span>
                      </div>
                    )}

                    {/* PREVIEW VIEWER BUTTON */}
                    <button
                      onClick={() => setIsLightboxOpen(true)}
                      className={`absolute ${
                        featureToggles.watermark && isWatermarkEnabled && watermarkPosition === 'bottom-left'
                          ? 'top-4 left-4'
                          : 'bottom-4 left-4'
                      } flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white text-xs font-semibold transition-all shadow-lg active:scale-95 z-10`}
                    >
                      <Maximize2 size={13} />
                      <span>مشاهده تصویر بزرگ</span>
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              /* ================= STANDARD HERO ================= */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-stretch">

                {/* RIGHT COLUMN (Desktop): Title, Description, Dynamic Metadata, Stats, Interaction Bar */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-4 order-2 lg:order-1 text-right">
                  <div className="space-y-2.5">
                    {/* TITLE */}
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight tracking-tight">
                      {prompt.title}
                    </h1>

                    {/* DESCRIPTION */}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                      {prompt.description}
                    </p>
                  </div>

                  {/* PRIMARY BASIC ACCESS & METADATA CHIPS (Model, Language, VIP/Free, Difficulty) */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-0.5 text-xs text-slate-300">
                    {/* VIP / Paid vs Free Access Badge */}
                    {isPaidPrompt ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300 font-extrabold text-xs shadow-sm">
                        <Lock size={13} className="text-amber-400" />
                        <span>پرامپت ویژه — {formattedPaidPrice} {paidCurrency}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
                        <CheckCircle2 size={13} className="text-emerald-400" />
                        <span>دسترسی: رایگان</span>
                      </div>
                    )}

                    {/* AI Model Chip (Supports multi-model badge wrapping with clean layout) */}
                    {featureToggles.model && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1C1F26] border border-[#3A4150] text-slate-200">
                        <Cpu size={14} className="text-[#D97757] shrink-0" />
                        <span className="text-slate-400 font-medium text-xs shrink-0">مدل:</span>
                        {prompt.compatibleModels && prompt.compatibleModels.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            {prompt.compatibleModels.map((m, mIdx) => (
                              <span key={mIdx} className="font-bold text-xs">
                                {m}{mIdx < (prompt.compatibleModels?.length || 1) - 1 ? '،' : ''}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="font-bold text-xs">{prompt.aiModel || 'هوش مصنوعی'}</span>
                        )}
                      </div>
                    )}

                    {/* Language Chip */}
                    {featureToggles.language && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1C1F26] border border-[#3A4150] text-slate-200">
                        <Globe2 size={14} className="text-blue-400 shrink-0" />
                        <span className="text-slate-400 font-medium text-xs shrink-0">زبان:</span>
                        <span className="font-bold text-xs">
                          {prompt.language || (/^[\x00-\x7F\s\p{P}]+$/u.test(prompt.fullPromptText.slice(0, 80)) ? 'انگلیسی' : 'فارسی')}
                        </span>
                      </div>
                    )}

                    {/* Difficulty */}
                    {featureToggles.difficulty && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1C1F26] border border-[#3A4150] text-slate-200">
                        <Gauge size={14} className="text-amber-400 shrink-0" />
                        <span className="text-slate-400 font-medium text-xs shrink-0">سطح:</span>
                        <span className="font-bold text-xs">{prompt.level || 'متوسط'}</span>
                      </div>
                    )}
                  </div>

                  {/* CONTEXT-AWARE METADATA (Domain-specific: Domain, Tech, Task/Goal, Output, etc.) */}
                  {contextMeta.specs.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <span className="text-[#D97757]">✦</span>
                        <span>مشخصات پرامپت</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300">
                        {contextMeta.specs.map((spec, sIdx) => {
                          let icon = <Layers size={14} className="text-teal-400 shrink-0" />;
                          if (spec.label.includes('سبک') || spec.label.includes('لحن')) icon = <Sparkles size={14} className="text-purple-400 shrink-0" />;
                          else if (spec.label.includes('فناوری') || spec.label.includes('خروجی')) icon = <FileCode2 size={14} className="text-emerald-400 shrink-0" />;
                          else if (spec.label.includes('هدف') || spec.label.includes('کار')) icon = <Zap size={14} className="text-amber-400 shrink-0" />;

                          return (
                            <div key={sIdx} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1C1F26] border border-[#3A4150] text-slate-200">
                              {icon}
                              <span className="text-slate-400 font-medium text-xs">{spec.label}:</span>
                              <span className="font-bold text-xs">{spec.value}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STATS ROW */}
                  {featureToggles.stats && (
                    <div className="flex items-center gap-3.5 pt-4 text-xs text-slate-400">
                      {prompt.views && (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1C1F26]/70 border border-[#3A4150]/60 text-slate-300 text-xs">
                          <Eye size={14} className="text-slate-400" />
                          <span>{prompt.views} بازدید</span>
                        </div>
                      )}

                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1C1F26]/70 border border-[#3A4150]/60 text-slate-300 text-xs">
                        <Heart size={14} className="text-slate-400" />
                        <span>{likesCount.toLocaleString('fa-IR')} پسندیده شده</span>
                      </div>
                    </div>
                  )}

                  {/* INTERACTION BUTTONS */}
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      onClick={handleHeroLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all ${
                        isHeroLiked
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm'
                          : 'bg-[#1C1F26] text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/40 border border-[#3A4150]'
                      }`}
                      title="پسندیدن پرامپت"
                    >
                      <Heart size={15} className={isHeroLiked ? 'fill-current text-rose-400' : ''} />
                      <span>{isHeroLiked ? 'پسندیده شد' : 'لایک'}</span>
                    </button>

                    <button
                      onClick={handleHeroSave}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition-all ${
                        prompt.isBookmarked
                          ? 'bg-[#D97757]/20 text-[#D97757] border border-[#D97757]/40 shadow-sm'
                          : 'bg-[#1C1F26] text-slate-300 hover:text-[#D97757] hover:bg-[#D97757]/10 hover:border-[#D97757]/40 border border-[#3A4150]'
                      }`}
                      title="ذخیره پرامپت"
                    >
                      <Bookmark size={15} className={prompt.isBookmarked ? 'fill-current text-[#D97757]' : ''} />
                      <span>{prompt.isBookmarked ? 'ذخیره شده' : 'ذخیره پرامپت'}</span>
                    </button>

                    <button
                      onClick={handleHeroShare}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-[13px] font-bold bg-[#1C1F26] text-slate-300 hover:text-sky-400 hover:bg-sky-500/10 hover:border-sky-500/40 border border-[#3A4150] transition-all"
                      title="اشتراک‌گذاری پرامپت"
                    >
                      <Share2 size={15} />
                      <span>اشتراک‌گذاری</span>
                    </button>
                  </div>
                </div>

                {/* LEFT COLUMN (Desktop): STANDARD PREVIEW */}
                <div className="lg:col-span-5 order-1 lg:order-2 flex items-center justify-center w-full h-full">
                  <div className="relative w-full h-full min-h-[220px] sm:min-h-[250px] lg:min-h-[260px] rounded-[18px] bg-[#1C1F26] border border-[#3A4150] overflow-hidden shadow-lg group transition-all duration-300 hover:border-[#D97757] hover:shadow-[0_0_25px_rgba(217,119,87,0.28)]">
                    <img
                      src={prompt.featuredImage}
                      alt={prompt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    {/* SUBTLE PLAY ICON */}
                    {(prompt.isVideo || prompt.category?.includes('ویدیو') || prompt.category?.toLowerCase().includes('video') || prompt.promptType?.includes('video')) && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
                          <Play size={20} className="fill-white translate-x-[-1px]" />
                        </div>
                      </div>
                    )}

                    {/* PREVIEW VIEWER BUTTON */}
                    <button
                      onClick={() => setIsLightboxOpen(true)}
                      className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/70 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium transition-all shadow-md active:scale-95 z-10"
                    >
                      <Maximize2 size={12} />
                      <span>مشاهده تصویر بزرگ</span>
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* SUBTLE INTERNAL DIVIDER 1 */}
          <div className="w-full border-t border-[#3A4150]/60" />

          {/* SECTION 2: PROMPT + USAGE GUIDE */}
          <div className="single-prompt-content grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* RIGHT COLUMN (65-70% / 8 Cols or 12 Cols if Guide is OFF): PROMPT COLUMN */}
            <div className={`prompt-column ${featureToggles.usageGuide ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-4`}>
              
              {/* Main Prompt Box */}
              <div className="rounded-[18px] bg-[#1C1F26] border border-[#3A4150]/80 overflow-hidden">
                {/* Prompt Box Header */}
                <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-[#282D38] border-b border-[#3A4150]/70">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#D97757]/15 border border-[#D97757]/30 flex items-center justify-center text-[#D97757]">
                      <Sparkles size={13} />
                    </div>
                    <span className="font-bold text-xs sm:text-sm text-white">متن پرامپت اصلی</span>
                  </div>

                  {/* ACTION IN PROMPT BOX HEADER (Copy for Free, Buy CTA for Paid) */}
                  {isPaidPrompt ? (
                    <button
                      onClick={() => {
                        const paidSec = document.getElementById('paid-access-section');
                        if (paidSec) {
                          paidSec.scrollIntoView({ behavior: 'smooth' });
                        }
                        onShowToast(`خرید پرامپت ویژه — ${formattedPaidPrice} ${paidCurrency}`, 'info');
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg hover:shadow-amber-500/20 active:scale-95 transition-all"
                    >
                      <ShoppingBag size={13} />
                      <span>خرید پرامپت — {formattedPaidPrice} {paidCurrency}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onCopyPrompt(customizedPromptText, prompt.title)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 shadow-md ${
                        copiedPromptId === prompt.id
                          ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                          : 'bg-gradient-to-r from-[#D97757] to-[#E58A66] hover:from-[#E58A66] hover:to-[#D97757] text-white shadow-orange-950/40 hover:scale-105 active:scale-95'
                      }`}
                    >
                      {copiedPromptId === prompt.id ? (
                        <>
                          <Check size={13} />
                          <span>کپی شد</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>کپی پرامپت</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Prompt Box Content Body */}
                <div className="p-4 space-y-3">
                  {isPaidPrompt ? (
                    /* LOCKED PAYWALL BODY FOR PAID PROMPT */
                    <div className="relative rounded-[14px] overflow-hidden bg-[#14171F] border border-amber-500/30 p-5 sm:p-7 text-center space-y-4">
                      {/* Blurred background preview (strictly unselectable & uncopyable) */}
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 p-4 text-right font-mono text-xs sm:text-[13px] leading-[2.2] text-slate-400 select-none pointer-events-none filter blur-[4.5px] opacity-25 overflow-hidden"
                      >
                        {prompt.fullPromptText}
                      </div>

                      {/* Locked Paywall Overlay Card */}
                      <div className="relative z-10 flex flex-col items-center justify-center space-y-3 py-2">
                        <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-xl shadow-amber-950/30">
                          <Lock size={20} />
                        </div>

                        <div className="space-y-1 text-center">
                          <h4 className="text-sm sm:text-base font-extrabold text-white">
                            متن کامل پرامپت قفل است (پرامپت ویژه)
                          </h4>
                          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                            این پرامپت تخصصی حاوی دستورات رندر دقیق، پارامترهای استثنایی و متغیرهای فرمول‌بندی‌شده است. برای مشاهده و استفاده کامل، پرامپت را تهیه نمایید.
                          </p>
                        </div>

                        {/* Primary CTA */}
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                          <button
                            onClick={() => {
                              const paidSec = document.getElementById('paid-access-section');
                              if (paidSec) {
                                paidSec.scrollIntoView({ behavior: 'smooth' });
                              }
                              onShowToast(`خرید پرامپت — ${formattedPaidPrice} ${paidCurrency}`, 'info');
                            }}
                            className="inline-flex items-center gap-2 px-7 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-black shadow-xl hover:shadow-amber-500/25 active:scale-95 transition-all"
                          >
                            <ShoppingBag size={16} />
                            <span>خرید پرامپت — {formattedPaidPrice} {paidCurrency}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* UNLOCKED FULL CONTENT BODY FOR FREE PROMPT */
                    <>
                      <div
                        className={`font-mono text-xs sm:text-[13px] leading-[2.1] font-normal text-slate-100 bg-[#161920] p-4 rounded-[12px] border border-[#3A4150]/60 transition-all ${
                          isEnglishPrompt ? 'text-left ltr' : 'text-right rtl font-["Vazirmatn",sans-serif]'
                        } ${!isPromptExpanded ? 'line-clamp-4' : ''}`}
                      >
                        {renderHighlightedPromptText(customizedPromptText)}
                      </div>

                      {/* LONG PROMPT BEHAVIOR TOGGLE */}
                      <div className="flex justify-center pt-0.5">
                        <button
                          onClick={() => setIsPromptExpanded(!isPromptExpanded)}
                          className="flex items-center gap-1.5 text-xs font-bold text-[#D97757] hover:text-[#E58A66] transition-colors py-1 px-3.5 rounded-xl bg-[#232833] border border-[#3A4150] hover:border-[#D97757]/50"
                        >
                          {isPromptExpanded ? (
                            <>
                              <span>بستن پرامپت ↑</span>
                              <ChevronUp size={13} />
                            </>
                          ) : (
                            <>
                              <span>نمایش کامل پرامپت ↓</span>
                              <ChevronDown size={13} />
                            </>
                          )}
                        </button>
                      </div>

                      {/* Variable Highlight Note */}
                      <p className="text-[11px] text-slate-400 pt-0.5 leading-relaxed text-right">
                        بخش‌های داخل [کروشه] را می‌توانید متناسب با نیاز خود شخصی‌سازی کنید.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* ======================================================== */}
              {/* OPTIONAL FEATURE: INTERACTIVE VARIABLES CUSTOMIZER FORM  */}
              {/* Rendered ONLY if free && featureToggles.variablesInteraction && variables exist */}
              {/* ======================================================== */}
              {!isPaidPrompt && featureToggles.variablesInteraction && prompt.variables && prompt.variables.length > 0 && (
                <div className="rounded-[18px] bg-[#1C1F26] border border-[#D97757]/40 overflow-hidden shadow-lg animate-fade-in">
                  <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-gradient-to-r from-[#282D38] to-[#202530] border-b border-[#3A4150]/70">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#D97757]/20 border border-[#D97757]/40 flex items-center justify-center text-[#D97757]">
                        <SlidersHorizontal size={13} />
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-white">شخصی‌سازی متغیرهای پرامپت (Live Form)</span>
                    </div>
                    <span className="text-[11px] text-[#E58A66] font-medium bg-[#D97757]/10 px-2 py-0.5 rounded-md border border-[#D97757]/20">
                      {prompt.variables.length} متغیر فعال
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {prompt.variables.map((variable) => (
                        <div key={variable.key} className="space-y-1.5 text-right">
                          <label className="text-xs font-bold text-slate-200 flex items-center gap-1">
                            <span className="text-[#D97757] font-mono">[{variable.key}]</span>
                            <span>:</span>
                            <span className="text-slate-300 text-[11px]">{variable.label}</span>
                          </label>

                          {variable.options && variable.options.length > 0 ? (
                            <select
                              value={customVariableValues[variable.key] || variable.defaultValue}
                              onChange={(e) =>
                                setCustomVariableValues((prev) => ({
                                  ...prev,
                                  [variable.key]: e.target.value,
                                }))
                              }
                              className="w-full bg-[#14171F] text-slate-100 text-xs p-2.5 rounded-xl border border-[#3A4150] focus:border-[#D97757] focus:outline-none transition-colors"
                            >
                              {variable.options.map((opt, i) => (
                                <option key={i} value={opt} className="bg-[#1C1F26] text-slate-200">
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={customVariableValues[variable.key] || ''}
                              placeholder={variable.placeholder || variable.defaultValue}
                              onChange={(e) =>
                                setCustomVariableValues((prev) => ({
                                  ...prev,
                                  [variable.key]: e.target.value,
                                }))
                              }
                              className="w-full bg-[#14171F] text-slate-100 text-xs p-2.5 rounded-xl border border-[#3A4150] focus:border-[#D97757] focus:outline-none transition-colors"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Preview of Customized Output & Copy Button */}
                    <div className="pt-2 border-t border-[#3A4150]/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-400">پیش‌نمایش پرامپت شخصی‌سازی شده شما:</span>
                        <button
                          onClick={() => {
                            const initial: Record<string, string> = {};
                            prompt.variables?.forEach((v) => {
                              initial[v.key] = v.defaultValue;
                            });
                            setCustomVariableValues(initial);
                            onShowToast('متغیرها به مقادیر پیش‌فرض بازنشانی شدند.', 'info');
                          }}
                          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                        >
                          <RefreshCw size={11} />
                          <span>بازنشانی پیش‌فرض</span>
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-[#14171F] border border-[#3A4150]/80 font-mono text-xs text-slate-200 leading-relaxed max-h-28 overflow-y-auto select-all">
                        {customizedPromptText}
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => onCopyPrompt(customizedPromptText, `${prompt.title} (شخصی‌سازی شده)`)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#D97757] hover:bg-[#E58A66] text-white transition-all shadow-md active:scale-95"
                        >
                          <Copy size={13} />
                          <span>کپی پرامپت شخصی‌سازی شده</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* OPTIONAL FEATURE: NEGATIVE PROMPT (Rendered ONLY if enabled) */}
              {/* ======================================================== */}
              {featureToggles.negativePrompt && prompt.negativePrompt && (
                <div className="rounded-[18px] bg-[#1C1F26] border border-rose-500/30 overflow-hidden shadow-sm animate-fade-in">
                  <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-[#282D38] border-b border-[#3A4150]/70">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                        <AlertCircle size={12} />
                      </div>
                      <span className="font-bold text-xs text-white">پرامپت منفی (Negative Prompt)</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(prompt.negativePrompt || '');
                        onShowToast('پرامپت منفی کپی شد.', 'success');
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1C1F26] hover:bg-[#2C3240] text-slate-300 hover:text-white text-[11px] font-medium border border-[#3A4150] transition-colors"
                    >
                      <Copy size={11} />
                      <span>کپی</span>
                    </button>
                  </div>
                  <div className="p-4 font-mono text-xs text-rose-300/90 leading-relaxed bg-[#161920] select-all dir-ltr text-left">
                    {prompt.negativePrompt}
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* OPTIONAL FEATURE: TECHNICAL PARAMETERS (Rendered ONLY if enabled) */}
              {/* ======================================================== */}
              {featureToggles.technicalParameters && prompt.technicalParameters && (
                <div className="rounded-[18px] bg-[#1C1F26] border border-sky-500/30 overflow-hidden shadow-sm animate-fade-in">
                  <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-[#282D38] border-b border-[#3A4150]/70">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                        <Terminal size={12} />
                      </div>
                      <span className="font-bold text-xs text-white">پارامترهای فنی (Technical Parameters)</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(prompt.technicalParameters || '');
                        onShowToast('پارامترهای فنی کپی شدند.', 'success');
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1C1F26] hover:bg-[#2C3240] text-slate-300 hover:text-white text-[11px] font-medium border border-[#3A4150] transition-colors"
                    >
                      <Copy size={11} />
                      <span>کپی</span>
                    </button>
                  </div>
                  <div className="p-4 font-mono text-xs text-sky-300/90 leading-relaxed bg-[#161920] select-all dir-ltr text-left">
                    {prompt.technicalParameters}
                  </div>
                </div>
              )}

            </div>

            {/* LEFT COLUMN (30-35% / 4 Cols): USAGE GUIDE COLUMN (Rendered ONLY if enabled) */}
            {featureToggles.usageGuide && (
              <div className="guide-column lg:col-span-4 space-y-3 text-right">
                <div className="flex items-center gap-2 pb-2">
                  <Sparkles size={15} className="text-[#D97757]" />
                  <h2 className="text-xs sm:text-sm font-bold text-white">راهنمای استفاده و شخصی‌سازی</h2>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300">
                  {guide.purpose && (
                    <div className="p-3.5 rounded-[14px] bg-[#1C1F26] border border-[#3A4150]/70 space-y-1">
                      <span className="font-bold text-slate-200 block text-[11px] flex items-center gap-1.5">
                        <span>🎯</span>
                        <span>هدف و کاربرد:</span>
                      </span>
                      <p className="leading-relaxed text-slate-300 text-[11px] sm:text-xs">{guide.purpose}</p>
                    </div>
                  )}

                  {guide.howToUse && (
                    <div className="p-3.5 rounded-[14px] bg-[#1C1F26] border border-[#3A4150]/70 space-y-1">
                      <span className="font-bold text-slate-200 block text-[11px] flex items-center gap-1.5">
                        <span>⚙️</span>
                        <span>نحوه استفاده:</span>
                      </span>
                      <p className="leading-relaxed text-slate-300 text-[11px] sm:text-xs">{guide.howToUse}</p>
                    </div>
                  )}

                  {guide.customization && (
                    <div className="p-3.5 rounded-[14px] bg-[#1C1F26] border border-[#3A4150]/70 space-y-1">
                      <span className="font-bold text-slate-200 block text-[11px] flex items-center gap-1.5">
                        <span>🎨</span>
                        <span>بخش‌های شخصی‌سازی:</span>
                      </span>
                      <p className="leading-relaxed text-slate-300 text-[11px] sm:text-xs">{guide.customization}</p>
                    </div>
                  )}

                  {guide.tips && (
                    <div className="p-3.5 rounded-[14px] bg-[#1C1F26] border border-[#3A4150]/70 space-y-1">
                      <span className="font-bold text-slate-200 block text-[11px] flex items-center gap-1.5">
                        <span>💡</span>
                        <span>نکات کلیدی و بهینه‌سازی:</span>
                      </span>
                      <p className="leading-relaxed text-slate-300 text-[11px] sm:text-xs">{guide.tips}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* SUBTLE INTERNAL DIVIDER 2 (Rendered only if tags enabled and exist) */}
          {featureToggles.tags && prompt.tags && prompt.tags.length > 0 && (
            <>
              <div className="w-full border-t border-[#3A4150]/60" />

              {/* SECTION 3: TAGS */}
              <div className="single-prompt-tags w-full text-right space-y-2 pt-1">
                <h3 className="text-xs font-bold text-slate-300">برچسب‌ها</h3>
                <div className="flex flex-wrap items-center gap-2">
                  {prompt.tags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => onNavigateExplore(undefined, tag)}
                      className="px-3 py-1.5 rounded-xl bg-[#1C1F26] hover:bg-[#2C3240] border border-[#3A4150] text-slate-300 hover:text-[#D97757] hover:border-[#D97757]/40 text-xs font-medium transition-all"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

        </article>

        {/* ======================================================== */}
        {/* SECTION 4: RELATED PROMPTS                               */}
        {/* ======================================================== */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-extrabold text-white">پرامپت‌های مرتبط</h2>
            <button
              onClick={() => onNavigateExplore(prompt.category)}
              className="text-xs font-bold text-[#D97757] hover:text-[#E58A66] transition-colors flex items-center gap-1"
            >
              <span>مشاهده همه در {prompt.category}</span>
              <ChevronLeft size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedPrompts.map((related) => (
              <PromptCard
                key={related.id}
                item={related}
                prompt={related}
                onSelect={(p) => {
                  onSelectPrompt(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenPromptModal={(p) => {
                  onSelectPrompt(p);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onCopyPrompt={onCopyPrompt}
                onCopy={onCopyPrompt}
                isCopied={copiedPromptId === related.id}
                onBookmarkToggle={onBookmarkToggle}
                onBookmark={onBookmarkToggle}
                displayOptions={{
                  showThumbnail: true,
                  showCategory: true,
                  showAiModel: true,
                  showTags: false,
                  showViews: true,
                  showSaves: true,
                  showCopyButton: true,
                  showRating: true,
                  showAuthor: false,
                  showDate: false,
                }}
              />
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 6: BANNER SLOTS (Side-by-side Desktop, Stacked)  */}
        {/* ======================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-gradient-to-r from-[#232833] to-[#2A303D] rounded-[20px] border border-[#3A4150] p-4 flex items-center justify-between gap-4 shadow-sm hover:border-[#D97757]/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <GraduationCap size={20} />
              </div>
              <div className="text-right">
                <h3 className="text-sm font-bold text-white">آکادمی پرامپت‌جو</h3>
                <p className="text-xs text-slate-400 mt-0.5">دوره‌های تخصصی مهندسی پرامپت و هوش مصنوعی</p>
              </div>
            </div>
            <a
              href="#academy"
              onClick={(e) => {
                e.preventDefault();
                onShowToast('بخش آکادمی پرامپت‌جو به زودی راه‌اندازی می‌شود.', 'info');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#1C1F26] hover:bg-[#D97757] hover:text-white border border-[#3A4150] text-xs font-bold text-slate-200 transition-all shrink-0"
            >
              مشاهده دوره‌ها
            </a>
          </div>

          <div className="bg-gradient-to-r from-[#232833] to-[#2A303D] rounded-[20px] border border-[#3A4150] p-4 flex items-center justify-between gap-4 shadow-sm hover:border-[#D97757]/40 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Newspaper size={20} />
              </div>
              <div className="text-right">
                <h3 className="text-sm font-bold text-white">مجله هوش مصنوعی</h3>
                <p className="text-xs text-slate-400 mt-0.5">آخرین مقالات، ترفندها و اخبار دنیای هوش مصنوعی</p>
              </div>
            </div>
            <a
              href="#magazine"
              onClick={(e) => {
                e.preventDefault();
                onShowToast('بخش مجله پرامپت‌جو در دست تولید محتوا است.', 'info');
              }}
              className="px-3 py-1.5 rounded-xl bg-[#1C1F26] hover:bg-[#D97757] hover:text-white border border-[#3A4150] text-xs font-bold text-slate-200 transition-all shrink-0"
            >
              مطالعه مقالات
            </a>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 7: COMMENTS (Form First, List Second)            */}
        {/* Rendered ONLY if featureToggles.comments is enabled      */}
        {/* ======================================================== */}
        {featureToggles.comments && (
          <section id="comments-section" className="bg-[#232833] rounded-[24px] border border-[#3A4150]/80 p-6 sm:p-8 space-y-8 shadow-xl text-right">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-[#3A4150]/60">
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-5 h-5 text-[#D97757]" />
                <h2 className="text-lg sm:text-xl font-extrabold text-white">دیدگاه‌های کاربران</h2>
                <span className="text-xs text-slate-400 bg-[#1C1F26] px-2.5 py-0.5 rounded-full border border-[#3A4150]">
                  {comments.length} دیدگاه
                </span>
              </div>
            </div>

            {/* Comment Form (First) */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-200">دیدگاه خود را بنویسید</h3>

              {commentFeedback && (
                <div
                  className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    commentFeedback.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  {commentFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                  <span className="text-xs sm:text-sm font-medium">{commentFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleCommentSubmit} className="space-y-3">
                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  rows={3}
                  placeholder="تجربه، سوال یا پیشنهاد خود را درباره این پرامپت بنویسید..."
                  className="w-full bg-[#1C1F26] text-slate-100 text-xs sm:text-sm p-4 rounded-xl border border-[#3A4150] focus:border-[#D97757] focus:outline-none transition-colors resize-none placeholder:text-slate-500 leading-relaxed"
                  required
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#D97757] hover:bg-[#E58A66] text-white text-xs font-bold transition-all shadow-md active:scale-95"
                  >
                    ارسال دیدگاه
                  </button>
                </div>
              </form>
            </div>

            {/* Comments List (Second) */}
            <div className="space-y-4 pt-2">
              {displayedComments.map((comment) => (
                <div
                  key={comment.id}
                  className={`p-5 rounded-[18px] bg-[#1C1F26] space-y-3 border transition-all ${
                    comment.isBestAnswer
                      ? 'border-amber-500/40 bg-[#1C1F26]'
                      : comment.isPinned
                      ? 'border-[#D97757]/40'
                      : 'border-[#3A4150]/70'
                  }`}
                >
                  {/* Top Answer Badge */}
                  {comment.isBestAnswer && (
                    <div className="flex items-center gap-1.5 text-amber-400 text-[11px] font-extrabold pb-1">
                      <Trophy size={14} className="text-amber-400" />
                      <span>پاسخ برتر تأیید شده</span>
                    </div>
                  )}

                  {/* Header Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        className="w-9 h-9 rounded-full object-cover border border-[#3A4150]"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-white">{comment.user.name}</span>
                          {renderRoleBadge(comment.user.role)}
                          {comment.isVerified && (
                            <span title="تأیید شده توسط PromptJo">
                              <CheckCircle2 size={13} className="text-emerald-400" />
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500">{comment.relativeDate}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setReportingTargetId(comment.id);
                        setIsReportModalOpen(true);
                      }}
                      className="text-[11px] text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors py-1 px-2 rounded-lg hover:bg-[#232833]"
                    >
                      <Flag size={12} />
                      <span>گزارش</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{comment.content}</p>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-3 pt-2 border-t border-[#3A4150]/40">
                    <button
                      onClick={() => handleLikeComment(comment.id)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg transition-colors ${
                        comment.isLiked ? 'text-rose-400 bg-rose-500/10' : 'text-slate-400 hover:text-rose-400 hover:bg-[#232833]'
                      }`}
                    >
                      <Heart size={14} className={comment.isLiked ? 'fill-current' : ''} />
                      <span>{comment.likes}</span>
                    </button>

                    <button
                      onClick={() => setActiveReplyId(activeReplyId === comment.id ? null : comment.id)}
                      className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg text-slate-400 hover:text-[#D97757] hover:bg-[#232833] transition-colors"
                    >
                      <CornerDownLeft size={14} />
                      <span>پاسخ</span>
                    </button>
                  </div>

                  {/* Reply Form */}
                  {activeReplyId === comment.id && (
                    <div className="pt-2 pl-4 space-y-2 border-r-2 border-[#D97757]/40 pr-3 mr-2 animate-fade-in">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={`پاسخ به ${comment.user.name}...`}
                        rows={2}
                        className="w-full bg-[#14171F] text-slate-100 text-xs p-3 rounded-xl border border-[#3A4150] focus:border-[#D97757] focus:outline-none resize-none"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setActiveReplyId(null)}
                          className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-slate-200"
                        >
                          انصراف
                        </button>
                        <button
                          onClick={() => handleReplySubmit(comment.id)}
                          className="px-4 py-1.5 rounded-lg bg-[#D97757] hover:bg-[#E58A66] text-white text-xs font-bold transition-all"
                        >
                          ثبت پاسخ
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Replies List */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="space-y-3 pt-2 pl-4 border-r-2 border-[#3A4150]/60 pr-3 mr-2">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="p-3.5 rounded-xl bg-[#14171F] border border-[#3A4150]/50 space-y-2">
                          <div className="flex items-center gap-2">
                            <img
                              src={reply.user.avatar}
                              alt={reply.user.name}
                              className="w-7 h-7 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{reply.user.name}</span>
                              {renderRoleBadge(reply.user.role)}
                            </div>
                            <span className="text-[10px] text-slate-500 mr-auto">{reply.relativeDate}</span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Load More Comments */}
              {visibleCommentsCount < sortedComments.length && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => setVisibleCommentsCount((prev) => prev + 4)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1C1F26] border border-[#3A4150] text-slate-300 hover:text-[#D97757] hover:border-[#D97757]/40 text-xs font-bold transition-all"
                  >
                    <span>نمایش دیدگاه‌های بیشتر</span>
                    <ChevronDown size={14} />
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

      </div>

      {/* ======================================================== */}
      {/* LIGHTBOX MODAL                                           */}
      {/* ======================================================== */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 left-5 px-4 py-2 rounded-full bg-white/10 hover:bg-[#D97757] text-white transition-all text-xs font-bold z-10 flex items-center gap-1.5"
          >
            <X size={16} />
            <span>بستن</span>
          </button>
          <div className="relative max-w-4xl max-h-[90vh] flex items-center justify-center p-2">
            <img
              src={prompt.featuredImage}
              alt={prompt.title}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl border border-white/10"
              referrerPolicy="no-referrer"
            />
            {featureToggles.watermark && isWatermarkEnabled && (
              <div
                className={`absolute z-20 pointer-events-none px-4 py-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-extrabold flex items-center gap-2 shadow-2xl ${
                  watermarkPosition === 'bottom-left' ? 'bottom-6 left-6' : 'bottom-6 right-6'
                }`}
              >
                <ShieldCheck size={16} className="text-[#D97757]" />
                <span>PromptJo.ir</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* REPORT MODAL                                             */}
      {/* ======================================================== */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 text-right">
          <div className="max-w-md w-full bg-[#232833] rounded-[20px] border border-[#3A4150] p-6 shadow-2xl space-y-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#3A4150]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flag size={16} className="text-rose-400" />
                <span>گزارش دیدگاه</span>
              </h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              لطفاً علت گزارش را مشخص کنید:
            </p>

            <div className="space-y-2 text-xs text-slate-200">
              {['محتوای نامناسب یا توهین‌آمیز', 'اسپم یا تبلیغات تکراری', 'نقض کپی‌رایت', 'سایر دلایل'].map((reason) => (
                <label
                  key={reason}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedReportReason === reason
                      ? 'bg-[#1C1F26] border-[#D97757] text-white shadow-sm'
                      : 'bg-[#1C1F26]/70 border-[#3A4150] text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="report_reason"
                    value={reason}
                    checked={selectedReportReason === reason}
                    onChange={(e) => setSelectedReportReason(e.target.value)}
                    className="accent-[#D97757] w-4 h-4"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            {selectedReportReason === 'سایر دلایل' && (
              <textarea
                value={reportOtherText}
                onChange={(e) => setReportOtherText(e.target.value)}
                placeholder="توضیحات بیشتر را بنویسید..."
                rows={3}
                className="w-full bg-[#1C1F26] text-slate-100 text-xs p-3 rounded-xl border border-[#3A4150] focus:border-[#D97757] focus:outline-none resize-none"
              />
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-transparent hover:bg-[#1C1F26] transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={handleSendReport}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md"
              >
                ثبت گزارش
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
