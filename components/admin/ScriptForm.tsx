'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Script } from '@/lib/types';
import { calculateDiscountPercentage, generateSlug, isValidUrl } from '@/lib/utils';
import {
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Sparkles,
  Check,
  AlertCircle,
  HelpCircle,
  Eye,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Tag,
  Layers,
  Percent,
} from 'lucide-react';

export interface ScriptFormProps {
  initialData?: Script;
  isEdit?: boolean;
  onSave?: (data: Partial<Script>) => void;
  onCancel?: () => void;
}

const PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556742049-0a67e5572293?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526367790999-0150786686a2?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
];

export function ScriptForm({ initialData, isEdit = false, onSave, onCancel }: ScriptFormProps) {
  const router = useRouter();
  const { categories, addScript, updateScript, settings, showToast } = useApp();

  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription || '');
  const [fullDescription, setFullDescription] = useState(
    initialData?.fullDescription ||
      `### Overview\nDescribe your script here with clear highlights.\n\n### Key Features\n- Feature 1\n- Feature 2\n- Feature 3\n\n### Requirements\n- PHP 8.2+ or Node.js\n- MySQL 8.0+`
  );
  const [activeTabDesc, setActiveTabDesc] = useState<'write' | 'preview'>('write');

  const [categorySlug, setCategorySlug] = useState(
    initialData?.categorySlug || categories[0]?.slug || 'react-nextjs'
  );
  const [status, setStatus] = useState<'published' | 'draft'>(initialData?.status || 'published');
  const [featured, setFeatured] = useState<boolean>(Boolean(initialData?.featured));
  const [version, setVersion] = useState(initialData?.version || 'v1.0.0');
  const [framework, setFramework] = useState(initialData?.framework || 'React / Node / Tailwind');
  const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || 'React, Tailwind, Node.js');

  // Pricing
  const [regularPrice, setRegularPrice] = useState<string>(
    initialData ? String(initialData.regularPrice) : '49'
  );
  const [discountPrice, setDiscountPrice] = useState<string>(
    initialData?.discountPrice ? String(initialData.discountPrice) : '29'
  );

  // External URLs
  const [liveDemoUrl, setLiveDemoUrl] = useState(initialData?.liveDemoUrl || '');
  const [buyUrl, setBuyUrl] = useState(initialData?.buyUrl || '');

  // Digital Delivery & Download Protection Fields
  const [downloadUrl, setDownloadUrl] = useState(initialData?.downloadUrl || '');
  const [downloadPassword, setDownloadPassword] = useState(initialData?.downloadPassword || 'SCRIPT-VAULT-2026');
  const [fileSize, setFileSize] = useState(initialData?.fileSize || '45.0 MB');

  // Main Image
  const [mainImage, setMainImage] = useState(
    initialData?.mainImage ||
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop'
  );

  // 10 Screenshots
  const [screenshots, setScreenshots] = useState<string[]>(() => {
    const list = Array(10).fill('');
    if (initialData?.screenshots) {
      initialData.screenshots.forEach((url, i) => {
        if (i < 10) list[i] = url;
      });
    }
    return list;
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      setSlug(generateSlug(val));
    }
  };

  // Handle file upload -> base64
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('error', 'File Too Large', 'Maximum image size is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onComplete(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleScreenshotChange = (index: number, value: string) => {
    setScreenshots((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const removeScreenshot = (index: number) => {
    setScreenshots((prev) => {
      const next = [...prev];
      next[index] = '';
      return next;
    });
  };

  // Rich text formatting helpers
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('fullDescTextarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = fullDescription.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newText =
      fullDescription.substring(0, start) + replacement + fullDescription.substring(end);
    setFullDescription(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  // Discount calculation
  const regPriceNum = Number(regularPrice) || 0;
  const discPriceNum = discountPrice.trim() !== '' ? Number(discountPrice) : null;
  const discountPercent = calculateDiscountPercentage(regPriceNum, discPriceNum);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!title.trim()) errs.title = 'Title is required';
    if (!shortDescription.trim()) errs.shortDescription = 'Short description is required';
    if (!fullDescription.trim()) errs.fullDescription = 'Full description is required';
    if (regPriceNum <= 0) errs.regularPrice = 'Regular price must be greater than 0';

    if (discPriceNum !== null) {
      if (isNaN(discPriceNum) || discPriceNum < 0) {
        errs.discountPrice = 'Discount price must be a valid number';
      } else if (discPriceNum >= regPriceNum) {
        errs.discountPrice = 'Discount price must be less than regular price';
      }
    }

    if (liveDemoUrl && !isValidUrl(liveDemoUrl)) {
      errs.liveDemoUrl = 'Please enter a valid URL (e.g., https://example.com)';
    }

    if (buyUrl && !isValidUrl(buyUrl)) {
      errs.buyUrl = 'Please enter a valid URL (e.g., https://example.com)';
    }

    if (!mainImage.trim()) {
      errs.mainImage = 'Main image is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('error', 'Validation Error', 'Please check the highlighted fields.');
      return;
    }

    setIsSubmitting(true);

    const validScreenshots = screenshots.filter((s) => Boolean(s && s.trim()));
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      slug: slug.trim() || generateSlug(title),
      shortDescription: shortDescription.trim(),
      fullDescription: fullDescription.trim(),
      categorySlug,
      status,
      featured,
      version: version.trim(),
      framework: framework.trim(),
      tags,
      regularPrice: regPriceNum,
      discountPrice: discPriceNum !== null && discPriceNum < regPriceNum ? discPriceNum : null,
      liveDemoUrl: liveDemoUrl.trim(),
      buyUrl: buyUrl.trim(),
      downloadUrl: downloadUrl.trim(),
      downloadPassword: downloadPassword.trim(),
      fileSize: fileSize.trim(),
      mainImage: mainImage.trim(),
      screenshots: validScreenshots,
    };

    if (onSave) {
      onSave(payload);
    } else if (isEdit && initialData) {
      updateScript(initialData.id, payload);
      router.push('/admin/scripts');
    } else {
      addScript(payload);
      router.push('/admin/scripts');
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl pb-16">
      {/* 1. Basic Information */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Basic Information</h2>
            <p className="text-xs text-slate-500">Core script identity and search taxonomy</p>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Script Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. Gaming Tournament Pro - Esports Management Script"
            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all ${
              errors.title ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 focus:border-blue-500'
            }`}
          />
          {errors.title && <p className="text-xs text-rose-500 mt-1 font-medium">{errors.title}</p>}
        </div>

        {/* SEO Slug */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              SEO URL Slug
            </label>
            <button
              type="button"
              onClick={() => setIsSlugManual(!isSlugManual)}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
            >
              {isSlugManual ? 'Auto-generate from Title' : 'Edit Manually'}
            </button>
          </div>
          <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-2 text-sm text-slate-500 focus-within:bg-white focus-within:border-blue-500 transition-colors">
            <span className="shrink-0 text-slate-400 text-xs sm:text-sm font-mono">/scripts/</span>
            <input
              type="text"
              value={slug}
              disabled={!isSlugManual}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              placeholder="gaming-tournament-pro-script"
              className="w-full bg-transparent px-1 outline-none text-slate-900 font-mono text-xs sm:text-sm disabled:text-slate-500"
            />
          </div>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Short Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="A concise summary of the script for search cards and listings (1-2 sentences)..."
            className={`w-full px-4 py-2.5 bg-slate-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all ${
              errors.shortDescription
                ? 'border-rose-400 bg-rose-50/20'
                : 'border-slate-200 focus:border-blue-500'
            }`}
          />
          {errors.shortDescription && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.shortDescription}</p>
          )}
        </div>

        {/* Category & Status & Featured Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Category
            </label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm font-semibold text-slate-700 transition-colors"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name} {c.status === 'inactive' ? '(Inactive)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Publication Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none text-sm font-semibold text-slate-700 transition-colors"
            >
              <option value="published">Published (Visible to public)</option>
              <option value="draft">Draft (Hidden from public)</option>
            </select>
          </div>

          {/* Featured */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Featured on Homepage
              </div>
            </label>
          </div>
        </div>

        {/* Tech Meta: Version, Framework, Tags */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Version
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="e.g. v2.4.0"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Framework / Stack
            </label>
            <input
              type="text"
              value={framework}
              onChange={(e) => setFramework(e.target.value)}
              placeholder="e.g. Next.js / Tailwind / PHP"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="React, SaaS, Tailwind, Node"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Full Description with Formatting Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Full Description & Details</h2>
            <p className="text-xs text-slate-400">Markdown & formatted documentation support</p>
          </div>

          <div className="flex items-center rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTabDesc('write')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTabDesc === 'write'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTabDesc('preview')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTabDesc === 'preview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" /> Preview
            </button>
          </div>
        </div>

        {activeTabDesc === 'write' ? (
          <div>
            {/* Formatting Action Toolbar */}
            <div className="flex items-center gap-1 p-2 bg-slate-100 rounded-t-2xl border-t border-x border-slate-200 overflow-x-auto">
              <button
                type="button"
                onClick={() => insertFormatting('**', '**')}
                className="p-1.5 rounded-lg hover:bg-white text-slate-700 text-xs font-bold transition-colors"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('*', '*')}
                className="p-1.5 rounded-lg hover:bg-white text-slate-700 text-xs italic transition-colors"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('### ')}
                className="p-1.5 rounded-lg hover:bg-white text-slate-700 text-xs font-bold transition-colors"
                title="Heading 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('#### ')}
                className="p-1.5 rounded-lg hover:bg-white text-slate-700 text-xs font-bold transition-colors"
                title="Heading 3"
              >
                <Heading3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('- ')}
                className="p-1.5 rounded-lg hover:bg-white text-slate-700 text-xs transition-colors"
                title="Bullet list"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('1. ')}
                className="p-1.5 rounded-lg hover:bg-white text-slate-700 text-xs transition-colors"
                title="Numbered list"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('`', '`')}
                className="p-1.5 rounded-lg hover:bg-white text-slate-700 text-xs transition-colors"
                title="Code inline"
              >
                <Code className="w-4 h-4" />
              </button>
            </div>

            <textarea
              id="fullDescTextarea"
              rows={9}
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-b-2xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm font-mono leading-relaxed transition-all"
              placeholder="### Overview&#10;Detailed description with features, requirements, instructions..."
            />
          </div>
        ) : (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 min-h-[220px] prose prose-sm max-w-none text-slate-800">
            {fullDescription ? (
              <div className="whitespace-pre-wrap leading-relaxed">{fullDescription}</div>
            ) : (
              <p className="text-slate-400 italic">No description written yet.</p>
            )}
          </div>
        )}
      </div>

      {/* 3. Pricing & External URLs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Pricing & External Links
            </h2>
            <p className="text-xs text-slate-500">Configure prices, discounts, live demo URL, and purchase link</p>
          </div>
        </div>

        {/* Pricing Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">
          {/* Regular Price */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Regular Price ({settings.currencySymbol}) <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                {settings.currencySymbol}
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={regularPrice}
                onChange={(e) => setRegularPrice(e.target.value)}
                placeholder="50"
                className={`w-full pl-8 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-bold text-slate-900 outline-none transition-all ${
                  errors.regularPrice
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 focus:bg-white focus:border-blue-500'
                }`}
              />
            </div>
            {errors.regularPrice && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.regularPrice}</p>
            )}
          </div>

          {/* Discount Price */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Discount Price ({settings.currencySymbol}) (Optional)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">
                {settings.currencySymbol}
              </span>
              <input
                type="number"
                min="0"
                step="any"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="30"
                className={`w-full pl-8 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm font-bold text-slate-900 outline-none transition-all ${
                  errors.discountPrice
                    ? 'border-rose-400 bg-rose-50/20'
                    : 'border-slate-200 focus:bg-white focus:border-blue-500'
                }`}
              />
            </div>
            {errors.discountPrice && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.discountPrice}</p>
            )}
          </div>

          {/* Automatic Calculation Indicator */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col justify-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Automatic Discount Badge
            </span>
            {discountPercent > 0 ? (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-black text-rose-600">
                  {discountPercent}% OFF
                </span>
                <span className="text-xs text-slate-500">Applied automatically</span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 mt-1">
                No active discount
              </div>
            )}
          </div>
        </div>

        {/* External URLs: Live Demo URL & Buy URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
          {/* Live Demo URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Live Demo URL
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={liveDemoUrl}
                onChange={(e) => setLiveDemoUrl(e.target.value)}
                placeholder="https://demo.yoursite.com"
                className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                  errors.liveDemoUrl ? 'border-rose-400' : 'border-slate-200 focus:bg-white focus:border-blue-500'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              If left empty, the Live Demo button will be automatically hidden.
            </p>
          </div>

          {/* Buy / Get Script URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Buy / Get Script URL
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={buyUrl}
                onChange={(e) => setBuyUrl(e.target.value)}
                placeholder="https://store.yoursite.com/checkout/script-123"
                className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm outline-none transition-all ${
                  errors.buyUrl ? 'border-rose-400' : 'border-slate-200 focus:bg-white focus:border-blue-500'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Direct checkout or external purchase link for customers.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Digital Asset Delivery & Download Security (Gated Files & Passwords) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Digital Asset Delivery & Download Protection</h2>
            <p className="text-xs text-slate-500">
              Configure download file sources, file size, and archive unzip passwords for authenticated buyers
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Download URL */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Direct Package URL / Cloud ZIP Source (Optional)
            </label>
            <input
              type="text"
              value={downloadUrl}
              onChange={(e) => setDownloadUrl(e.target.value)}
              placeholder="e.g. https://storage.yoursite.com/packages/script-v2.zip (Leave empty for dynamic auto-generated package)"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition-all placeholder:font-sans placeholder:text-xs"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              When a user logs in and unlocks the script, clicking &apos;Download&apos; delivers this file directly.
            </p>
          </div>

          {/* File Size */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Package File Size
            </label>
            <input
              type="text"
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
              placeholder="e.g. 45.2 MB"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-blue-500 transition-all"
            />
          </div>

          {/* Archive Unzip Password */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Archive Unzip Password / Digital License Key
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={downloadPassword}
                onChange={(e) => setDownloadPassword(e.target.value)}
                placeholder="e.g. SCRIPT-PRO-2026-KEY"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all"
              />
              <button
                type="button"
                onClick={() =>
                  setDownloadPassword(
                    `PASS-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${new Date().getFullYear()}`
                  )
                }
                className="shrink-0 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Generate Key
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              This password is shown to the user on their Download page and Order receipts after purchasing.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Main Script Image */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ImageIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Main Cover Image</h2>
            <p className="text-xs text-slate-500">Thumbnail shown in catalog cards and hero header</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Upload and input */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Image URL or Upload File <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 mb-2 transition-colors"
              />
            </div>

            {/* File Upload Button */}
            <div>
              <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl bg-slate-50 hover:bg-blue-50/30 cursor-pointer transition-all">
                <Upload className="w-6 h-6 text-slate-400 mb-1" />
                <span className="text-xs font-bold text-slate-700">Upload Image from Device</span>
                <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, WEBP up to 5MB</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, setMainImage)}
                />
              </label>
            </div>

            {/* Preset quick selection */}
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Or choose from curated presets:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {PRESET_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMainImage(img)}
                    className="w-14 h-10 rounded-xl overflow-hidden border border-slate-200 shrink-0 hover:border-blue-500 hover:scale-105 transition-all"
                  >
                    <img src={img} alt="Preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Image Preview */}
          <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Live Preview
            </span>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs flex items-center justify-center">
              {mainImage ? (
                <img src={mainImage} alt="Cover preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-slate-400">No image specified</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Screenshot Gallery (10 Slots) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Screenshot Gallery</h2>
              <p className="text-xs text-slate-500">Up to 10 showcase screenshots with lightbox preview</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
            {screenshots.filter((s) => Boolean(s?.trim())).length} / 10 Added
          </span>
        </div>

        {/* 10 Screenshot items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {screenshots.map((url, idx) => {
            const hasImage = Boolean(url && url.trim());
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-extrabold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span>Screenshot {idx + 1}</span>
                  </span>
                  {hasImage && (
                    <button
                      type="button"
                      onClick={() => removeScreenshot(idx)}
                      className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                {/* Preview & Upload input */}
                <div className="flex items-center gap-3">
                  <div className="w-20 h-14 rounded-xl bg-slate-200 overflow-hidden shrink-0 border border-slate-300 flex items-center justify-center">
                    {hasImage ? (
                      <img src={url} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => handleScreenshotChange(idx, e.target.value)}
                      placeholder="Paste Image URL..."
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-500 font-mono"
                    />

                    <label className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
                      <Upload className="w-3 h-3" /> Upload File
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (dataUrl) => handleScreenshotChange(idx, dataUrl))
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={() => (onCancel ? onCancel() : router.push('/admin/scripts'))}
          className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-semibold text-sm text-slate-700 transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 font-bold text-sm text-white shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{isEdit ? 'Save Changes' : 'Create Script'}</span>
        </button>
      </div>
    </form>
  );
}
