import { PromptItemData } from '../types';

export const IMAGE_PROMPT_DEMO_IMAGES = {
  '16:9': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=900&fit=crop&crop=entropy&auto=format&q=85',
  '1:1': 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1000&h=1000&fit=crop&crop=entropy&auto=format&q=85',
  '9:16': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&h=1600&fit=crop&crop=entropy&auto=format&q=85',
};

/**
 * Demo simulated watermarked images matching the existing Plugin REST endpoint (/wp-json/promptjo/v1/watermark/{id})
 * Demonstrates plugin-baked watermark at different positions (Bottom-Right, Bottom-Left)
 */
export const DEMO_WATERMARKED_IMAGES = {
  '16:9': {
    'bottom-right': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=900&fit=crop&crop=entropy&auto=format&q=85',
    'bottom-left': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=900&fit=crop&crop=entropy&auto=format&q=85',
  },
  '1:1': {
    'bottom-right': 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1000&h=1000&fit=crop&crop=entropy&auto=format&q=85',
    'bottom-left': 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=1000&h=1000&fit=crop&crop=entropy&auto=format&q=85',
  },
  '9:16': {
    'bottom-right': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&h=1600&fit=crop&crop=entropy&auto=format&q=85',
    'bottom-left': 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=900&h=1600&fit=crop&crop=entropy&auto=format&q=85',
  },
};

export const DEMO_IMAGE_PROMPT: PromptItemData = {
  id: 'demo-image-prompt',
  title: 'پرامپت ویژه: پرتره سینمایی سایبرپانک با نورپردازی نئونی',
  description: 'پرامپت تخصصی تولید تصویر برای میدجورنی و استیبل دیفیوژن با جزئیات سینمایی فوق‌العاده بالا، عمق میدان واقعی، رنگ‌های نئونی اشباع‌شده و ترکیب‌بندی هنری.',
  fullPromptText: 'یک تصویر سینمایی فوق‌العاده باکیفیت و با جزئیات بسیار دقیق از [موضوع] در یک خیابان بارانی و خیس شهر سایبرپانک در شب با [سبک] و انعکاس [نورپردازی] روی سنگفرش خیابان با جو [آب‌وهوا] طراحی کن. نورپردازی باید به سبک عکاسی پرتره استودیویی با منبع نور نرم از بغل (Rim Light) و نور پرکننده پس‌زمینه باشد، لنز دوربین ۸۵ میلی‌متری با دیافراگم ۱.۴ برای ایجاد بوکه (Bokeh) طبیعی در عمق میدان، کنتراست رنگی غنی به سبک فیلم‌های علمی‌تخیلی مدرن، ذرات غبار و قطرات معلق باران در هوا، رندر واقع‌گرایانه با موتور Octane و ووضوح فوق‌العاده بالا 8K با جزئیات پوستی طبیعی و بافت لباس خیره‌کننده بدون هرگونه مات‌شدگی یا اعوجاج بصری.',
  featuredImage: IMAGE_PROMPT_DEMO_IMAGES['16:9'],
  category: 'تولید تصویر',
  aiModel: 'Midjourney v6.1',
  outputFormat: 'JPG / 1024×1024 / 300 DPI',
  level: 'پیشرفته',
  language: 'فارسی / انگلیسی',
  rating: 4.9,
  views: '4.8K',
  likes: 124,
  saves: '3.1K',
  author: 'sara_illustrator',
  createdAt: '۱۴۰۳/۱۰/۲۰',
  tags: ['پرامپت_ویژه', 'تصویرسازی', 'سایبرپانک', 'میدجورنی', 'سینمایی', 'نئون'],
  isFeatured: true,
  isFree: false,
  price: 299000,
  originalPrice: 450000,
  currency: 'تومان',
  promptType: 'image',
  aspectRatio: '16:9',
  // V3 All Features
  negativePrompt: 'low quality, blurry, distorted anatomy, duplicate, extra limbs, bad eyes, missing fingers, watermark, bad hands, artifacts, low resolution, poorly drawn face, mutated hands, oversaturated, deformed body',
  technicalParameters: '--ar 16:9 --stylize 250 --v 6.1 --q 2 --chaos 10 --seed 894102 --c 5',
  compatibleModels: [
    'Midjourney v6.1',
    'Flux.1 Pro',
    'Stable Diffusion XL (SDXL)',
    'DALL·E 3 (GPT-4o)',
    'Leonardo AI (Phoenix)'
  ],
  variables: [
    {
      key: 'موضوع',
      label: 'موضوع و کاراکتر اصلی',
      defaultValue: 'دختر سایبورگ آینده‌نگر با موهای نقره‌ای و چشم‌های بیونیک فیروزه‌ای',
      placeholder: 'مثلاً: مرد کارآگاه سایبرپانک با بارانی چرمی...',
      options: [
        'دختر سایبورگ آینده‌نگر با موهای نقره‌ای و چشم‌های بیونیک فیروزه‌ای',
        'ربات هوشمند سامورایی در کنار موتور سیکلت نئونی',
        'دانشمند ژنتیک در آزمایشگاه معلق شیشه‌ای',
        'مرد کارآگاه سایبرپانک با بارانی چرمی و عینک هولوگرافیک'
      ]
    },
    {
      key: 'سبک',
      label: 'سبک بصری و کارگردانی',
      defaultValue: 'سبک سینمایی Blade Runner 2049',
      options: [
        'سبک سینمایی Blade Runner 2049',
        'نوآر آینده‌نگر تاریک با سایه‌های عمیق',
        'سایبرپانک انیمه‌ای هایپررئال',
        'فتورئالیسم مستند با گرین فیلم آنالوگ ۳۵ میلی‌متری'
      ]
    },
    {
      key: 'نورپردازی',
      label: 'پالت رنگی و نورپردازی',
      defaultValue: 'نورهای نئونی ارغوانی، فیروزه‌ای و کهربایی',
      options: [
        'نورهای نئونی ارغوانی، فیروزه‌ای و کهربایی',
        'نور سرد مهتابی آبی با هایلایت طلایی',
        'نورهای سایکدلیک بنفش و زمردی با کنتراست شدید',
        'نور تک‌رنگ مونوکروم قرمز با پرتوهای باریک لیزری'
      ]
    },
    {
      key: 'آب‌وهوا',
      label: 'اتمسفر محیطی',
      defaultValue: 'باران شدید شبانه با بازتاب نور در چاله‌های آب',
      options: [
        'باران شدید شبانه با بازتاب نور در چاله‌های آب',
        'مه غلیظ و دود اسیدی خروجی از لوله‌های شهری',
        'غروب خورشید در میان آلودگی نوری کلان‌شهر',
        'هوای برفی با ذرات کریستالی معلق در نور چراغ‌ها'
      ]
    }
  ],
  paidAccess: {
    isPaid: true,
    price: 299000,
    originalPrice: 450000,
    currency: 'تومان',
    purchaseUrl: '#checkout',
    guaranteeText: 'تضمین بازگشت وجه تا ۷ روز در صورت عدم رضایت از خروجی',
    features: [
      'دسترسی دائمی و نامحدود به نسخه اورجینال پرامپت با کیفیت Full HD / 8K',
      'بسته کامل پارامترهای اختصاصی Midjourney و دستورات منفی پیشرفته',
      'فایل راهنمای PDF شخصی‌سازی اختصاصی با ۲۰ نمونه رندر موفق',
      'پشتیبانی مستقیم و پاسخگویی طراح پرامپت در پنل کاربری'
    ]
  }
};

