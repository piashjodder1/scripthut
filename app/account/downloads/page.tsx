'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Download,
  Lock,
  Copy,
  Check,
  CheckCircle2,
  Package,
  ExternalLink,
  ShieldCheck,
  FileCode,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function MyDownloadsPage() {
  const { currentUser, userOrders, downloadScriptPackage, scripts, isMounted, settings } = useApp();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedGuideItem, setSelectedGuideItem] = useState<{ title: string; password?: string; version?: string } | null>(null);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isMounted) {
    return <div className="py-20 text-center text-slate-500 text-sm">Loading downloads...</div>;
  }

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Login Required</h2>
          <p className="text-sm text-slate-500 mt-1">
            Please log in or register with your account to access your purchased scripts and digital downloads.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/login?redirect=/account/downloads"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all text-center"
          >
            Log In to Access Downloads
          </Link>
          <Link
            href="/register?redirect=/account/downloads"
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all text-center"
          >
            Create New Account
          </Link>
        </div>
      </div>
    );
  }

  // Extract all purchased items across completed user orders
  const completedOrders = userOrders.filter((o) => o.status === 'completed');
  const allPurchasedItems = completedOrders.flatMap((o) =>
    o.items.map((item) => ({
      ...item,
      orderNumber: o.orderNumber,
      orderDate: o.createdAt,
    }))
  );

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Assets Library</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Downloads & Source Code
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Logged in as <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.email})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/account"
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs border border-slate-200 shadow-2xs transition-all"
          >
            View Order History
          </Link>
          <Link
            href="/scripts"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>Browse More Scripts</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* If No Purchased Scripts */}
      {allPurchasedItems.length === 0 ? (
        <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-md text-center space-y-5">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">No Downloads Available Yet</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              You haven&apos;t purchased any scripts yet. Explore our catalog of ready-made apps and SaaS starters.
            </p>
          </div>
          <Link
            href="/scripts"
            className="inline-flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
          >
            Explore Ready-Made Scripts
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {allPurchasedItems.map((item, idx) => {
            const matchedScript = scripts.find((s) => s.id === item.scriptId || s.slug === item.slug);
            const downloadPassword = item.downloadPassword || matchedScript?.downloadPassword || 'LICENSE-ACTIVE-2026';
            const version = item.version || matchedScript?.version || 'v2.0.0';
            const fileSize = item.fileSize || matchedScript?.fileSize || '45.0 MB';
            const framework = item.framework || matchedScript?.framework || 'Full Stack';

            return (
              <div
                key={`${item.scriptId}-${idx}`}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all p-6 space-y-5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Active License</span>
                      </span>
                      <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                        {version}
                      </span>
                    </div>

                    <span className="text-[11px] font-medium text-slate-400">
                      {fileSize}
                    </span>
                  </div>

                  {/* Script Title & Framework */}
                  <div className="flex gap-4 items-start">
                    {item.mainImage && (
                      <img
                        src={item.mainImage}
                        alt={item.title}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-100 shrink-0 shadow-2xs"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-slate-400" />
                        <span>{framework}</span>
                      </p>
                    </div>
                  </div>

                  {/* Password & License Box */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Archive Password / License Key:</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(downloadPassword)}
                        className="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === downloadPassword ? (
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

                    <div className="bg-white px-3 py-2 rounded-xl border border-slate-200 flex items-center justify-between">
                      <code className="text-xs font-mono font-bold text-slate-800 tracking-wide">
                        {downloadPassword}
                      </code>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Order: #{item.orderNumber}</span>
                    <span>Unlimited Lifetime Downloads</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        downloadScriptPackage({
                          id: item.scriptId,
                          title: item.title,
                          slug: item.slug,
                          downloadUrl: item.downloadUrl,
                          downloadPassword: downloadPassword,
                          version: version,
                          framework: framework,
                        })
                      }
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download .ZIP</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedGuideItem({
                          title: item.title,
                          password: downloadPassword,
                          version: version,
                        })
                      }
                      className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 text-slate-500" />
                      <span>Setup Guide</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Setup Guide Modal */}
      {selectedGuideItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Installation Guide
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {selectedGuideItem.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedGuideItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <p className="font-bold text-slate-800">Quick Start Steps:</p>
              <ol className="list-decimal list-inside space-y-2 leading-relaxed">
                <li>Download the ZIP archive and extract it on your server or local machine.</li>
                <li>
                  If prompted for password, enter:{' '}
                  <code className="font-mono bg-white px-1.5 py-0.5 rounded border font-bold text-amber-900">
                    {selectedGuideItem.password}
                  </code>
                </li>
                <li>Open project in VS Code or your IDE and install dependencies (<code className="font-mono text-blue-700">npm install</code> or <code className="font-mono text-blue-700">composer install</code>).</li>
                <li>Configure your environment variables in <code className="font-mono text-blue-700">.env</code>.</li>
                <li>Run <code className="font-mono text-blue-700">npm run dev</code> to preview!</li>
              </ol>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={settings.telegramSupportUrl || 'https://t.me/ScriptVaultSupport'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
              >
                Need help? Contact Telegram Support
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={() => setSelectedGuideItem(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
