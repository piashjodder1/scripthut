'use client';

import React from 'react';
import Link from 'next/link';
import { Script } from '@/lib/types';
import { useApp } from '@/context/AppContext';
import { calculateDiscountPercentage, formatPrice } from '@/lib/utils';
import { Sparkles, ArrowRight, ShoppingCart, Check } from 'lucide-react';

interface ScriptCardProps {
  script: Script;
  viewMode?: 'grid' | 'list';
}

export function ScriptCard({ script, viewMode = 'grid' }: ScriptCardProps) {
  const { categories, settings, addToCart, removeFromCart, isInCart, isMounted } = useApp();
  const category = categories.find((c) => c.slug === script.categorySlug);

  const inCart = isMounted ? isInCart(script.id) : false;

  const handleCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart) {
      removeFromCart(script.id);
    } else {
      addToCart(script);
    }
  };

  const discountPercent = calculateDiscountPercentage(script.regularPrice, script.discountPrice);
  const hasDiscount = discountPercent > 0 && script.discountPrice !== null && script.discountPrice !== undefined;
  const effectivePrice = hasDiscount ? script.discountPrice! : script.regularPrice;

  // Check if created recently (last 14 days)
  const isNew =
    new Date().getTime() - new Date(script.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000;

  if (viewMode === 'list') {
    return (
      <div className="group bg-white border border-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-lg transition-all flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <div className="aspect-[16/10] sm:aspect-auto sm:w-64 sm:min-w-[16rem] bg-slate-100 relative overflow-hidden shrink-0">
          <img
            src={script.mainImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop'}
            alt={script.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Badges in top-left */}
          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
            {hasDiscount ? (
              <span className="bg-red-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:py-1 rounded-md uppercase tracking-wider shadow-xs">
                {discountPercent}% OFF
              </span>
            ) : script.featured ? (
              <span className="bg-orange-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:py-1 rounded-md uppercase tracking-wider shadow-xs flex items-center gap-1">
                BEST SELLER
              </span>
            ) : isNew ? (
              <span className="bg-emerald-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:py-1 rounded-md uppercase tracking-wider shadow-xs">
                NEW
              </span>
            ) : null}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="text-[11px] sm:text-xs font-bold text-blue-600 mb-1 tracking-wider uppercase">
              {script.framework || (category ? category.name : script.categorySlug)}
            </div>

            <Link href={`/scripts/${script.slug}`}>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                {script.title}
              </h3>
            </Link>

            <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-3 sm:mb-4 leading-relaxed">
              {script.shortDescription}
            </p>

            {script.tags && script.tags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mb-3 sm:mb-4">
                {script.tags.slice(0, 4).map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] sm:text-[11px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-100"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              {hasDiscount && (
                <span className="text-slate-400 line-through text-[11px] sm:text-xs block font-medium">
                  {formatPrice(script.regularPrice, settings.currencySymbol)}
                </span>
              )}
              <div className="text-lg sm:text-xl font-black text-slate-900">
                {formatPrice(effectivePrice, settings.currencySymbol)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCartClick}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 border ${
                  inCart
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border-slate-200 hover:border-blue-200'
                }`}
                title={inCart ? 'In Cart (Click to Remove)' : 'Add to Cart'}
              >
                {inCart ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>In Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <Link
                href={`/scripts/${script.slug}`}
                className="bg-slate-900 hover:bg-blue-600 active:bg-blue-700 text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all inline-flex items-center gap-1.5 shadow-xs"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white border border-slate-200 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-lg transition-all flex flex-col h-full">
      {/* Thumbnail */}
      <div className="aspect-[16/10] sm:aspect-video bg-slate-100 relative overflow-hidden">
        {/* Badges in top-left */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 flex flex-col gap-1">
          {hasDiscount ? (
            <span className="bg-red-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:py-1 rounded-md uppercase tracking-wider shadow-xs">
              {discountPercent}% OFF
            </span>
          ) : script.featured ? (
            <span className="bg-orange-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:py-1 rounded-md uppercase tracking-wider shadow-xs flex items-center gap-1">
              BEST SELLER
            </span>
          ) : isNew ? (
            <span className="bg-emerald-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 sm:py-1 rounded-md uppercase tracking-wider shadow-xs">
              NEW
            </span>
          ) : null}
        </div>

        {/* Quick Add to Cart Button on Image Hover */}
        <button
          type="button"
          onClick={handleCartClick}
          className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 p-2 rounded-xl backdrop-blur-md transition-all shadow-xs ${
            inCart
              ? 'bg-blue-600 text-white opacity-100 scale-100'
              : 'bg-white/90 text-slate-700 hover:text-blue-600 hover:bg-white opacity-90 sm:opacity-0 sm:group-hover:opacity-100 scale-95 sm:group-hover:scale-100'
          }`}
          title={inCart ? 'In Cart (Click to Remove)' : 'Add to Cart'}
          aria-label="Add to cart"
        >
          {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
        </button>

        <img
          src={script.mainImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop'}
          alt={script.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] sm:text-xs font-bold text-blue-600 mb-1 tracking-wider uppercase">
            {script.framework || (category ? category.name : script.categorySlug)}
          </div>

          <Link href={`/scripts/${script.slug}`}>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
              {script.title}
            </h3>
          </Link>

          <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-3 sm:mb-4 leading-relaxed">
            {script.shortDescription}
          </p>
        </div>

        <div>
          {/* Tags */}
          {script.tags && script.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap mb-3 sm:mb-4">
              {script.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium bg-slate-50 text-slate-600 px-2 py-0.5 rounded-md border border-slate-100"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Pricing and Action Buttons */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div>
              {hasDiscount && (
                <span className="text-slate-400 line-through text-[11px] sm:text-xs block font-medium">
                  {formatPrice(script.regularPrice, settings.currencySymbol)}
                </span>
              )}
              <div className="text-lg sm:text-xl font-black text-slate-900">
                {formatPrice(effectivePrice, settings.currencySymbol)}
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCartClick}
                className={`p-2 rounded-xl border transition-all ${
                  inCart
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border-slate-200 hover:border-blue-200'
                }`}
                title={inCart ? 'In Cart (Click to Remove)' : 'Add to Cart'}
                aria-label={inCart ? 'In Cart' : 'Add to Cart'}
              >
                {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
              </button>

              <Link
                href={`/scripts/${script.slug}`}
                className="bg-slate-900 hover:bg-blue-600 active:bg-blue-700 text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all inline-flex items-center gap-1 shadow-xs"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
