export interface HeaderMenuItem {
  id: string;
  label: string;
  href: string;
  iconName: string;
  isActive?: boolean;
}

export interface HeaderConfig {
  logoTextPrimary: string;
  logoTextSecondary: string;
  logoLinkUrl?: string;
  logoSize?: number;
  stickyHeader?: boolean;
  menuItems: HeaderMenuItem[];
  loginButtonText: string;
  loginButtonIcon: string;
}

export interface PopularSearchBarConfig {
  enabled: boolean;
  mode: 'manual' | 'user_searches' | 'external';
  randomize?: boolean;
  count?: number;
  apiUrl?: string;
}

export interface TrendingSearchItem {
  id: string;
  title: string;
  isHot?: boolean;
  link?: string;
}

export interface StatItem {
  id: string;
  label: string;
  value: string;
  iconName: string;
  enabled?: boolean;
}

export interface HeroFloatingCard {
  id: string;
  model: string;
  modelLogo: string;
  title: string;
  description: string;
  category: string;
  rating?: number;
  prompt_score?: number;
  views: string;
  views_display?: string;
  accentColor: string;
  image?: string;
  tags?: string[];
  isFree?: boolean;
  price?: number;
  fullPromptText?: string;
}

export interface HeroConfig {
  badgeText: string;
  mainTitlePrefix: string;
  mainTitleHighlight: string;
  subtitle: string;
  searchPlaceholder: string;
  searchButtonText: string;
  searchSuggestionsMode?: 'manual' | 'user_searches' | 'external';
  searchSuggestionsApiUrl?: string;
  searchSuggestionsCount?: number;
  searchSuggestions?: Array<{ id: string; title: string; link?: string; enabled?: boolean }>;
  backgroundImage?: string;
  illustrationImage?: string;
  ctaText?: string;
  ctaUrl?: string;
  stats: StatItem[];
  floatingCards: HeroFloatingCard[];
}

export interface CategoryCardData {
  id: string;
  name: string;
  slug: string;
  promptCount: string;
  description?: string;
  subtitle?: string;
  image: string;
  iconName: string;
  color: string;
  order?: number;
  enabled?: boolean;
  link?: string;
  subcategories?: string[];
}

export interface PromptCardDisplayOptions {
  showThumbnail: boolean;
  showCategory: boolean;
  showAiModel: boolean;
  showTags: boolean;
  showViews: boolean;
  showSaves: boolean;
  showCopyButton: boolean;
  showRating: boolean;
  showAuthor: boolean;
  showDate: boolean;
  show_access?: boolean;
  show_price?: boolean;
  showAccess?: boolean;
  showPrice?: boolean;
  forceState?: 1 | 2 | 3 | 4;
}

export interface PromptSectionConfig {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  itemsCount: number;
  displayMode: 'manual' | 'newest' | 'popular' | 'featured' | 'random';
  filterCategory?: string;
  filterTag?: string;
  filterAuthor?: string;
  cardDisplayOptions: PromptCardDisplayOptions;
}

export interface PromptVariableItem {
  key: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  options?: string[];
}

export interface PromptPaidAccessData {
  isPaid: boolean;
  price: number;
  originalPrice?: number;
  currency: string;
  purchaseUrl?: string;
  guaranteeText?: string;
  features?: string[];
}

export interface PromptFeatureToggles {
  outputFormat: boolean;
  negativePrompt: boolean;
  technicalParameters: boolean;
  multipleModels: boolean;
  variablesInteraction: boolean;
  paidAccess: boolean;
  featuredVideo: boolean;
  usageGuide: boolean;
  watermark: boolean;
  difficulty: boolean;
  model?: boolean;
  language: boolean;
  stats: boolean;
  tags: boolean;
  comments: boolean;
}

export interface PromptItemData {
  id: string;
  title: string;
  description: string;
  fullPromptText: string;
  featuredImage: string;
  category: string;
  aiModel: string;
  rating?: number;
  prompt_score?: number;
  views: string;
  views_display?: string;
  likes?: string | number;
  saves?: string;
  author?: string;
  createdAt?: string;
  tags?: string[];
  outputFormat?: string;
  promptType?: string;
  subcategory?: string;
  level?: string;
  language?: string;
  isVideo?: boolean;
  videoUrl?: string;
  isBookmarked?: boolean;
  isFeatured?: boolean;
  isFree?: boolean;
  price?: number;
  originalPrice?: number;
  currency?: string;
  // V3 Extended Plugin Feature Contracts
  negativePrompt?: string;
  technicalParameters?: string;
  compatibleModels?: string[];
  variables?: PromptVariableItem[];
  paidAccess?: PromptPaidAccessData;
  aspectRatio?: '16:9' | '1:1' | '9:16';
}

export interface BannerItem {
  id: string;
  title: string;
  description?: string;
  badgeText?: string;
  buttonText?: string;
  titleColor?: string;
  descColor?: string;
  badgeTextColor?: string;
  buttonTextColor?: string;
  buttonBgColor?: string;
  desktopImage?: string;
  mobileImage?: string;
  imageUrl?: string;
  mobileImageUrl?: string;
  link?: string;
  position: 'after_hero' | 'after_categories' | 'between_prompts' | 'before_newsletter' | 'before_footer';
  positions?: string[]; // Multiple display positions assignment
  size?: 'compact' | 'standard' | 'tall';
  columns?: '1' | '2';
  displayStyle?: 'card' | 'image_only';
  enabled: boolean;
  priority?: number;
  startDate?: string;
  endDate?: string;
  pages?: string[];
}

