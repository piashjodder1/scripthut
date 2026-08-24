export interface Script {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  mainImage: string;
  screenshots: string[]; // Up to 10 screenshots
  regularPrice: number;
  discountPrice?: number | null; // If set and < regularPrice, discount applies
  liveDemoUrl?: string;
  buyUrl?: string;
  downloadUrl?: string; // Direct source code download link (.zip / Drive / CDN)
  downloadPassword?: string; // Archive / Unzip password or license key
  fileSize?: string; // e.g. "48.5 MB"
  categorySlug: string;
  status: 'published' | 'draft';
  featured?: boolean;
  tags?: string[];
  version?: string;
  framework?: string;
  views?: number;
  salesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface OrderItem {
  scriptId: string;
  title: string;
  slug: string;
  price: number;
  downloadUrl?: string;
  downloadPassword?: string;
  fileSize?: string;
  version?: string;
  mainImage?: string;
  framework?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  items: OrderItem[];
  totalAmount: number;
  currencySymbol: string;
  paymentMethod: string;
  status: 'completed' | 'pending';
  downloadAccessGranted: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: 'active' | 'inactive';
  iconName?: string;
  color?: string;
  createdAt: string;
}

export interface SocialLinks {
  twitter?: string;
  telegram?: string;
  youtube?: string;
  facebook?: string;
  instagram?: string;
  github?: string;
  discord?: string;
}

export interface WebsiteSettings {
  websiteName: string;
  websiteTagline: string;
  websiteDescription: string;
  logoUrl: string;
  faviconUrl: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogImageUrl?: string;
  enableSearchIndexing?: boolean;
  headerAnnouncement?: string;
  headerAnnouncementEnabled?: boolean;
  telegramSupportUrl: string; // e.g. "https://t.me/YourSupport" or "@YourSupport"
  telegramUsername: string; // e.g. "YourSupport"
  currencySymbol: string; // e.g. "$"
  currencyCode: string; // e.g. "USD"
  socialLinks: SocialLinks;
  contactEmail: string;
  adminEmail: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export type SortOption = 'latest' | 'popular' | 'price-asc' | 'price-desc' | 'discount';
