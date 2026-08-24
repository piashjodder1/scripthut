'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Menu, ExternalLink, ShieldCheck, User } from 'lucide-react';

interface AdminNavbarProps {
  onToggleSidebar: () => void;
  title?: string;
}

export function AdminNavbar({ onToggleSidebar, title }: AdminNavbarProps) {
  const pathname = usePathname();
  const { settings, logout } = useApp();

  const getPageTitle = () => {
    if (title) return title;
    if (pathname === '/admin') return 'Dashboard Overview';
    if (pathname === '/admin/scripts') return 'Scripts & Templates';
    if (pathname === '/admin/scripts/create') return 'Create New Script';
    if (pathname?.includes('/admin/scripts/') && pathname?.includes('/edit')) return 'Edit Script';
    if (pathname === '/admin/categories') return 'Category Management';
    if (pathname === '/admin/settings') return 'Settings';
    return 'Admin Portal';
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-tight">
            {getPageTitle()}
          </h1>
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            {settings.websiteName || 'ScriptVault'} Central Management
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-300 bg-white hover:bg-blue-50 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-all shadow-xs"
        >
          <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
          <span>Live Storefront</span>
        </Link>

        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            AD
          </div>
          <div className="hidden md:block text-left">
            <span className="block text-xs font-bold text-slate-900 leading-tight">
              Administrator
            </span>
            <span className="block text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Authorized
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
