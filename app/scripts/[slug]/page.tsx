'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScreenshotGallery } from '@/components/scripts/ScreenshotGallery';
import { PriceDisplay } from '@/components/scripts/PriceDisplay';
import { ScriptCard } from '@/components/scripts/ScriptCard';
import { EmptyState } from '@/components/common/EmptyState';
import { formatTelegramUrl, formatTelegramUsername } from '@/lib/utils';
import {
  ExternalLink,
  Send,
  ShoppingCart,
  Eye,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  FileCode,
  Share2,
  Layers,
  Calendar,
  Zap,
  Check,
  Download,
  Lock,
  Copy,
} from 'lucide-react';

export default function ScriptDetailPage() {
  const params = useParams();
  const rawSlug = params?.slug;
  const slug = typeof rawSlug === 'string' ? rawSlug : Array.isArray(rawSlug) ? rawSlug[0] : '';
  const router = useRouter();
  const {
    scripts,
    categories,
    settings,
    incrementViews,
    showToast,
    addToCart,
    removeFromCart,
    isInCart,
    isMounted,
    hasUserPurchased,
    downloadScriptPackage,
    currentUser,
  } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'features'>('overview');
  const [copiedKey, setCopiedKey] = useState(false);

  const script = scripts.find(
    (s) => s.slug === slug || s.id === slug
  );

  const inCart = isMounted && script ? isInCart(script.id) : false;
  const isPurchased = isMounted && script ? hasUserPurchased(script.id) : false;

  const handleCartToggle = () => {
    if (!script) return;
    if (inCart) {
      removeFromCart(script.id);
    } else {
      addToCart(script);
    }
  };

  const handleCopyPassword = (pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  // Increment views once per script slug
  const viewedSlugRef = React.useRef<string | null>(null);
  useEffect(() => {
    if (script?.id && viewedSlugRef.current !== script.id) {
      viewedSlugRef.current = script.id;
      incrementViews(script.id);
    }
  }, [script?.id, incrementViews]);

  // Set document title dynamically
  useEffect(() => {
    if (script) {
      document.title = `${script.title} | ${settings.websiteName || 'ScriptVault'}`;
    }
  }, [script, settings.websiteName]);

  if (!script) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <EmptyState
            title="Script Not Found"
            description="The requested script could not be found or has been removed from our catalog."
            actionText="Browse All Scripts"
            actionHref="/scripts"
            icon="alert"
          />
        </main>
        <Footer />
      </div>
    );
  }

  const category = categories.find((c) => c.slug === script.categorySlug);
  const telegramUrl = formatTelegramUrl(settings.telegramSupportUrl);
  const telegramHandle = formatTelegramUsername(settings.telegramUsername || settings.telegramSupportUrl);

  const relatedScripts = scripts
    .filter((s) => s.id !== script.id && s.categorySlug === script.categorySlug && s.status === 'published')
    .slice(0, 3);

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('success', 'Link Copied', 'Script URL copied to your clipboard.');
    }
  };

  const downloadPassword = script.downloadPassword || 'LICENSE-ACTIVE-2026';
  const fileSize = script.fileSize || '45.0 MB';

  return (
    <div className="min-h-screen flex flex-col bg-white pb-20 sm:pb-0">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-4 sm:py-8 w-full space-y-6 sm:space-y-8">
        {/* Breadcrumb Navigation - Touch scrollable on mobile */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-slate-400 overflow-x-auto whitespace-nowrap py-1 scrollbar-none">
          <Link href="/" className="hover:text-blue-600 transition-colors shrink-0">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <Link href="/scripts" className="hover:text-blue-600 transition-colors shrink-0">
            Scripts
          </Link>
          {category && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              <Link
                href={`/scripts?category=${category.slug}`}
                className="hover:text-blue-600 transition-colors shrink-0"
              >
                {category.name}
              </Link>
            </>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="text-slate-900 font-bold truncate max-w-[180px] sm:max-w-xs">{script.title}</span>
        </nav>

        {/* Top Product Header Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Cover Showcase & Gallery (Left 7 Cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            {/* Primary Cover Card */}
            <div className="relative aspect-[16/10] sm:aspect-video w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm">
              <img
                src={script.mainImage}
                alt={script.title}
                className="w-full h-full object-cover"
              />
              {script.featured && (
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-orange-500 text-white text-[10px] sm:text-xs font-black px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl shadow-md flex items-center gap-1 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Featured
                </div>
              )}
            </div>

            {/* Screenshots Gallery Section */}
            {script.screenshots && script.screenshots.some((s) => Boolean(s?.trim())) && (
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs">
                <ScreenshotGallery
                  screenshots={script.screenshots}
                  title={script.title}
                />
              </div>
            )}
          </div>

          {/* Product Purchase & Action Card (Right 5 Cols) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-7 shadow-xs space-y-5 sm:space-y-6 lg:sticky lg:top-24">
              {/* Category & Version */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[11px] sm:text-xs font-bold uppercase tracking-wider border border-blue-100">
                  {category ? category.name : script.categorySlug}
                </span>
                {script.version && (
                  <span className="text-[11px] sm:text-xs font-mono text-slate-500 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {script.version}
                  </span>
                )}
              </div>

              {/* Title & Short Description */}
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug mb-2">
                  {script.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {script.shortDescription}
                </p>
              </div>

              {/* PURCHASED STATE vs BUY STATE */}
              {isPurchased ? (
                /* Unlocked Download Area */
                <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-4 animate-in fade-in">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>You own this script package ({fileSize})</span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      downloadScriptPackage({
                        id: script.id,
                        title: script.title,
                        slug: script.slug,
                        downloadUrl: script.downloadUrl,
                        downloadPassword: downloadPassword,
                        version: script.version,
                        framework: script.framework,
                      })
                    }
                    className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Full Package (.ZIP)</span>
                  </button>

                  {/* Password & Key */}
                  <div className="p-3 bg-white border border-emerald-200 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Archive Password:</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyPassword(downloadPassword)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                    <code className="text-xs font-mono font-bold text-slate-900 block bg-slate-50 px-2 py-1 rounded border border-slate-200">
                      {downloadPassword}
                    </code>
                  </div>

                  <div className="text-center pt-1">
                    <Link
                      href="/account/downloads"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      View in My Downloads Library →
                    </Link>
                  </div>
                </div>
              ) : (
                /* Unpurchased State - Pricing Box */
                <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      License Price
                    </span>
                    <PriceDisplay
                      regularPrice={script.regularPrice}
                      discountPrice={script.discountPrice}
                      currencySymbol={settings.currencySymbol}
                      size="lg"
                    />
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Full Source Included
                    </span>
                    <span className="text-[10px] text-slate-400">Instant password-protected access</span>
                  </div>
                </div>
              )}

              {/* Primary Action Buttons (Add to Cart, Instant Checkout, Live Demo, Telegram) */}
              {!isPurchased && (
                <div className="space-y-2.5 sm:space-y-3 pt-1">
                  {/* 1. Instant Checkout & Download Button */}
                  <Link
                    href={`/checkout?script=${script.slug}`}
                    className="w-full min-h-[46px] flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white font-bold text-sm shadow-md shadow-blue-600/25 transition-all active:scale-[0.98] text-center"
                  >
                    <Zap className="w-4 h-4 shrink-0" />
                    <span>Instant Checkout & Download</span>
                  </Link>

                  {/* 2. Add to Cart Button */}
                  <button
                    type="button"
                    onClick={handleCartToggle}
                    className={`w-full min-h-[46px] flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] text-center border shadow-xs ${
                      inCart
                        ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                        : 'bg-slate-900 hover:bg-slate-800 active:bg-black text-white border-slate-900'
                    }`}
                  >
                    {inCart ? (
                      <>
                        <Check className="w-4 h-4 text-blue-600" />
                        <span>In Your Cart (Click to Remove)</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  {/* 3. Live Demo Button */}
                  {script.liveDemoUrl && (
                    <a
                      href={script.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[44px] flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs sm:text-sm transition-all text-center"
                    >
                      <Eye className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>View Live Interactive Demo</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1 text-slate-400 shrink-0" />
                    </a>
                  )}

                  {/* 4. Direct Telegram Support Button */}
                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[42px] flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl border border-blue-200 hover:bg-blue-50 text-blue-600 font-bold text-xs transition-all text-center"
                  >
                    <Send className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Telegram Support: {telegramHandle}</span>
                  </a>
                </div>
              )}

              {/* If purchased, still offer Live Demo and Telegram Support */}
              {isPurchased && (
                <div className="space-y-2.5 pt-1">
                  {script.liveDemoUrl && (
                    <a
                      href={script.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full min-h-[42px] flex items-center justify-center gap-2 py-2.5 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all text-center"
                    >
                      <Eye className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>View Live Demo</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1 text-slate-400 shrink-0" />
                    </a>
                  )}

                  <a
                    href={telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full min-h-[40px] flex items-center justify-center gap-2 py-2 px-4 rounded-2xl border border-blue-200 hover:bg-blue-50 text-blue-600 font-bold text-xs transition-all text-center"
                  >
                    <Send className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Technical Setup Support: {telegramHandle}</span>
                  </a>
                </div>
              )}

              {/* Guarantee & Specs List */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Unencrypted clean source code</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Commercial use license included</span>
                </div>
                {script.framework && (
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      Framework: <strong className="text-slate-800">{script.framework}</strong>
                    </span>
                  </div>
                )}
              </div>

              {/* Share & Views Stats */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-50">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors py-1 px-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Share script</span>
                </button>

                <span className="text-[11px] font-medium text-slate-400">
                  {script.views || 0} views
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Script Description Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">Script Overview & Documentation</h2>
          </div>

          {/* Description Body with Responsive Typography and safe wrapping */}
          <div className="prose prose-slate max-w-none text-slate-600 text-xs sm:text-sm sm:leading-relaxed break-words">
            <div className="whitespace-pre-wrap font-sans space-y-4">
              {script.fullDescription}
            </div>
          </div>

          {/* Tags list */}
          {script.tags && script.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-100">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Technologies & Tags
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                {script.tags.map((tag, idx) => (
                  <Link
                    key={idx}
                    href={`/scripts?search=${encodeURIComponent(tag)}`}
                    className="text-xs font-semibold bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 px-3 py-1 rounded-xl border border-slate-200 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Scripts */}
        {relatedScripts.length > 0 && (
          <div className="pt-4 sm:pt-6 space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-5 bg-blue-600 rounded-full inline-block" />
                <span>Related Scripts in {category?.name || 'Category'}</span>
              </h2>
              <Link
                href={`/scripts?category=${script.categorySlug}`}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedScripts.map((item) => (
                <ScriptCard key={item.id} script={item} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Persistent Bottom Quick-Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 shadow-lg flex items-center justify-between gap-3">
        <div>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Total Price
          </span>
          <PriceDisplay
            regularPrice={script.regularPrice}
            discountPrice={script.discountPrice}
            currencySymbol={settings.currencySymbol}
            size="md"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mobile Add to Cart button */}
          <button
            type="button"
            onClick={handleCartToggle}
            className={`p-2.5 rounded-xl border transition-colors ${
              inCart
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 border-slate-200'
            }`}
            title={inCart ? 'In Cart' : 'Add to Cart'}
            aria-label={inCart ? 'In Cart' : 'Add to Cart'}
          >
            {inCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>

          {script.liveDemoUrl && (
            <a
              href={script.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
              title="Live Demo"
              aria-label="Live Demo"
            >
              <Eye className="w-4 h-4 text-blue-600" />
            </a>
          )}

          {script.buyUrl ? (
            <a
              href={script.buyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600 active:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Buy Now</span>
            </a>
          ) : (
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600 active:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Buy</span>
            </a>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
