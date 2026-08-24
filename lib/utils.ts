import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculates discount percentage.
 * Formula: ((regularPrice - discountPrice) / regularPrice) * 100
 * Returns 0 if invalid or discount >= regular.
 */
export function calculateDiscountPercentage(regularPrice: number, discountPrice?: number | null): number {
  if (
    typeof regularPrice !== 'number' ||
    regularPrice <= 0 ||
    discountPrice === undefined ||
    discountPrice === null ||
    typeof discountPrice !== 'number' ||
    discountPrice <= 0 ||
    discountPrice >= regularPrice
  ) {
    return 0;
  }

  const discount = Math.round(((regularPrice - discountPrice) / regularPrice) * 100);
  return Math.max(0, Math.min(99, discount));
}

/**
 * Format price with currency symbol.
 */
export function formatPrice(price: number | undefined | null, symbol: string = '$'): string {
  if (price === undefined || price === null || isNaN(price)) return `${symbol}0.00`;
  return `${symbol}${Number(price).toFixed(price % 1 === 0 ? 0 : 2)}`;
}

/**
 * Generates an SEO friendly slug from a title.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Formats a Telegram username / link into a clean clickable URL
 */
export function formatTelegramUrl(input: string): string {
  if (!input) return 'https://t.me/ScriptHubSupport';
  const clean = input.trim();
  if (clean.startsWith('http://') || clean.startsWith('https://')) {
    return clean;
  }
  if (clean.startsWith('@')) {
    return `https://t.me/${clean.substring(1)}`;
  }
  if (clean.startsWith('t.me/')) {
    return `https://${clean}`;
  }
  return `https://t.me/${clean}`;
}

/**
 * Formats a Telegram username with @
 */
export function formatTelegramUsername(input: string): string {
  if (!input) return '@ScriptHubSupport';
  const clean = input.trim();
  if (clean.startsWith('https://t.me/')) {
    return `@${clean.replace('https://t.me/', '')}`;
  }
  if (clean.startsWith('http://t.me/')) {
    return `@${clean.replace('http://t.me/', '')}`;
  }
  if (clean.startsWith('@')) {
    return clean;
  }
  return `@${clean}`;
}

/**
 * Validates external URL
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
