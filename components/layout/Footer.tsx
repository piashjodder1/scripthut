'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { formatTelegramUrl, formatTelegramUsername } from '@/lib/utils';
import {
  Send,
  Shield,
  Twitter,
  Youtube,
  Facebook,
  Instagram,
  Github,
} from 'lucide-react';

export function Footer() {
  const { settings, categories } = useApp();
  const currentYear = new Date().getFullYear();

  const telegramUrl = formatTelegramUrl(settings.telegramSupportUrl);
  const telegramHandle = formatTelegramUsername(settings.telegramUsername || settings.telegramSupportUrl);

  const social = settings.socialLinks || {};

  const brandName = settings.websiteName || 'ScriptVault';
  const nameFirstHalf = brandName.length > 6 ? brandName.slice(0, 6) : brandName;
  const nameSecondHalf = brandName.length > 6 ? brandName.slice(6) : '';

  return (
    <footer className="bg-white border-t border-slate-100 pt-12 pb-8 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-100">
          {/* Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group inline-flex">
              {settings.logoUrl ? (
                <div className="h-8 max-w-[140px] flex items-center">
                  <img
                    src={settings.logoUrl}
                    alt={settings.websiteName || 'Logo'}
                    className="max-h-8 w-auto object-contain transition-transform group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-base shadow-xs group-hover:bg-blue-700 transition-colors">
                  <span>{brandName.charAt(0) || 'S'}</span>
                </div>
              )}
              <span className="text-xl font-bold tracking-tight text-slate-900">
                {nameSecondHalf ? (
                  <>
                    {nameFirstHalf}
                    <span className="text-blue-600">{nameSecondHalf}</span>
                  </>
                ) : (
                  <>
                    {brandName.length > 3 ? (
                      <>
                        {brandName.slice(0, -3)}
                        <span className="text-blue-600">{brandName.slice(-3)}</span>
                      </>
                    ) : (
                      <span className="text-blue-600">{brandName}</span>
                    )}
                  </>
                )}
              </span>
            </Link>

            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              {settings.websiteDescription ||
                'The premier source code marketplace for developers, founders, and creators. Discover verified scripts with interactive live demos and direct Telegram support.'}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2 pt-1">
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {social.telegram && (
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Telegram"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
              {social.github && (
                <a
                  href={social.github}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-900 text-slate-600 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {social.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-blue-700 text-slate-600 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-pink-600 text-slate-600 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/scripts" className="hover:text-blue-600 transition-colors">
                  All Scripts
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-600 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/scripts?category=${cat.slug}`}
                    className="hover:text-blue-600 transition-colors truncate block"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
              Direct Support
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Have questions or need custom modifications? Chat with us instantly on Telegram.
            </p>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all w-full"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{telegramHandle}</span>
            </a>

            <div className="flex items-center gap-2 text-[11px] text-slate-600 font-medium pt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Telegram Support Online</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} {settings.websiteName || 'ScriptVault'}. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-slate-600 transition-colors flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
            <span>•</span>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Telegram Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
