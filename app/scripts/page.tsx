'use client';

import React, { useState, useMemo, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ScriptCard } from '@/components/scripts/ScriptCard';
import { FilterPanel } from '@/components/scripts/FilterPanel';
import { EmptyState } from '@/components/common/EmptyState';
import { Pagination } from '@/components/common/Pagination';
import { SortOption } from '@/lib/types';
import {
  LayoutGrid,
  List,
  Filter,
  X,
  Sparkles,
} from 'lucide-react';

function ScriptsContent() {
  const searchParams = useSearchParams();
  const { scripts, categories } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>(() => searchParams.get('category') || 'all');
  const [selectedSort, setSelectedSort] = useState<SortOption>(() => (searchParams.get('sort') as SortOption) || 'latest');
  const [search, setSearch] = useState<string>(() => searchParams.get('search') || '');
  const [onlyDiscounted, setOnlyDiscounted] = useState<boolean>(() => searchParams.get('discounted') === 'true');
  const [priceRange, setPriceRange] = useState<'all' | 'under30' | 'under60' | '60plus'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: SortOption) => {
    setSelectedSort(sort);
    setCurrentPage(1);
  };

  const handleSearchChange = (q: string) => {
    setSearch(q);
    setCurrentPage(1);
  };

  const handleDiscountToggle = (val: boolean) => {
    setOnlyDiscounted(val);
    setCurrentPage(1);
  };

  const handlePriceRangeChange = (range: 'all' | 'under30' | 'under60' | '60plus') => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  // Filter & Sort computation
  const filteredScripts = useMemo(() => {
    return scripts
      .filter((script) => {
        // Only show published scripts on public page
        if (script.status !== 'published') return false;

        // Category filter
        if (selectedCategory !== 'all' && script.categorySlug !== selectedCategory) {
          return false;
        }

        // Search query
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = script.title.toLowerCase().includes(q);
          const matchDesc = script.shortDescription.toLowerCase().includes(q);
          const matchTags = script.tags?.some((t) => t.toLowerCase().includes(q));
          const matchFramework = script.framework?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchTags && !matchFramework) return false;
        }

        // Discount filter
        if (onlyDiscounted) {
          if (!script.discountPrice || script.discountPrice >= script.regularPrice) {
            return false;
          }
        }

        // Price range
        const effectivePrice =
          script.discountPrice && script.discountPrice < script.regularPrice
            ? script.discountPrice
            : script.regularPrice;

        if (priceRange === 'under30' && effectivePrice >= 30) return false;
        if (priceRange === 'under60' && (effectivePrice < 30 || effectivePrice >= 60)) return false;
        if (priceRange === '60plus' && effectivePrice < 60) return false;

        return true;
      })
      .sort((a, b) => {
        const effectivePriceA =
          a.discountPrice && a.discountPrice < a.regularPrice ? a.discountPrice : a.regularPrice;
        const effectivePriceB =
          b.discountPrice && b.discountPrice < b.regularPrice ? b.discountPrice : b.regularPrice;

        if (selectedSort === 'latest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (selectedSort === 'popular') {
          return (b.views || 0) - (a.views || 0);
        }
        if (selectedSort === 'price-asc') {
          return effectivePriceA - effectivePriceB;
        }
        if (selectedSort === 'price-desc') {
          return effectivePriceB - effectivePriceA;
        }
        if (selectedSort === 'discount') {
          const discA = a.discountPrice ? a.regularPrice - a.discountPrice : 0;
          const discB = b.discountPrice ? b.regularPrice - b.discountPrice : 0;
          return discB - discA;
        }
        return 0;
      });
  }, [scripts, selectedCategory, selectedSort, search, onlyDiscounted, priceRange]);

  const totalPages = Math.ceil(filteredScripts.length / itemsPerPage);
  const paginatedScripts = filteredScripts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSort('latest');
    setSearch('');
    setOnlyDiscounted(false);
    setPriceRange('all');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSort !== 'latest' ||
    search.trim() !== '' ||
    onlyDiscounted ||
    priceRange !== 'all';

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Sleek Subheader */}
      <div className="bg-slate-50 border-b border-slate-100 py-6 sm:py-8 px-3.5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-1.5 sm:w-2 h-6 sm:h-7 bg-blue-600 rounded-full inline-block" />
            <span>{activeCategoryObj ? activeCategoryObj.name : 'All Scripts & Templates'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {activeCategoryObj?.description ||
              'Explore our complete catalog of verified, production-ready web and mobile scripts.'}
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 w-full">
        {/* Layout with Sidebar on Desktop & Grid on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8 items-start">
          {/* Desktop Filter Panel */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <FilterPanel
              selectedCategory={selectedCategory}
              onSelectCategory={handleCategoryChange}
              selectedSort={selectedSort}
              onSelectSort={handleSortChange}
              search={search}
              onSearchChange={handleSearchChange}
              onlyDiscounted={onlyDiscounted}
              onToggleDiscounted={handleDiscountToggle}
              priceRange={priceRange}
              onSelectPriceRange={handlePriceRangeChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Main Listings Column */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-5">
            {/* Quick Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
              <button
                type="button"
                onClick={() => handleCategoryChange('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                All Categories ({scripts.filter((s) => s.status === 'published').length})
              </button>
              {categories
                .filter((c) => c.status === 'active' || !c.status)
                .map((cat) => {
                  const count = scripts.filter(
                    (s) => s.categorySlug === cat.slug && s.status === 'published'
                  ).length;
                  const isSelected = selectedCategory === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {cat.name} ({count})
                    </button>
                  );
                })}
            </div>

            {/* Top Toolbar */}
            <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-3.5 sm:p-4 shadow-xs flex items-center justify-between gap-3">
              <div className="text-xs sm:text-sm font-semibold text-slate-500">
                Showing{' '}
                <span className="text-slate-900 font-bold">{filteredScripts.length}</span>{' '}
                {filteredScripts.length === 1 ? 'script' : 'scripts'}
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile Filter Drawer Button */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                </button>

                {/* View Mode Toggle */}
                <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/50">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Grid / List */}
            {filteredScripts.length === 0 ? (
              <EmptyState
                title="No Scripts Found"
                description="No scripts match your current search and filter criteria. Try clearing some filters or searching for another keyword."
                actionText="Reset All Filters"
                onActionClick={handleResetFilters}
                icon="search"
              />
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6'
                    : 'space-y-4'
                }
              >
                {paginatedScripts.map((script) => (
                  <ScriptCard key={script.id} script={script} viewMode={viewMode} />
                ))}
              </div>
            )}

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-sm bg-white h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between z-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-sm">Filter Catalog</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:bg-slate-200"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterPanel
                selectedCategory={selectedCategory}
                onSelectCategory={handleCategoryChange}
                selectedSort={selectedSort}
                onSelectSort={handleSortChange}
                search={search}
                onSearchChange={handleSearchChange}
                onlyDiscounted={onlyDiscounted}
                onToggleDiscounted={handleDiscountToggle}
                priceRange={priceRange}
                onSelectPriceRange={handlePriceRangeChange}
                onReset={handleResetFilters}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 mt-4 sticky bottom-0 bg-white pb-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20"
              >
                Show {filteredScripts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function ScriptsContentWrapper() {
  const searchParams = useSearchParams();
  return <ScriptsContent key={searchParams.toString()} />;
}

export default function ScriptsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center text-slate-500 font-medium">Loading scripts...</div>}>
      <ScriptsContentWrapper />
    </Suspense>
  );
}
