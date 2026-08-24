'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { SortOption } from '@/lib/types';
import { Search, SlidersHorizontal, RotateCcw, Tag } from 'lucide-react';

interface FilterPanelProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  selectedSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
  search: string;
  onSearchChange: (q: string) => void;
  onlyDiscounted: boolean;
  onToggleDiscounted: (val: boolean) => void;
  priceRange: 'all' | 'under30' | 'under60' | '60plus';
  onSelectPriceRange: (range: 'all' | 'under30' | 'under60' | '60plus') => void;
  onReset: () => void;
}

export function FilterPanel({
  selectedCategory,
  onSelectCategory,
  selectedSort,
  onSelectSort,
  search,
  onSearchChange,
  onlyDiscounted,
  onToggleDiscounted,
  priceRange,
  onSelectPriceRange,
  onReset,
}: FilterPanelProps) {
  const { categories, scripts } = useApp();
  const activeCategories = categories.filter((c) => c.status === 'active');

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSort !== 'latest' ||
    search.trim() !== '' ||
    onlyDiscounted ||
    priceRange !== 'all';

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-5 sm:space-y-6">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-4 bg-blue-600 rounded-full inline-block" />
          <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">Filter Options</h3>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 hover:underline transition-all min-h-[36px] px-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 sm:mb-2">
          Search
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search title, tech, tags..."
            className="w-full pl-9 pr-4 py-2.5 sm:py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium"
          />
        </div>
      </div>

      {/* Sort Selector */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 sm:mb-2">
          Sort By
        </label>
        <select
          value={selectedSort}
          onChange={(e) => onSelectSort(e.target.value as SortOption)}
          className="w-full px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium text-slate-700 cursor-pointer"
        >
          <option value="latest">Latest Released</option>
          <option value="popular">Most Popular</option>
          <option value="discount">Biggest Discount</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Categories Filter */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 sm:mb-2">
          Categories
        </label>
        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all min-h-[40px] ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100'
            }`}
          >
            <span>All Scripts</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                selectedCategory === 'all' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              {scripts.filter((s) => s.status === 'published').length}
            </span>
          </button>

          {activeCategories.map((cat) => {
            const count = scripts.filter(
              (s) => s.categorySlug === cat.slug && s.status === 'published'
            ).length;
            const isSelected = selectedCategory === cat.slug;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.slug)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold transition-all min-h-[40px] ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100'
                }`}
              >
                <span className="truncate mr-2">{cat.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 font-bold ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 sm:mb-2">
          Price Range
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: 'all', label: 'All Prices' },
            { id: 'under30', label: 'Under $30' },
            { id: 'under60', label: '$30 – $60' },
            { id: '60plus', label: '$60+' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectPriceRange(item.id as any)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border min-h-[38px] ${
                priceRange === item.id
                  ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 active:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Special Filter: Discounted Only */}
      <div className="pt-1">
        <label className="flex items-center gap-2.5 p-3 rounded-xl sm:rounded-2xl bg-red-50/60 border border-red-100 cursor-pointer hover:bg-red-50 active:bg-red-100/80 transition-colors min-h-[44px]">
          <input
            type="checkbox"
            checked={onlyDiscounted}
            onChange={(e) => onToggleDiscounted(e.target.checked)}
            className="w-4 h-4 rounded text-red-500 focus:ring-red-400 border-red-300 shrink-0"
          />
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-600">
            <Tag className="w-3.5 h-3.5 shrink-0" />
            <span>Discounted Deals Only</span>
          </div>
        </label>
      </div>
    </div>
  );
}
