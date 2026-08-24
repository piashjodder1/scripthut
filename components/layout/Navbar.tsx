'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { CartDrawer } from '@/components/cart/CartDrawer';
import {
  Menu,
  X,
  ShoppingCart,
  Download,
  Package,
  LogOut,
  ChevronDown,
  LogIn,
} from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { settings, isMounted, cart, toggleCart, currentUser, logoutUser, userPurchasedScriptIds } = useApp();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Scripts', href: '/scripts' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname?.startsWith(path)) return true;
    return false;
  };

  const brandName = settings.websiteName || 'ScriptVault';
  const nameFirstHalf = brandName.length > 6 ? brandName.slice(0, 6) : brandName;
  const nameSecondHalf = brandName.length > 6 ? brandName.slice(6) : '';

  const cartItemCount = isMounted ? cart.length : 0;
  const downloadsCount = isMounted ? userPurchasedScriptIds.length : 0;

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-100 shrink-0 transition-all">
      {/* Optional Top Announcement Bar */}
      {settings.headerAnnouncementEnabled && settings.headerAnnouncement && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
          <span>{settings.headerAnnouncement}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          {settings.logoUrl ? (
            <div className="h-9 max-w-[160px] flex items-center">
              <img
                src={settings.logoUrl}
                alt={settings.websiteName || 'Logo'}
                className="max-h-9 w-auto object-contain transition-transform group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          ) : (
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-600/20 group-hover:bg-blue-700 transition-all group-hover:scale-105">
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

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 h-16">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors h-full flex items-center ${
                  active
                    ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                    : 'hover:text-blue-600 text-slate-600'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Cart Icon Button */}
          <button
            type="button"
            onClick={toggleCart}
            className="relative p-2.5 rounded-full text-slate-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all border border-slate-200/80 shadow-2xs"
            title="View Cart"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* User Auth Section */}
          {isMounted && currentUser ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-100/80 transition-all text-xs font-semibold text-slate-800"
              >
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">
                  {currentUser.name.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="max-w-[100px] truncate">{currentUser.name}</span>
                {downloadsCount > 0 && (
                  <span className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                    {downloadsCount}
                  </span>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  </div>

                  <Link
                    href="/account/downloads"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4 text-emerald-600" />
                      <span>My Downloads</span>
                    </div>
                    {downloadsCount > 0 && (
                      <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                        {downloadsCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    href="/account"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Package className="w-4 h-4 text-slate-500" />
                    <span>My Orders</span>
                  </Link>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logoutUser();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition-all"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </Link>
          )}
        </div>

        {/* Mobile Header Actions */}
        <div className="flex sm:hidden items-center gap-2">
          {/* Mobile Cart Button */}
          <button
            type="button"
            onClick={toggleCart}
            className="relative p-2 rounded-full text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors border border-slate-200"
            aria-label="View Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white">
                {cartItemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-4 shadow-xl">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* User Account / Auth Section for Mobile */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            {currentUser ? (
              <>
                <div className="px-3 py-2 bg-slate-50 rounded-xl">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                </div>
                <Link
                  href="/account/downloads"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    <span>My Downloads</span>
                  </div>
                  {downloadsCount > 0 && (
                    <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {downloadsCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 rounded-xl"
                >
                  <Package className="w-4 h-4" />
                  <span>My Orders & Settings</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutUser();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-red-600 bg-red-50 rounded-xl"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