export interface AcademyBannerConfig {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl: string;
  image: string;
}

export interface NewsletterConfig {
  title: string;
  subtitle: string;
  inputPlaceholder: string;
  buttonText: string;
  disclaimer: string;
  backgroundImage?: string;
}

export interface FooterColumnLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  titleUrl?: string;
  links: FooterColumnLink[];
}

export interface FooterConfig {
  logoTextPrimary: string;
  logoTextSecondary: string;
  description: string;
  socialLinks: {
    youtube: string;
    discord: string;
    twitter: string;
    instagram: string;
    telegram: string;
  };
  columns: FooterColumn[];
  copyrightText: string;
  versionText: string;
}

export interface SectionVisibility {
  header: boolean;
  trendingBar: boolean;
  hero: boolean;
  categories: boolean;
  prompts: boolean;
  academyBanner: boolean;
  newsletter: boolean;
  footer: boolean;
  banner_after_hero?: boolean;
  banner_after_categories?: boolean;
  banner_between_prompts?: boolean;
  banner_before_newsletter?: boolean;
  banner_before_footer?: boolean;
}

export interface GlobalSettings {
  siteName: string;
  siteTagline: string;
  defaultCtaText: string;
  defaultCtaUrl: string;
  emptyStateText: string;
  successMessage: string;
  errorMessage: string;
  socialLinks: {
    youtube: string;
    discord: string;
    twitter: string;
    instagram: string;
    telegram: string;
    linkedin?: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    keywords: string;
  };
}

export interface SectionSettingItem {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
  desktopPadding: string;
  mobilePadding: string;
  marginTop: string;
  marginBottom: string;
  containerWidth: string;
  animationEnable: boolean;
  animationType: 'fade-up' | 'fade-in' | 'slide-up' | 'zoom-in' | 'none';
  animationSpeed: 'fast' | 'normal' | 'slow';
  customCssClass: string;
  htmlSectionId: string;
}

export interface DeveloperSettings {
  debugMode: boolean;
  disableCache: boolean;
  disableAnimations: boolean;
  regenerateDynamicCss: boolean;
  flushRewriteRules: boolean;
  clearTransients: boolean;
  systemInfo: {
    phpVersion: string;
    wpVersion: string;
    themeVersion: string;
    memoryLimit: string;
    maxExecutionTime: string;
  };
}

export interface TypographyOptions {
  enabled?: boolean;
  persianFontFamily: string;
  persianFontUrl?: string;
  persianFontRegularUrl?: string;
  persianFontMediumUrl?: string;
  persianFontBoldUrl?: string;
  englishFontFamily: string;
  englishFontUrl?: string;
  englishFontRegularUrl?: string;
  englishFontMediumUrl?: string;
  englishFontBoldUrl?: string;
  baseFontSize?: string;
}

export interface ThemeOptions {
  containerWidth: string;
  borderRadius: string;
  animationEnable: boolean;
  animationSpeed: 'fast' | 'normal' | 'slow';
  cardGap: string;
  contentWidth: string;
  lazyLoading: boolean;
  breadcrumbEnable: boolean;
  darkModeSupport: boolean;
  typography?: TypographyOptions;
}

export interface PromptJoData {
  globalSettings: GlobalSettings;
  themeOptions: ThemeOptions;
  sectionSettings: Record<string, SectionSettingItem>;
  developerSettings: DeveloperSettings;
  header: HeaderConfig;
  popularSearchBar: PopularSearchBarConfig;
  trendingSearches: TrendingSearchItem[];
  hero: HeroConfig;
  categories: CategoryCardData[];
  promptSectionConfig: PromptSectionConfig;
  prompts: PromptItemData[];
  banners: BannerItem[];
  academyBanner: AcademyBannerConfig;
  newsletter: NewsletterConfig;
  footer: FooterConfig;
  visibility: SectionVisibility;
  homeSectionOrder: string[];
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  message: string;
}

export type UserRole = 'کاوشگر' | 'فعال' | 'متخصص' | 'استاد';

export interface CommentUser {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  bio: string;
  interest: string;
}

export type UserProfile = CommentUser;

export interface CommentReply {
  id: string;
  user: CommentUser;
  relativeDate: string;
  content: string;
  likes: number;
  isLiked?: boolean;
  isVerified?: boolean;
}

export interface PromptComment {
  id: string;
  user: CommentUser;
  relativeDate: string;
  content: string;
  likes: number;
  isLiked?: boolean;
  isPinned?: boolean;
  isVerified?: boolean; // 🛡 تأیید PromptJo
  isBestAnswer?: boolean; // 🏆 پاسخ برتر
  replies?: CommentReply[];
}

export interface UsageGuideSection {
  title: string;
  icon?: string;
  content: string;
}

export interface PromptUsageGuide {
  purpose?: string;
  howToUse?: string;
  customization?: string;
  tips?: string;
  sections?: UsageGuideSection[];
}
