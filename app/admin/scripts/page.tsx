'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { PriceDisplay } from '@/components/scripts/PriceDisplay';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import {
  PlusCircle,
  Search,
  SlidersHorizontal,
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';

export default function AdminScriptsPage() {
  const { scripts, categories, settings, deleteScript, togglePublishStatus } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredScripts = useMemo(() => {
    return scripts.filter((s) => {
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (selectedCategory !== 'all' && s.categorySlug !== selectedCategory) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchDesc = s.shortDescription.toLowerCase().includes(q);
        const matchTags = s.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTags) return false;
      }
      return true;
    });
  }, [scripts, search, selectedCategory, statusFilter]);

  const targetScriptToDelete = scripts.find((s) => s.id === deleteTargetId);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Script Catalog Management</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Add, update, publish, or configure source code products ({scripts.length} Total Scripts)
          </p>
        </div>

        <Link
          href="/admin/scripts/create"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Script</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({scripts.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('published')}
            className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'published'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Published ({scripts.filter((s) => s.status === 'published').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('draft')}
            className={`flex-1 md:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'draft'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Drafts ({scripts.filter((s) => s.status === 'draft').length})
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scripts..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium outline-none focus:bg-white focus:border-blue-500 text-slate-700"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Scripts Table / Mobile Cards */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredScripts.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No Scripts Found"
              description="No scripts match your search or filter settings. Click below to add your first script."
              actionText="Add New Script"
              actionHref="/admin/scripts/create"
              icon="folder"
            />
          </div>
        ) : (
          <>
            {/* Mobile Card-Based View (visible below md breakpoint) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredScripts.map((script) => {
                const category = categories.find((c) => c.slug === script.categorySlug);
                const validScreenshotsCount =
                  script.screenshots?.filter((s) => Boolean(s?.trim())).length || 0;

                return (
                  <div key={script.id} className="p-4 space-y-3 bg-white hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-start gap-3">
                      <img
                        src={script.mainImage}
                        alt=""
                        className="w-16 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Link
                            href={`/scripts/${script.slug}`}
                            target="_blank"
                            className="font-bold text-slate-900 hover:text-blue-600 text-sm line-clamp-1"
                          >
                            {script.title}
                          </Link>
                          {script.featured && (
                            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded shrink-0">
                              ★ Featured
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {script.shortDescription}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                          {category ? category.name : script.categorySlug}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {validScreenshotsCount} images
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => togglePublishStatus(script.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          script.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {script.status === 'published' ? '● Published' : '○ Draft'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <PriceDisplay
                        regularPrice={script.regularPrice}
                        discountPrice={script.discountPrice}
                        currencySymbol={settings.currencySymbol}
                        size="sm"
                      />

                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/scripts/${script.id}/edit`}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold transition-colors"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/scripts/${script.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
                          title="View public page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTargetId(script.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete script"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Full Table View (with horizontal scroll support) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3.5 px-5">Script Details</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Screenshots</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredScripts.map((script) => {
                    const category = categories.find((c) => c.slug === script.categorySlug);
                    const validScreenshotsCount =
                      script.screenshots?.filter((s) => Boolean(s?.trim())).length || 0;

                    return (
                      <tr key={script.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Title, Thumbnail, Featured */}
                        <td className="py-4 px-5">
                          <div className="flex items-start gap-3.5 min-w-[240px]">
                            <img
                              src={script.mainImage}
                              alt=""
                              className="w-14 h-10 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <Link
                                  href={`/scripts/${script.slug}`}
                                  target="_blank"
                                  className="font-bold text-slate-900 hover:text-blue-600 truncate block text-sm"
                                >
                                  {script.title}
                                </Link>
                                {script.featured && (
                                  <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded shrink-0">
                                    ★ Featured
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                {script.shortDescription}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                            {category ? category.name : script.categorySlug}
                          </span>
                        </td>

                        {/* Pricing */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <PriceDisplay
                            regularPrice={script.regularPrice}
                            discountPrice={script.discountPrice}
                            currencySymbol={settings.currencySymbol}
                            size="sm"
                          />
                        </td>

                        {/* Screenshots counter */}
                        <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600 font-medium">
                          {validScreenshotsCount} / 10 images
                        </td>

                        {/* Status Toggle */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => togglePublishStatus(script.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              script.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            }`}
                            title="Click to switch status"
                          >
                            {script.status === 'published' ? '● Published' : '○ Draft'}
                          </button>
                        </td>

                        {/* Action buttons */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/admin/scripts/${script.id}/edit`}
                              className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Edit Script"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/scripts/${script.slug}`}
                              target="_blank"
                              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="View Public Page"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => setDeleteTargetId(script.id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Script"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        title="Delete Script?"
        message={`Are you sure you want to delete "${targetScriptToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Script"
        isDestructive={true}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteScript(deleteTargetId);
            setDeleteTargetId(null);
          }
        }}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
