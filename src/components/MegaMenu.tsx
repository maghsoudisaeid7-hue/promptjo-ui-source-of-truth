import React, { useState } from 'react';
import { DynamicIcon } from './DynamicIcon';
import { CategoryCardData } from '../types';

export interface MegaCategory {
  id: string;
  name: string;
  iconName: string;
  slug: string;
  columns: string[][];
  enabled?: boolean;
}

export const MEGA_MENU_CATEGORIES: MegaCategory[] = [
  {
    id: 'mc1',
    name: 'تولید تصویر',
    iconName: 'Image',
    slug: 'image-generation',
    enabled: true,
    columns: [
      ['پرتره', 'لوگو', 'محصول', 'پوستر', 'تبلیغاتی'],
      ['رئال', 'سینمایی', 'مینیمال', 'سه‌بعدی', 'انیمه'],
      ['طبیعت', 'شهر', 'استودیو', 'فضای داخلی', 'فضای باز'],
    ],
  },
  {
    id: 'mc2',
    name: 'تولید ویدیو',
    iconName: 'Video',
    slug: 'video-generation',
    enabled: true,
    columns: [
      ['انیمیشن کوتاه', 'سینمایی', 'مستند', 'سناریو ویدیویی', 'زیرنویس هوشمند'],
      ['موشن گرافیک', 'پست ویدیویی', 'جلوه‌های ویژه', 'کاراکتر متحرک', 'تایپوگرافی'],
      ['تیزر تبلیغاتی', 'استوری اینستاگرام', 'موزیک ویدیو', 'رندر سه‌بعدی', 'لوگوموشن'],
    ],
  },
  {
    id: 'mc3',
    name: 'برنامه‌نویسی',
    iconName: 'Code',
    slug: 'coding',
    enabled: true,
    columns: [
      ['پایتون', 'فرانت‌اند', 'بک‌اند', 'پایگاه داده', 'طراحی وب'],
      ['اشکال‌زدایی', 'ریفکتور کد', 'کدنویسی هوشمند', 'توسعه کامپوننت', 'الگوریتم'],
      ['مستندسازی کد', 'تست نویسی', 'معماری نرم‌افزار', 'اسکریپت‌نویسی', 'API و وب‌سرویس'],
    ],
  },
  {
    id: 'mc4',
    name: 'مارکتینگ',
    iconName: 'Target',
    slug: 'marketing',
    enabled: true,
    columns: [
      ['استراتژی فروش', 'هک رشد', 'پرپوزال کاری', 'بوم کسب‌وکار', 'تحقیقات بازار'],
      ['پرسونای مخاطب', 'قیف فروش', 'تقویم محتوایی', 'آنالیز رقبا', 'برنامه‌ریزی مالی'],
      ['مذاکره و فروش', 'مدیریت پروژه', 'پشتیبانی مشتری', 'برندسازی', 'جذب سرمایه'],
    ],
  },
  {
    id: 'mc5',
    name: 'تولید محتوا',
    iconName: 'FileText',
    slug: 'content-creation',
    enabled: true,
    columns: [
      ['مقاله سئو', 'پست وبلاگ', 'توضیحات محصول', 'بازنویسی متن', 'خلاصه مقاله'],
      ['کاپشن اینستاگرام', 'ایمیل مارکتینگ', 'متن تبلیغاتی', 'سناریو یوتیوب', 'خبرنامه'],
      ['داستان کوتاه', 'ترجمه تخصصی', 'اصلاح نگارش', 'رزومه و انگیزه نامه', 'نامه‌نگاری اداری'],
    ],
  },
];

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubcategory: (subcat: string) => void;
  categories?: CategoryCardData[];
  megaCategories?: MegaCategory[];
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  onSelectSubcategory,
  categories,
  megaCategories,
}) => {
  // Dynamically build mega categories from categories prop if provided, supporting custom subcategories
  const availableCategories = React.useMemo(() => {
    if (categories && categories.length > 0) {
      const enabledCats = categories.filter((c) => c.enabled !== false);
      return enabledCats.map((c) => {
        // Find matching hardcoded category if available
        const matched = (megaCategories || MEGA_MENU_CATEGORIES).find(
          (m) => m.slug === c.slug || m.id === c.id || m.name === c.name
        );

        let subList: string[] = [];
        if (c.subcategories && Array.isArray(c.subcategories) && c.subcategories.length > 0) {
          subList = c.subcategories;
        } else if (matched && matched.columns) {
          subList = matched.columns.flat();
        } else {
          // Default subcategories if no custom subcategories are defined
          subList = ['عمومی', 'پیشرفته', 'کاربردی', 'پرامپت طلایی', 'جدیدترین‌ها', 'محبوب‌ترین'];
        }

        // Split into 3 columns
        const col1: string[] = [];
        const col2: string[] = [];
        const col3: string[] = [];
        subList.forEach((sub, i) => {
          if (i % 3 === 0) col1.push(sub);
          else if (i % 3 === 1) col2.push(sub);
          else col3.push(sub);
        });

        return {
          id: c.id || c.slug,
          name: c.name,
          iconName: c.iconName || matched?.iconName || 'Grid',
          slug: c.slug,
          columns: [col1, col2, col3],
          enabled: true,
        };
      });
    }

    return (megaCategories || MEGA_MENU_CATEGORIES).filter((mc) => mc.enabled !== false);
  }, [categories, megaCategories]);

  const [activeCategoryId, setActiveCategoryId] = useState<string>('');
  const [activeSubcat, setActiveSubcat] = useState<string>('');

  const handleCategorySwitch = (catId: string) => {
    setActiveCategoryId(catId);
    setActiveSubcat('');
  };

  const currentActiveId = activeCategoryId && availableCategories.some((c) => c.id === activeCategoryId)
    ? activeCategoryId
    : availableCategories[0]?.id || '';

  if (!isOpen || availableCategories.length === 0) return null;

  const activeCategory = availableCategories.find((c) => c.id === currentActiveId) || availableCategories[0];

  return (
    <div
      className="absolute top-full right-0 left-0 z-50 pt-2 transition-all duration-200"
      onMouseLeave={onClose}
      dir="rtl"
    >
      <div className="max-w-[920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#232833] border border-[#3A4150] outline-none ring-0 rounded-2xl shadow-2xl overflow-hidden p-4 text-right transition-all duration-200">
          <div className="flex flex-row gap-6 border-0">
            
            {/* Right Side in RTL: Main Categories List */}
            <div className="w-[28%] flex flex-col space-y-1 border-l border-[#3A4150]/80 pl-6 border-r-0 border-t-0 border-b-0">
              {availableCategories.map((cat) => {
                const isActive = cat.id === currentActiveId;
                return (
                  <button
                    key={cat.id}
                    onMouseEnter={() => handleCategorySwitch(cat.id)}
                    onClick={() => handleCategorySwitch(cat.id)}
                    className={`w-full flex items-center justify-start gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm transition-all duration-200 group ${
                      isActive
                        ? 'bg-[#D97757] text-white font-bold shadow-sm'
                        : 'text-slate-200 hover:text-white hover:bg-[#D97757] font-medium'
                    }`}
                  >
                    <DynamicIcon
                      name={cat.iconName}
                      size={18}
                      className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}
                    />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Left Side in RTL: Subcategories (3 Columns) */}
            <div className="w-[72%] grid grid-cols-3 gap-6 py-1">
              {activeCategory.columns.map((col, colIdx) => (
                <div key={colIdx} className="flex flex-col space-y-1">
                  {col.map((item, itemIdx) => {
                    const isSubActive = item === activeSubcat;
                    return (
                      <button
                        key={itemIdx}
                        onClick={() => {
                          setActiveSubcat(item);
                          onSelectSubcategory(item);
                          onClose();
                        }}
                        className={`text-right text-xs sm:text-sm transition-colors duration-150 py-1 focus:outline-none flex justify-start ${
                          isSubActive
                            ? 'text-[#D97757] font-semibold'
                            : 'text-slate-300 hover:text-[#D97757] font-normal'
                        }`}
                      >
                        <span className={`inline-block pb-[2px] ${isSubActive ? 'border-b-2 border-[#D97757]' : ''}`}>
                          {item}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
