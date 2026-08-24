'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { WebsiteSettings } from '@/lib/types';
import {
  Globe,
  Save,
  RotateCcw,
  Download,
  ShieldAlert,
  Send,
  Image as ImageIcon,
  Search,
  Share2,
  Upload,
  Trash2,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Sliders,
  Bell,
  Eye,
  Layers,
  Code,
  Shield,
  Rocket,
  Terminal,
  Zap,
  DollarSign,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { settings, updateSettings, resetData, scripts, categories, showToast } = useApp();

  const [formData, setFormData] = useState<WebsiteSettings>({
    ...settings,
    metaTitle: settings.metaTitle || `${settings.websiteName} - Premium Ready-Made Scripts & Source Code Marketplace`,
    metaDescription: settings.metaDescription || settings.websiteDescription || '',
    metaKeywords: settings.metaKeywords || 'scripts, source code, web apps, saas boilerplate, react, nextjs, laravel, php, marketplace',
    ogImageUrl: settings.ogImageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    enableSearchIndexing: settings.enableSearchIndexing ?? true,
    headerAnnouncement: settings.headerAnnouncement || '🔥 Special Offer: 50% off on all Next.js fullstack starters this week!',
    headerAnnouncementEnabled: settings.headerAnnouncementEnabled ?? false,
  });

  const [activeTab, setActiveTab] = useState<'branding' | 'seo' | 'support' | 'social' | 'backup'>('branding');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [logoUploadLoading, setLogoUploadLoading] = useState(false);
  const [faviconUploadLoading, setFaviconUploadLoading] = useState(false);
  const [ogUploadLoading, setOgUploadLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    showToast('success', 'Settings Saved', 'All storefront branding, logo, favicon, and SEO configurations updated live.');
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logoUrl' | 'faviconUrl' | 'ogImageUrl',
    setLoading: (val: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast('error', 'File Too Large', 'Please upload an image smaller than 2MB.');
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setFormData((prev) => ({ ...prev, [field]: dataUrl }));
      setLoading(false);
      showToast('success', 'Image Uploaded', 'Preview updated. Click Save Changes to publish.');
    };
    reader.onerror = () => {
      setLoading(false);
      showToast('error', 'Upload Failed', 'Could not process image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleExportBackup = () => {
    const backupData = {
      version: '1.2',
      exportedAt: new Date().toISOString(),
      settings: formData,
      scripts,
      categories,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(formData.websiteName || 'scripthub').toLowerCase()}-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', 'Backup Exported', 'Full store catalog & configuration downloaded as JSON.');
  };

  const presetFavicons = [
    { label: 'Blue Code', url: 'https://api.iconify.design/lucide:code-2.svg?color=%232563eb' },
    { label: 'Emerald Rocket', url: 'https://api.iconify.design/lucide:rocket.svg?color=%2310b981' },
    { label: 'Violet Shield', url: 'https://api.iconify.design/lucide:shield.svg?color=%238b5cf6' },
    { label: 'Amber Bolt', url: 'https://api.iconify.design/lucide:zap.svg?color=%23f59e0b' },
    { label: 'Cyan Terminal', url: 'https://api.iconify.design/lucide:terminal.svg?color=%2306b6d4' },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage frontend branding, header logo, website name, favicon, SEO meta tags, Telegram support, and system backups.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/25 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('branding')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'branding'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Branding & Logo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('seo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'seo'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>SEO & Metadata</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('support')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'support'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Telegram & Support</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'social'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Social Links</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('backup')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'backup'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Backups & Reset</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ================= TAB 1: BRANDING, LOGO & FAVICON ================= */}
        {activeTab === 'branding' && (
          <div className="space-y-8">
            {/* Live Frontend Header Preview Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-6 text-white shadow-lg space-y-4 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-blue-400">
                  <Eye className="w-4 h-4" /> Live Frontend Header Preview
                </span>
                <span>Reflects your live site navigation bar</span>
              </div>

              {formData.headerAnnouncementEnabled && formData.headerAnnouncement && (
                <div className="bg-blue-600 text-white text-[11px] py-1 px-3 rounded-lg text-center font-medium">
                  {formData.headerAnnouncement}
                </div>
              )}

              <div className="bg-white rounded-2xl p-4 flex items-center justify-between text-slate-900 shadow-sm">
                <div className="flex items-center gap-3">
                  {formData.logoUrl ? (
                    <div className="h-8 max-w-[140px] flex items-center">
                      <img
                        src={formData.logoUrl}
                        alt="Logo Preview"
                        className="max-h-8 w-auto object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                      {formData.websiteName ? formData.websiteName.charAt(0) : 'S'}
                    </div>
                  )}
                  <span className="font-extrabold text-base tracking-tight">
                    {formData.websiteName || 'ScriptVault'}
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-600">
                  <span className="text-blue-600 font-bold">Home</span>
                  <span>Scripts</span>
                  <span>About</span>
                  <span>Contact</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
                    Cart (0)
                  </span>
                </div>
              </div>
            </div>

            {/* General Site Identity */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Site Identity & Names</h2>
                  <p className="text-xs text-slate-500">Website title, brand tagline, and currencies</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Website Name <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.websiteName}
                    onChange={(e) => setFormData({ ...formData, websiteName: e.target.value })}
                    placeholder="e.g. ScriptVault"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:bg-white focus:border-blue-500 transition-colors"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Displays on navbar, footer, tab titles, and invoice headers.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Currency Symbol & Code
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      required
                      value={formData.currencySymbol}
                      onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                      placeholder="$"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-center outline-none focus:bg-white focus:border-blue-500"
                    />
                    <input
                      type="text"
                      value={formData.currencyCode || 'USD'}
                      onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value.toUpperCase() })}
                      placeholder="USD"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-center outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Currency symbol ($ / € / ৳ / ₹) and standard 3-letter ISO code.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Website Tagline / Hero Subtitle
                </label>
                <input
                  type="text"
                  value={formData.websiteTagline || ''}
                  onChange={(e) => setFormData({ ...formData, websiteTagline: e.target.value })}
                  placeholder="e.g. Premium Source Code & Ready-Made Scripts Marketplace"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Store Description (Footer & Bio)
                </label>
                <textarea
                  rows={2}
                  value={formData.websiteDescription || ''}
                  onChange={(e) => setFormData({ ...formData, websiteDescription: e.target.value })}
                  placeholder="Brief summary of your marketplace for visitors and footer bio..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Header Logo Controls */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Header Brand Logo</h2>
                  <p className="text-xs text-slate-500">Upload a custom image logo or paste direct image URL</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Logo Image Preview Box */}
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-50 border border-dashed border-slate-300 text-center space-y-3">
                  <div className="h-16 w-32 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 shadow-2xs overflow-hidden">
                    {formData.logoUrl ? (
                      <img
                        src={formData.logoUrl}
                        alt="Brand Logo"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">No Custom Logo</span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">Current Logo Preview</span>

                  {formData.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, logoUrl: '' })}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Logo</span>
                    </button>
                  )}
                </div>

                {/* Logo Input & Upload Actions */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Logo Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.logoUrl}
                      onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                      placeholder="https://example.com/images/logo.png"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono outline-none focus:bg-white focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-all shadow-xs">
                      <Upload className="w-4 h-4" />
                      <span>{logoUploadLoading ? 'Processing...' : 'Upload Logo File (.png, .svg, .webp)'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={logoUploadLoading}
                        onChange={(e) => handleFileUpload(e, 'logoUrl', setLogoUploadLoading)}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-slate-400">Max size 2MB, transparent PNG/SVG recommended.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Favicon Controls */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Browser Favicon & Tab Icon</h2>
                  <p className="text-xs text-slate-500">Customize the browser tab icon appearing in visitor windows</p>
                </div>
              </div>

              {/* Browser Tab Simulation */}
              <div className="bg-slate-200 rounded-2xl p-3 max-w-md shadow-inner">
                <div className="bg-white rounded-xl px-3 py-2 flex items-center gap-2.5 shadow-xs border border-slate-300/60 max-w-[280px]">
                  {formData.faviconUrl ? (
                    <img src={formData.faviconUrl} alt="Favicon" className="w-4 h-4 object-contain shrink-0" />
                  ) : (
                    <Code className="w-4 h-4 text-blue-600 shrink-0" />
                  )}
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {formData.websiteName || 'ScriptVault'} - {formData.websiteTagline || 'Scripts'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Favicon URL
                  </label>
                  <input
                    type="url"
                    value={formData.faviconUrl}
                    onChange={(e) => setFormData({ ...formData, faviconUrl: e.target.value })}
                    placeholder="https://example.com/favicon.ico"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold cursor-pointer transition-all shadow-xs">
                    <Upload className="w-4 h-4 text-blue-600" />
                    <span>{faviconUploadLoading ? 'Uploading...' : 'Upload Favicon File (.ico, .png, .svg)'}</span>
                    <input
                      type="file"
                      accept="image/*,.ico"
                      disabled={faviconUploadLoading}
                      onChange={(e) => handleFileUpload(e, 'faviconUrl', setFaviconUploadLoading)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Preset Icon Pickers */}
              <div>
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Or Choose From Ready-Made SVG Preset Icons:
                </span>
                <div className="flex flex-wrap gap-2">
                  {presetFavicons.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, faviconUrl: preset.url })}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        formData.faviconUrl === preset.url
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-3.5 h-3.5" />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Header Announcement Bar */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Header Top Announcement Banner</h2>
                    <p className="text-xs text-slate-500">Highlight sales, promotions, or store notices</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.headerAnnouncementEnabled || false}
                    onChange={(e) =>
                      setFormData({ ...formData, headerAnnouncementEnabled: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {formData.headerAnnouncementEnabled && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Banner Announcement Text
                  </label>
                  <input
                    type="text"
                    value={formData.headerAnnouncement || ''}
                    onChange={(e) => setFormData({ ...formData, headerAnnouncement: e.target.value })}
                    placeholder="e.g. 🔥 Flash Sale: Use code TELEGRAM50 for 50% discount this week!"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: SEO & METADATA ================= */}
        {activeTab === 'seo' && (
          <div className="space-y-8">
            {/* Google Search Snippet Live Preview */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Search className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Live Google Search Result Preview
                </h3>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 max-w-2xl font-sans space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">
                    {formData.faviconUrl ? (
                      <img src={formData.faviconUrl} alt="Favicon" className="w-3.5 h-3.5 object-contain" />
                    ) : (
                      '🌐'
                    )}
                  </div>
                  <span className="truncate">https://{(formData.websiteName || 'scripthub').toLowerCase().replace(/\s+/g, '')}.dev</span>
                </div>
                <h4 className="text-base sm:text-lg font-medium text-blue-700 hover:underline cursor-pointer truncate">
                  {formData.metaTitle || `${formData.websiteName} - ${formData.websiteTagline}`}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                  {formData.metaDescription || formData.websiteDescription || 'Browse and acquire high-performance verified source code and ready-made applications.'}
                </p>
              </div>
            </div>

            {/* Social Share / OpenGraph Live Preview */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Share2 className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Live Social Media Share Card Preview (Twitter / Facebook / Telegram)
                </h3>
              </div>

              <div className="max-w-md rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm space-y-0">
                <div className="h-44 bg-slate-100 relative overflow-hidden">
                  {formData.ogImageUrl ? (
                    <img
                      src={formData.ogImageUrl}
                      alt="Social Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No Social Image Set
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-1 bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {(formData.websiteName || 'scripthub').toLowerCase().replace(/\s+/g, '')}.dev
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                    {formData.metaTitle || formData.websiteName}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {formData.metaDescription || formData.websiteDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* SEO Form Inputs */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Search Engine Meta Tags</h2>
                  <p className="text-xs text-slate-500">Controls how Google, Bing, and social bots index your marketplace</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Search Indexing:</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.enableSearchIndexing ?? true}
                      onChange={(e) => setFormData({ ...formData, enableSearchIndexing: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                  <span className="text-[11px] font-bold text-slate-500">
                    {formData.enableSearchIndexing ? 'Index & Follow' : 'No-Index'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  SEO Meta Title Tag <span className="text-blue-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.metaTitle || ''}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  placeholder="e.g. ScriptVault - Buy Ready-Made Web Apps & Source Code"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:bg-white focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Recommended length: 50-60 characters (Current: {formData.metaTitle?.length || 0})
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  SEO Meta Description
                </label>
                <textarea
                  rows={3}
                  value={formData.metaDescription || ''}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  placeholder="Accurate description of your digital products and marketplace..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Recommended length: 150-160 characters (Current: {formData.metaDescription?.length || 0})
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  SEO Keywords (Comma Separated)
                </label>
                <input
                  type="text"
                  value={formData.metaKeywords || ''}
                  onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                  placeholder="scripts, buy source code, nextjs boilerplate, php script, digital store"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    OpenGraph / Social Card Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.ogImageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, ogImageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono outline-none focus:bg-white focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer transition-all shadow-xs">
                    <Upload className="w-4 h-4" />
                    <span>{ogUploadLoading ? 'Uploading...' : 'Upload Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={ogUploadLoading}
                      onChange={(e) => handleFileUpload(e, 'ogImageUrl', setOgUploadLoading)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: TELEGRAM & SUPPORT ================= */}
        {activeTab === 'support' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-blue-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Telegram Direct Support Link</h2>
                  <p className="text-xs text-slate-500">
                    All Telegram buttons across scripts, cart drawers, floating widgets, and footer route here.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Telegram Support URL <span className="text-blue-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.telegramSupportUrl}
                    onChange={(e) => setFormData({ ...formData, telegramSupportUrl: e.target.value })}
                    placeholder="https://t.me/YourSupportUsername"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono outline-none focus:bg-white focus:border-blue-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Accepts `https://t.me/username` or `@username`.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Telegram Display Handle
                  </label>
                  <input
                    type="text"
                    value={formData.telegramUsername}
                    onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                    placeholder="@YourSupportUsername"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono outline-none focus:bg-white focus:border-blue-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Rendered visually on support badges and floating button.
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Public Contact / Support Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="support@scriptvault.dev"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: SOCIAL LINKS ================= */}
        {activeTab === 'social' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                <Share2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Social Media Channels (Footer)</h2>
                <p className="text-xs text-slate-500">Provide official channel links to display in the website footer</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Twitter / X URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks?.twitter || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                    })
                  }
                  placeholder="https://x.com/yourhandle"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks?.github || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, github: e.target.value },
                    })
                  }
                  placeholder="https://github.com/yourorganization"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Discord Server Invite
                </label>
                <input
                  type="url"
                  value={formData.socialLinks?.discord || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, discord: e.target.value },
                    })
                  }
                  placeholder="https://discord.gg/yourserver"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  YouTube Channel URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks?.youtube || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, youtube: e.target.value },
                    })
                  }
                  placeholder="https://youtube.com/@yourchannel"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Facebook Page URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks?.facebook || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, facebook: e.target.value },
                    })
                  }
                  placeholder="https://facebook.com/yourpage"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={formData.socialLinks?.instagram || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/yourhandle"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:bg-white focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 5: BACKUPS & RESET ================= */}
        {activeTab === 'backup' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Data Management & Disaster Recovery</h2>
                <p className="text-xs text-slate-500">Export store state or reset catalog to original demo seeds</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Export Complete Catalog JSON</h4>
                <p className="text-xs text-slate-500">
                  Download all scripts ({scripts.length}), categories ({categories.length}), and settings.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportBackup}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 text-slate-800 hover:text-blue-600 text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Download Backup</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-rose-50 border border-rose-200">
              <div>
                <h4 className="text-sm font-bold text-rose-900">Reset to Default Demo Catalog</h4>
                <p className="text-xs text-rose-700">
                  Restores initial scripts, categories, and default configurations.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowResetConfirm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </div>
        )}

        {/* Global Save Button at bottom of form */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <span className="text-xs text-slate-500">
            Changes take effect immediately across public storefront, navigation, and SEO tags.
          </span>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>

      {/* Confirm Reset Modal */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        title="Reset Store Catalog?"
        message="This will reset all scripts, categories, and settings back to their default demo seed states. Any custom scripts added will be replaced."
        confirmLabel="Reset All Data"
        isDestructive={true}
        onConfirm={() => {
          resetData();
          setShowResetConfirm(false);
          setFormData({ ...settings });
        }}
        onCancel={() => setShowResetConfirm(false)}
      />
    </div>
  );
}
