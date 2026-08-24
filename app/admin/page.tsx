'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { StatCard } from '@/components/admin/StatCard';
import { PriceDisplay } from '@/components/scripts/PriceDisplay';
import {
  Code2,
  CheckCircle2,
  FileEdit,
  Tag,
  FolderTree,
  Eye,
  PlusCircle,
  Settings,
  ExternalLink,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { scripts, categories, settings, togglePublishStatus } = useApp();

  const totalScripts = scripts.length;
  const publishedScripts = scripts.filter((s) => s.status === 'published').length;
  const draftScripts = scripts.filter((s) => s.status === 'draft').length;
  const discountedScripts = scripts.filter(
    (s) => s.discountPrice && s.discountPrice < s.regularPrice
  ).length;
  const totalCategories = categories.length;
  const totalViews = scripts.reduce((sum, s) => sum + (s.views || 0), 0);

  const recentScripts = [...scripts]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Store Performance Overview</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to {settings.websiteName || 'ScriptVault'} Admin
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Manage your source code catalog, publish new scripts with live demos, configure Telegram support, and track stats.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/admin/scripts/create"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Script</span>
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Modern Statistics Cards Grid with subtle staggered entrance animations */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3.5 sm:gap-4">
        <StatCard
          index={0}
          label="Total Scripts"
          value={totalScripts}
          icon={Code2}
          color="blue"
          subtext="In catalog"
        />
        <StatCard
          index={1}
          label="Published"
          value={publishedScripts}
          icon={CheckCircle2}
          color="emerald"
          subtext="Live on store"
        />
        <StatCard
          index={2}
          label="Drafts"
          value={draftScripts}
          icon={FileEdit}
          color="amber"
          subtext="Hidden"
        />
        <StatCard
          index={3}
          label="Discounted"
          value={discountedScripts}
          icon={Tag}
          color="rose"
          subtext="Special deals"
        />
        <StatCard
          index={4}
          label="Categories"
          value={totalCategories}
          icon={FolderTree}
          color="purple"
          subtext="Active groups"
        />
        <StatCard
          index={5}
          label="Total Views"
          value={totalViews.toLocaleString()}
          icon={Eye}
          color="blue"
          subtext="Impressions"
        />
      </div>

      {/* Recent Scripts Table / Mobile Cards */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-6 pb-4 flex items-center justify-between border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Recently Updated Scripts</h2>
            <p className="text-xs text-slate-500">Quick management & status toggle</p>
          </div>
          <Link
            href="/admin/scripts"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All ({scripts.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentScripts.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No scripts in catalog yet.
          </div>
        ) : (
          <>
            {/* Mobile Card-Based List View (visible below md breakpoint) */}
            <div className="md:hidden divide-y divide-slate-100">
              {recentScripts.map((script) => {
                const category = categories.find((c) => c.slug === script.categorySlug);
                return (
                  <div key={script.id} className="p-4 space-y-3 bg-white hover:bg-slate-50/60 transition-colors">
                    <div className="flex items-start gap-3">
                      <img
                        src={script.mainImage}
                        alt=""
                        className="w-16 h-12 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/scripts/${script.slug}`}
                          target="_blank"
                          className="font-bold text-slate-900 hover:text-blue-600 line-clamp-1 text-sm"
                        >
                          {script.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {category ? category.name : script.categorySlug}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {script.version || 'v1.0'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <PriceDisplay
                        regularPrice={script.regularPrice}
                        discountPrice={script.discountPrice}
                        currencySymbol={settings.currencySymbol}
                        size="sm"
                      />

                      <button
                        type="button"
                        onClick={() => togglePublishStatus(script.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          script.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {script.status === 'published' ? '● Published' : '○ Draft'}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                      <Link
                        href={`/admin/scripts/${script.id}/edit`}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold text-center transition-colors"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/scripts/${script.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        title="View public page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Full Table View (with horizontal scroll support) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm min-w-[650px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-6">Script</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentScripts.map((script) => {
                    const category = categories.find((c) => c.slug === script.categorySlug);
                    return (
                      <tr key={script.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Script info */}
                        <td className="py-3.5 px-6">
                          <div className="flex items-center gap-3.5 min-w-[220px]">
                            <img
                              src={script.mainImage}
                              alt=""
                              className="w-12 h-9 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                            />
                            <div className="min-w-0">
                              <Link
                                href={`/scripts/${script.slug}`}
                                target="_blank"
                                className="font-bold text-slate-900 hover:text-blue-600 truncate block text-xs sm:text-sm"
                              >
                                {script.title}
                              </Link>
                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                {script.screenshots?.filter((s) => Boolean(s?.trim())).length || 0} screenshots • {script.version || 'v1.0'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                            {category ? category.name : script.categorySlug}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <PriceDisplay
                            regularPrice={script.regularPrice}
                            discountPrice={script.discountPrice}
                            currencySymbol={settings.currencySymbol}
                            size="sm"
                          />
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => togglePublishStatus(script.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              script.status === 'published'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            }`}
                            title="Click to toggle status"
                          >
                            {script.status === 'published' ? '● Published' : '○ Draft'}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/scripts/${script.id}/edit`}
                              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-semibold transition-colors"
                            >
                              Edit
                            </Link>
                            <Link
                              href={`/scripts/${script.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="View on site"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
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
    </div>
  );
}
