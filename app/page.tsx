'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScriptCard } from '@/components/scripts/ScriptCard';
import { CategorySlider } from '@/components/scripts/CategorySlider';
import { formatTelegramUrl, formatTelegramUsername } from '@/lib/utils';
import {
  Search,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code2,
  RotateCcw,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { scripts, categories, settings } = useApp();
  const [heroSearch, setHeroSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const telegramUrl = formatTelegramUrl(settings.telegramSupportUrl);
  const telegramHandle = formatTelegramUsername(settings.telegramUsername || settings.telegramSupportUrl);

  const publishedScripts = scripts.filter((s) => s.status === 'published');
  const activeCatObj = categories.find((c) => c.slug === selectedCategory);
  const categoryFilteredScripts = publishedScripts.filter(
    (s) => s.categorySlug === selectedCategory
  );

  const featuredScripts = publishedScripts.filter((s) => s.featured);
  const latestScripts = [...publishedScripts]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);
  const discountedScripts = publishedScripts.filter(
    (s) => s.discountPrice && s.discountPrice < s.regularPrice
  );

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      router.push(`/scripts?search=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      router.push('/scripts');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* 1. SLEEK HERO SECTION */}
        <section className="bg-slate-50 border-b border-slate-100 py-10 sm:py-16 px-3.5 sm:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-[11px] sm:text-xs font-bold mb-4 sm:mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>Verified Clean Code & Instant Source Delivery</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-3 sm:mb-4 leading-tight sm:leading-none">
              Premium Scripts for Your{' '}
              <span className="text-blue-600 block sm:inline">Next Project</span>
            </h1>

            {/* Subheading */}
            <p className="text-xs sm:text-base lg:text-lg text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
              Discover production-ready web and mobile solutions with live interactive demos and direct Telegram support.
            </p>

            {/* Search Input Bar */}
            <form onSubmit={handleHeroSearch} className="relative max-w-xl mx-auto">
              <div className="relative flex items-center bg-white rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 sm:left-4 pointer-events-none" />
                <input
                  type="text"
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  placeholder="Search scripts, frameworks, tags..."
                  className="w-full pl-10 sm:pl-12 pr-20 sm:pr-28 py-3 sm:py-4 rounded-2xl bg-transparent outline-none text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 font-medium"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* 2. CATEGORY SLIDER SECTION */}
        <CategorySlider
          categories={categories}
          scripts={publishedScripts}
          selectedCategory={selectedCategory}
          onSelectCategory={handleCategorySelect}
        />

        {/* 3. DYNAMIC CATEGORY FILTERED VIEW OR DEFAULT SECTIONS */}
        {selectedCategory !== 'all' ? (
          <section id="category-filtered-section" className="py-8 sm:py-12 max-w-7xl mx-auto px-3.5 sm:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-5 border-b border-slate-100">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="w-2 h-6 bg-blue-600 rounded-full inline-block" />
                  <h2 className="text-lg sm:text-2xl font-black text-slate-900">
                    {activeCatObj?.name || 'Category'} Scripts
                  </h2>
                  <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200">
                    {categoryFilteredScripts.length} {categoryFilteredScripts.length === 1 ? 'script found' : 'scripts found'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
                  {activeCatObj?.description || `Browsing all ready-to-use scripts in ${activeCatObj?.name || 'this category'}.`}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Show All Categories</span>
                </button>

                <Link
                  href={`/scripts?category=${selectedCategory}`}
                  className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5"
                >
                  <span>Advanced Filters</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {categoryFilteredScripts.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200/80 p-8 max-w-xl mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                  <Code2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">No scripts found in this category</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  There are currently no published scripts under {activeCatObj?.name || 'this category'}.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>View All Scripts</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {categoryFilteredScripts.map((script) => (
                  <ScriptCard key={script.id} script={script} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* 3. FEATURED SCRIPTS SECTION */}
            {featuredScripts.length > 0 && (
              <section className="py-8 sm:py-12 max-w-7xl mx-auto px-3.5 sm:px-8">
                <div className="flex items-center justify-between mb-5 sm:mb-8">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 sm:w-2 h-5 sm:h-6 bg-blue-600 rounded-full inline-block" />
                    <span>Featured Scripts</span>
                  </h2>

                  <Link
                    href="/scripts"
                    className="text-blue-600 font-bold text-xs sm:text-sm hover:underline inline-flex items-center gap-1"
                  >
                    <span>View all</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {featuredScripts.map((script) => (
                    <ScriptCard key={script.id} script={script} />
                  ))}
                </div>
              </section>
            )}

            {/* 4. SPECIAL OFFERS / DISCOUNT SECTION */}
            {discountedScripts.length > 0 && (
              <section className="py-8 sm:py-12 bg-slate-50 border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-3.5 sm:px-8">
                  <div className="flex items-center justify-between mb-5 sm:mb-8">
                    <div>
                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 sm:w-2 h-5 sm:h-6 bg-red-500 rounded-full inline-block" />
                        <span>Special Deals & Discounts</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Save up to 50% on top rated digital scripts with instant source code.
                      </p>
                    </div>

                    <Link
                      href="/scripts?discounted=true"
                      className="text-blue-600 font-bold text-xs sm:text-sm hover:underline inline-flex items-center gap-1 shrink-0 ml-2"
                    >
                      <span>Deals</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {discountedScripts.slice(0, 4).map((script) => (
                      <ScriptCard key={script.id} script={script} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* 5. LATEST SCRIPTS SECTION */}
            <section className="py-8 sm:py-12 max-w-7xl mx-auto px-3.5 sm:px-8">
              <div className="flex items-center justify-between mb-5 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <span className="w-1.5 sm:w-2 h-5 sm:h-6 bg-blue-600 rounded-full inline-block" />
                  <span>Latest Releases</span>
                </h2>

                <Link
                  href="/scripts?sort=latest"
                  className="text-blue-600 font-bold text-xs sm:text-sm hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore all</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {latestScripts.map((script) => (
                  <ScriptCard key={script.id} script={script} />
                ))}
              </div>
            </section>
          </>
        )}

        {/* 5. WHY CHOOSE US */}
        <section className="py-10 sm:py-14 bg-slate-50 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-3.5 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Why Developers Choose Our Marketplace
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Built to accelerate your launch with reliable code, interactive demos, and straightforward licensing.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Feature 1 */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-2.5 sm:space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Code2 className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Clean & Documented</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Every script includes clear directory structures, comments, and step-by-step setup guides.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-2.5 sm:space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Instant Live Demos</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Test full admin and frontend interfaces live before committing to a purchase.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-2.5 sm:space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Send className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Direct Telegram Support</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  No ticket queues or delays. Connect directly with real support agents on Telegram.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-2.5 sm:space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Verified Architecture</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Battle-tested on Next.js, React, Node.js, and modern PHP/Laravel stacks.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. TELEGRAM SUPPORT CTA BANNER */}
        <section className="py-10 sm:py-14 max-w-7xl mx-auto px-3.5 sm:px-8">
          <div className="rounded-2xl sm:rounded-3xl bg-blue-600 text-white p-6 sm:p-12 shadow-xl shadow-blue-600/15 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-xl space-y-2.5 sm:space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-[11px] sm:text-xs font-bold">
                <Send className="w-3.5 h-3.5" />
                <span>24/7 Dedicated Assistance</span>
              </div>

              <h2 className="text-xl sm:text-3xl font-black tracking-tight">
                Need Help Choosing the Right Script?
              </h2>

              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Connect directly with our team on Telegram for pre-sales inquiries, custom modifications, and live setup guidance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-full bg-white hover:bg-slate-50 active:bg-slate-100 text-blue-600 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                <Send className="w-4 h-4 shrink-0" />
                <span className="truncate">Chat on Telegram: {telegramHandle}</span>
              </a>

              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-full bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-xs sm:text-sm transition-all"
              >
                <span>Contact Support</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
