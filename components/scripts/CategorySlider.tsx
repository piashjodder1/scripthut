'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Category, Script } from '@/lib/types';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Layers,
  Server,
  Gamepad2,
  ShoppingBag,
  Globe,
  Wrench,
  Sparkles,
  Smartphone,
  Shield,
  Code2,
  Database,
  Cpu,
} from 'lucide-react';

interface CategorySliderProps {
  categories: Category[];
  scripts: Script[];
  title?: string;
  subtitle?: string;
  selectedCategory?: string;
  onSelectCategory?: (slug: string) => void;
}

// Icon helper to render appropriate Lucide icon by category name or iconName
export function getCategoryIcon(iconName?: string, name?: string) {
  const normalized = (iconName || name || '').toLowerCase();

  if (normalized.includes('react') || normalized.includes('atom') || normalized.includes('next')) {
    return <Code2 className="w-5 h-5 sm:w-6 sm:h-6" />;
  }
  if (normalized.includes('laravel') || normalized.includes('php') || normalized.includes('server') || normalized.includes('backend')) {
    return <Server className="w-5 h-5 sm:w-6 sm:h-6" />;
  }
  if (normalized.includes('game') || normalized.includes('gaming') || normalized.includes('tournament') || normalized.includes('esports')) {
    return <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6" />;
  }
  if (normalized.includes('saas') || normalized.includes('subscription') || normalized.includes('layers')) {
    return <Layers className="w-5 h-5 sm:w-6 sm:h-6" />;
  }
  if (normalized.includes('e-commerce') || normalized.includes('shop') || normalized.includes('store') || normalized.includes('cart')) {
    return <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />;
  }
  if (normalized.includes('word') || normalized.includes('globe') || normalized.includes('web')) {
    return <Globe className="w-5 h-5 sm:w-6 sm:h-6" />;
  }
  if (normalized.includes('tool') || normalized.includes('wrench') || normalized.includes('utility')) {
    return <Wrench className="w-5 h-5 sm:w-6 sm:h-6" />;
  }
  if (normalized.includes('mobile') || normalized.includes('app') || normalized.includes('flutter')) {
    return <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />;
  }
  if (normalized.includes('ai') || normalized.includes('bot') || normalized.includes('sparkle')) {
    return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />;
  }
  if (normalized.includes('db') || normalized.includes('data')) {
    return <Database className="w-5 h-5 sm:w-6 sm:h-6" />;
  }
  if (normalized.includes('security') || normalized.includes('shield')) {
    return <Shield className="w-5 h-5 sm:w-6 sm:h-6" />;
  }

  return <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />;
}

