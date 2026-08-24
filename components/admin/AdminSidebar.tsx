'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  Code2,
  FolderTree,
  Settings,
  ExternalLink,
  LogOut,
  X,
  PlusCircle,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout, settings, scripts, categories } = useApp();

  const links = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'All Scripts',
      href: '/admin/scripts',
      icon: Code2,
      badge: scripts.length,
    },
    {
      label: 'Categories',
      href: '/admin/categories',
      icon: FolderTree,
      badge: categories.length,
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      badge: null,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/admin' && pathname === '/admin') return true;
    if (path !== '/admin' && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-200/90 text-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 shadow-xs ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Top Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 shrink-0 bg-white">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              {settings.logoUrl ? (
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-1 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                  <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/25 group-hover:scale-105 transition-transform font-bold text-xs">
                  <Shield className="w-4 h-4" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-black text-sm tracking-tight text-slate-900 leading-tight truncate max-w-[130px]">
                  {settings.websiteName || 'ScriptVault'}
                </span>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                  Admin Portal
                </span>
              </div>
            </Link>

            <button
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Create CTA */}
          <div className="p-4 shrink-0 bg-white">
            <Link
              href="/admin/scripts/create"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Script</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-1 flex-1 bg-white">
            <span className="block px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Management
            </span>
            <nav className="space-y-1">
              {links.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      active
                        ? 'bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                      <span>{link.label}</span>
                    </div>
                    {link.badge !== null && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          active
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions & User Profile */}
          <div className="p-3 border-t border-slate-100 space-y-1.5 shrink-0 bg-white">
            <Link
              href="/"
              target="_blank"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all"
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span>View Public Store</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                LIVE
              </span>
            </Link>

            <button
              type="button"
              onClick={() => {
                logout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