export const DEMO_PAID_PROMPT: PromptItemData = DEMO_IMAGE_PROMPT;

export const DEMO_STANDARD_PROMPT: PromptItemData = {
  id: 'demo-standard-prompt',
  title: 'اسکریپت ۱۰ دقیقه‌ای ویدیو یوتیوب',
  description: 'یک فیلم‌نامه و اسکریپت حرفه‌ای برای ویدیوی یوتیوب با قلاب (Hook) گیرا، بدنه منسجم، لحن صمیمی و دعوت به اقدام (CTA) هدفمند.',
  fullPromptText: 'به عنوان یک نویسنده حرفه‌ای و سناریونویس باسابقه یوتیوب، یک اسکریپت کامل و جذاب ۱۰ دقیقه‌ای برای ویدیویی با محوریت [موضوع] در حوزه [دسته] با لحن [لحن] و ساختار روایی [ساختار] بنویس و ساختار روایی آن را به گونه‌ای طراحی کن که از ثانیه‌های ابتدایی توجه مخاطب را جلب کند. در آغاز متن یک Hook قدرتمند و کنجکاوکننده قرار بده و بدون معطلی وارد مقدمه‌ای منسجم و سریع شو تا مخاطب دلیل قانع‌کننده‌ای برای تماشای ویدیو تا انتها داشته باشد. بدنه اصلی اسکریپت باید شامل تحلیل‌های کاربردی، مثال‌های واقعی و قابل لمس، نکات عملی گام‌به‌گام و بخش‌بندی‌های زمانی دقیق برای فیلم‌برداری باشد و لحن گفتار در سراسر متن صمیمی، پرانرژی، روان و کاملاً مناسب مخاطبان فارسی‌زبان باقی بماند. در بخش پایانی ویدیو نیز یک نتیجه‌گیری الهام‌بخش ارائه کن و یک دعوت به اقدام یا CTA هوشمندانه و کاملاً طبیعی برای سابسکرایب کردن کانال، لایک کردن ویدیو و پیشنهاد تماشای ویدیوی بعدی قرار بده.',
  featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  category: 'تولید محتوا',
  aiModel: 'ChatGPT 4o',
  outputFormat: 'Markdown / Text Script',
  level: 'متوسط',
  language: 'فارسی',
  rating: 4.9,
  views: '2.3K',
  likes: 87,
  saves: '1.4K',
  author: 'ali_design',
  createdAt: '۱۴۰۳/۱۰/۱۵',
  tags: ['یوتیوب', 'تولید محتوا', 'اسکریپت', 'نویسندگی', 'سئو_ویدیو'],
  isFeatured: true,
  isFree: true,
  price: 0,
  currency: 'تومان',
  promptType: 'standard',
  negativePrompt: 'لحن رباتیک و خشک، اصطلاحات پیچیده و غیرقابل فهم عمومی، مقدمه‌های طولانی و خسته‌کننده، تبلیغات بیش از حد مستقیم، تکرار جملات بدون ارزش افزوده',
  technicalParameters: 'Temperature: 0.7 | Max Tokens: 4096 | Presence Penalty: 0.3 | Frequency Penalty: 0.4',
  compatibleModels: [
    'ChatGPT 4o',
    'Claude 3.7 Sonnet',
    'DeepSeek R1',
    'Gemini 1.5 Pro'
  ],
  variables: [
    {
      key: 'موضوع',
      label: 'موضوع اصلی ویدیو',
      defaultValue: '۱۰ ابزار رایگان هوش مصنوعی که در سال جدید درآمد شما را دوبرابر می‌کنند',
      options: [
        '۱۰ ابزار رایگان هوش مصنوعی که در سال جدید درآمد شما را دوبرابر می‌کنند',
        'چگونه در ۳۰ روز از صفر کانال یوتیوب سودآور بسازیم؟',
        'راهنمای کامل سرمایه‌گذاری برای افراد تازه‌کار با بودجه کم',
        'ترفندهای روانشناسی پنهان در بازاریابی برندهای بزرگ جهان'
      ]
    },
    {
      key: 'دسته',
      label: 'حوزه تخصصی و موضوعی',
      defaultValue: 'تکنولوژی، ابزارهای هوش مصنوعی و کسب درآمد اینترنتی',
      options: [
        'تکنولوژی، ابزارهای هوش مصنوعی و کسب درآمد اینترنتی',
        'توسعه فردی، مدیریت زمان و بهره‌وری',
        'کسب و کار، دیجیتال مارکتینگ و فروش',
        'برنامه‌نویسی و دنیای وب'
      ]
    },
    {
      key: 'لحن',
      label: 'لحن بیان و گویش',
      defaultValue: 'پرانرژی، صمیمی، انگیزه دهنده و تخصصی با زبان عامیانه محترمانه',
      options: [
        'پرانرژی، صمیمی، انگیزه دهنده و تخصصی با زبان عامیانه محترمانه',
        'جدی، مستندگونه و به سبک گزارش‌های حرفه‌ای تحلیلی',
        'داستان‌گو و روایی پر از کشش و تعلیق',
        'آموزشی گام‌به‌گام و بسیار شفاف و ساده'
      ]
    },
    {
      key: 'ساختار',
      label: 'الگوی ساختار روایی',
      defaultValue: 'الگوی استاندارد یوتیوب (Hook 15s + Intro 30s + 5 Main Points + CTA + Outro)',
      options: [
        'الگوی استاندارد یوتیوب (Hook 15s + Intro 30s + 5 Main Points + CTA + Outro)',
        'ساختار Problem-Agitate-Solve (بیان معضل، تحلیل و ارائه راه‌حل نهایی)',
        'روایت داستانی الهام‌بخش Case Study موفقیت‌آمیز',
        'ساختار آموزشی لیست‌محور (Top 5 Countdown)'
      ]
    }
  ]
};