// Map category colors to tasteful solid and tinted backgrounds
function getCategoryColorStyle(cat: Category, index: number) {
  const presetPalettes = [
    { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100', hoverBorder: 'hover:border-blue-300', dot: 'bg-blue-600' },
    { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', hoverBorder: 'hover:border-indigo-300', dot: 'bg-indigo-600' },
    { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-100', hoverBorder: 'hover:border-violet-300', dot: 'bg-violet-600' },
    { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', hoverBorder: 'hover:border-emerald-300', dot: 'bg-emerald-600' },
    { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', hoverBorder: 'hover:border-amber-300', dot: 'bg-amber-600' },
    { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', hoverBorder: 'hover:border-rose-300', dot: 'bg-rose-600' },
    { bg: 'bg-sky-50', text: 'text-sky-600', border: 'border-sky-100', hoverBorder: 'hover:border-sky-300', dot: 'bg-sky-600' },
  ];

  return presetPalettes[index % presetPalettes.length];
}

export function CategorySlider({
  categories,
  scripts,
  title = 'Browse by Category',
  subtitle = 'Explore source code curated by frameworks, platforms, and application architectures.',
  selectedCategory = 'all',
  onSelectCategory,
}: CategorySliderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Filter only active categories
  const activeCategories = categories.filter((c) => c.status === 'active' || !c.status);
  const totalPublishedCount = scripts.filter((s) => s.status === 'published').length;

  // Check scroll position to enable/disable arrow buttons
  const checkScrollability = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      checkScrollability();
      el.addEventListener('scroll', checkScrollability, { passive: true });
      window.addEventListener('resize', checkScrollability);
      return () => {
        el.removeEventListener('scroll', checkScrollability);
        window.removeEventListener('resize', checkScrollability);
      };
    }
  }, [activeCategories.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const cardWidth = container.clientWidth > 640 ? 320 : 260;
    const scrollAmount = direction === 'left' ? -cardWidth * 1.5 : cardWidth * 1.5;

    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  if (activeCategories.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 border-b border-slate-100 bg-white" id="categories-section">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold mb-2">
              <Sparkles className="w-3 h-3" />
              <span>Categorized Scripts</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl font-normal">
              {subtitle}
            </p>
          </div>

          {/* Navigation Controls: Arrow buttons & All Scripts link */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {selectedCategory !== 'all' && onSelectCategory && (
              <button
                type="button"
                onClick={() => onSelectCategory('all')}
                className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer mr-1"
              >
                Reset Filter
              </button>
            )}

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className={`p-2 rounded-xl border transition-all ${
                  canScrollLeft
                    ? 'bg-white border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 shadow-2xs cursor-pointer'
                    : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                }`}
                aria-label="Previous categories"
                title="Previous categories"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className={`p-2 rounded-xl border transition-all ${
                  canScrollRight
                    ? 'bg-white border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 shadow-2xs cursor-pointer'
                    : 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                }`}
                aria-label="Next categories"
                title="Next categories"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              href="/scripts"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pl-2 hover:underline"
            >
              <span>All Scripts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Horizontal Slider Content */}
        <div className="relative -mx-3.5 sm:-mx-8 px-3.5 sm:px-8">
          <div
            ref={scrollContainerRef}
            className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto scrollbar-none py-1.5 snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {/* "All Scripts" Card */}
            <div
              onClick={() => onSelectCategory?.('all')}
              className={`group shrink-0 w-[220px] sm:w-[260px] p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between snap-start cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-400/50'
                  : 'bg-slate-50/70 hover:bg-white text-slate-900 border-slate-200/90 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 border ${
                      selectedCategory === 'all'
                        ? 'bg-white/20 text-white border-white/30'
                        : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}
                  >
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-2xs ${
                      selectedCategory === 'all'
                        ? 'bg-white/20 border-white/30 text-white'
                        : 'bg-white border-slate-200 text-slate-600 group-hover:text-blue-600 group-hover:border-blue-200'
                    }`}
                  >
                    {totalPublishedCount} {totalPublishedCount === 1 ? 'script' : 'scripts'}
                  </span>
                </div>

                <h3
                  className={`text-sm sm:text-base font-extrabold line-clamp-1 ${
                    selectedCategory === 'all' ? 'text-white' : 'text-slate-900 group-hover:text-blue-600'
                  }`}
                >
                  All Scripts
                </h3>
                <p
                  className={`text-xs mt-1 line-clamp-2 leading-relaxed font-normal ${
                    selectedCategory === 'all' ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  Explore our entire catalog of ready-to-use scripts and applications.
                </p>
              </div>

              <div
                className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-bold ${
                  selectedCategory === 'all'
                    ? 'border-white/20 text-white'
                    : 'border-slate-200/60 text-slate-600 group-hover:text-blue-600'
                }`}
              >
                <span>{selectedCategory === 'all' ? 'Viewing All' : 'Show All'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Individual Category Cards */}
            {activeCategories.map((cat, index) => {
              const colorPalette = getCategoryColorStyle(cat, index);
              const count = scripts.filter(
                (s) => s.categorySlug === cat.slug && s.status === 'published'
              ).length;
              const isSelected = selectedCategory === cat.slug;

              const cardContent = (
                <div className="flex flex-col justify-between h-full">
                  <div>
                    {/* Top Bar: Icon + Count */}
                    <div className="flex items-center justify-between mb-3.5">
                      <div
                        className={`w-11 h-11 rounded-xl ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : `${colorPalette.bg} ${colorPalette.text} border ${colorPalette.border}`
                        } flex items-center justify-center transition-transform group-hover:scale-105`}
                      >
                        {getCategoryIcon(cat.iconName, cat.name)}
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full border transition-colors shadow-2xs ${
                          isSelected
                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                            : 'bg-white border-slate-200/90 text-slate-600 group-hover:text-blue-600 group-hover:border-blue-200'
                        }`}
                      >
                        {count} {count === 1 ? 'script' : 'scripts'}
                      </span>
                    </div>

                    {/* Category Info */}
                    <h3
                      className={`text-sm sm:text-base font-extrabold transition-colors line-clamp-1 ${
                        isSelected ? 'text-blue-600' : 'text-slate-900 group-hover:text-blue-600'
                      }`}
                    >
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-normal">
                      {cat.description || 'Browse all scripts and ready-made source code in this category.'}
                    </p>
                  </div>

                  {/* Bottom Action */}
                  <div
                    className={`mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold transition-colors ${
                      isSelected ? 'text-blue-600' : 'text-slate-600 group-hover:text-blue-600'
                    }`}
                  >
                    <span>{isSelected ? 'Active Filter' : 'Filter by Category'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );

              if (onSelectCategory) {
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onSelectCategory(isSelected ? 'all' : cat.slug)}
                    className={`group shrink-0 w-[240px] sm:w-[280px] p-4 sm:p-5 rounded-2xl border transition-all duration-200 snap-start text-left cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-400/40 shadow-md -translate-y-0.5'
                        : `bg-slate-50/60 hover:bg-white border-slate-200/80 ${colorPalette.hoverBorder} hover:shadow-md hover:-translate-y-0.5`
                    }`}
                  >
                    {cardContent}
                  </button>
                );
              }

              return (
                <Link
                  key={cat.id}
                  href={`/scripts?category=${cat.slug}`}
                  className={`group shrink-0 w-[240px] sm:w-[280px] p-4 sm:p-5 rounded-2xl border transition-all duration-200 snap-start flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-500 ring-2 ring-blue-400/40 shadow-md -translate-y-0.5'
                      : `bg-slate-50/60 hover:bg-white border-slate-200/80 ${colorPalette.hoverBorder} hover:shadow-md hover:-translate-y-0.5`
                  }`}
                >
                  {cardContent}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
