import React from 'react';
import { calculateDiscountPercentage, formatPrice } from '@/lib/utils';
import { Badge } from '@/components/common/Badge';

interface PriceDisplayProps {
  regularPrice: number;
  discountPrice?: number | null;
  currencySymbol?: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export function PriceDisplay({
  regularPrice,
  discountPrice,
  currencySymbol = '$',
  size = 'md',
  showBadge = true,
}: PriceDisplayProps) {
  const discountPercent = calculateDiscountPercentage(regularPrice, discountPrice);
  const hasDiscount = discountPercent > 0 && discountPrice !== null && discountPrice !== undefined;

  const fontSizes = {
    sm: {
      current: 'text-base font-bold text-slate-900',
      regular: 'text-xs text-slate-400 line-through',
    },
    md: {
      current: 'text-xl font-bold text-slate-900',
      regular: 'text-sm text-slate-400 line-through',
    },
    lg: {
      current: 'text-3xl font-extrabold text-slate-900 tracking-tight',
      regular: 'text-lg text-slate-400 line-through',
    },
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {hasDiscount ? (
        <>
          <span className={fontSizes[size].current}>
            {formatPrice(discountPrice, currencySymbol)}
          </span>
          <span className={fontSizes[size].regular}>
            {formatPrice(regularPrice, currencySymbol)}
          </span>
          {showBadge && (
            <Badge variant="discount" size={size === 'lg' ? 'md' : 'sm'}>
              {discountPercent}% OFF
            </Badge>
          )}
        </>
      ) : (
        <span className={fontSizes[size].current}>
          {formatPrice(regularPrice, currencySymbol)}
        </span>
      )}
    </div>
  );
}
