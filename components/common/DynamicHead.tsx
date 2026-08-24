'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export function DynamicHead() {
  const { settings, isMounted } = useApp();
  const pathname = usePathname();

  useEffect(() => {
    if (!isMounted || typeof document === 'undefined') return;

    // 1. Dynamic Favicon Injection
    if (settings.faviconUrl) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = settings.faviconUrl;
    }

    // 2. Dynamic Title for standard routes (if not overridden by individual script pages)
    if (pathname === '/') {
      document.title = settings.metaTitle || `${settings.websiteName || 'ScriptVault'} - ${settings.websiteTagline || 'Scripts Marketplace'}`;
    } else if (pathname === '/scripts') {
      document.title = `Browse All Scripts & Templates | ${settings.websiteName || 'ScriptVault'}`;
    } else if (pathname === '/about') {
      document.title = `About Us | ${settings.websiteName || 'ScriptVault'}`;
    } else if (pathname === '/contact') {
      document.title = `Contact & Telegram Support | ${settings.websiteName || 'ScriptVault'}`;
    } else if (pathname === '/admin/settings') {
      document.title = `Store Settings | ${settings.websiteName || 'ScriptVault'} Admin`;
    }

    // 3. Helper to update/create meta tag
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      if (!content) return;
      const selector = isProperty ? `meta[property='${name}']` : `meta[name='${name}']`;
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.getElementsByTagName('head')[0].appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 4. Update Meta Tags
    if (settings.metaDescription || settings.websiteDescription) {
      setMetaTag('description', settings.metaDescription || settings.websiteDescription);
      setMetaTag('og:description', settings.metaDescription || settings.websiteDescription, true);
      setMetaTag('twitter:description', settings.metaDescription || settings.websiteDescription);
    }

    if (settings.metaKeywords) {
      setMetaTag('keywords', settings.metaKeywords);
    }

    if (settings.ogImageUrl) {
      setMetaTag('og:image', settings.ogImageUrl, true);
      setMetaTag('twitter:image', settings.ogImageUrl);
    }

    if (settings.enableSearchIndexing !== undefined) {
      setMetaTag('robots', settings.enableSearchIndexing ? 'index, follow' : 'noindex, nofollow');
    }
  }, [settings, pathname, isMounted]);

  return null;
}
