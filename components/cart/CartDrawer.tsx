'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { formatPrice, formatTelegramUrl, formatTelegramUsername } from '@/lib/utils';
import {
  X,
  ShoppingCart,
  Trash2,
  Send,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, clearCart, cartTotal, settings } = useApp();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  // Prevent background body scrolling when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const telegramBaseUrl = formatTelegramUrl(settings.telegramSupportUrl);
  const telegramHandle = formatTelegramUsername(settings.telegramUsername || settings.telegramSupportUrl);

  // Generate Telegram bulk order message
  const generateTelegramOrderUrl = () => {
    if (cart.length === 0) return telegramBaseUrl;

    const itemListText = cart
      .map((item, idx) => {
        const price =
          item.discountPrice !== null && item.discountPrice !== undefined && item.discountPrice < item.regularPrice
            ? item.discountPrice
            : item.regularPrice;
        return `${idx + 1}. ${item.title} (${formatPrice(price, settings.currencySymbol)})`;
      })
      .join('\n');

    const totalText = formatPrice(cartTotal, settings.currencySymbol);
    const message = `Hello! I would like to purchase the following ${cart.length} script(s) from ${settings.websiteName || 'ScriptVault'}:\n\n${itemListText}\n\nTotal: ${totalText}\n\nPlease provide payment details and instant source delivery!`;

    const encodedText = encodeURIComponent(message);
    if (telegramBaseUrl.includes('?')) {
      return `${telegramBaseUrl}&text=${encodedText}`;
    }
    return `${telegramBaseUrl}?text=${encodedText}`;
  };

  // Calculate total original price to display savings
  const originalTotal = cart.reduce((sum, item) => sum + (Number(item.regularPrice) || 0), 0);
  const totalSavings = originalTotal - cartTotal;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Script Cart</span>
                  {cart.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-bold">
                      {cart.length}
                    </span>
                  )}
                </h2>
                <p className="text-[11px] text-slate-400 font-medium">Review your selected digital assets</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List / Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 my-auto min-h-[300px]">
                <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-inner">
                  <ShoppingCart className="w-8 h-8 opacity-60" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800">Your Cart is Empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                    You have not added any scripts or templates yet. Browse our catalog to find verified source codes!
                  </p>
                </div>
                <Link
                  href="/scripts"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
                >
                  <span>Browse Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Selected Items ({cart.length})
                  </span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-[11px] font-bold text-red-500 hover:text-red-600 hover:underline transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                {cart.map((item) => {
                  const hasDiscount =
                    item.discountPrice !== null &&
                    item.discountPrice !== undefined &&
                    item.discountPrice < item.regularPrice;
                  const itemPrice = hasDiscount ? item.discountPrice! : item.regularPrice;

                  return (
                    <div
                      key={item.id}
                      className="group bg-slate-50/70 hover:bg-slate-50 p-3 rounded-2xl border border-slate-200/80 transition-all flex items-start gap-3"
                    >
                      {/* Thumbnail */}
                      <Link
                        href={`/scripts/${item.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200 block"
                      >
                        <img
                          src={item.mainImage || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=300&auto=format&fit=crop'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        {item.framework && (
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-0.5">
                            {item.framework}
                          </span>
                        )}
                        <Link
                          href={`/scripts/${item.slug}`}
                          onClick={() => setIsCartOpen(false)}
                          className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors line-clamp-1 block"
                        >
                          {item.title}
                        </Link>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-black text-slate-900">
                              {formatPrice(itemPrice, settings.currencySymbol)}
                            </span>
                            {hasDiscount && (
                              <span className="text-[10px] text-slate-400 line-through font-medium">
                                {formatPrice(item.regularPrice, settings.currencySymbol)}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Remove script"
                            aria-label={`Remove ${item.title}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-3 shadow-lg">
              {/* Calculations */}
              <div className="space-y-1.5 text-xs">
                {totalSavings > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-semibold">
                    <span>Discount Savings</span>
                    <span>-{formatPrice(totalSavings, settings.currencySymbol)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-900 font-extrabold text-base pt-1">
                  <span>Total Amount</span>
                  <span className="text-xl font-black text-blue-600">
                    {formatPrice(cartTotal, settings.currencySymbol)}
                  </span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="flex items-center justify-center gap-3 py-1 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Full Source Code
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-blue-600" /> Instant Download Access
                </span>
              </div>

              {/* Primary Instant Checkout Button */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full min-h-[46px] flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all text-center"
              >
                <Zap className="w-4 h-4 shrink-0" />
                <span>Instant Checkout & Download ({formatPrice(cartTotal, settings.currencySymbol)})</span>
              </Link>

              {/* Secondary Telegram Checkout Button */}
              <a
                href={generateTelegramOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[40px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all text-center"
              >
                <Send className="w-3.5 h-3.5 shrink-0 text-sky-600" />
                <span>Or Order via Telegram Support</span>
              </a>

              {/* Continue Shopping */}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-2 text-center text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
              >
                Continue Browsing Catalog
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
