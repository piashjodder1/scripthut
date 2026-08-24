'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  User as UserIcon,
  Package,
  Download,
  Lock,
  Mail,
  Calendar,
  LogOut,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export default function AccountPage() {
  const { currentUser, userOrders, logoutUser, isMounted, settings } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  // Profile update feedback state
  const [name, setName] = useState(currentUser?.name || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isMounted) {
    return <div className="py-20 text-center text-slate-500 text-sm">Loading account...</div>;
  }

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
          <UserIcon className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Account</h2>
          <p className="text-sm text-slate-500 mt-1">
            Please log in or register to view your order history and manage your account.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/login?redirect=/account"
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md transition-all text-center"
          >
            Log In
          </Link>
          <Link
            href="/register?redirect=/account"
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all text-center"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  const currency = settings.currencySymbol || '$';
  const totalDownloads = userOrders.reduce((acc, order) => acc + order.items.length, 0);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6 space-y-8">
      {/* Top Banner / User Info */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-2xl rounded-2xl flex items-center justify-center shadow-md shadow-blue-600/20">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{currentUser.name}</h1>
              <span className="bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                Verified Buyer
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser.email}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Link
            href="/account/downloads"
            className="flex-1 md:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>My Downloads ({totalDownloads})</span>
          </Link>

          <button
            type="button"
            onClick={logoutUser}
            className="px-4 py-2.5 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({userOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Account Settings</span>
        </button>
      </div>

      {/* Tab Content: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {userOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center mx-auto">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Orders Found</h3>
              <p className="text-xs text-slate-500">
                You haven&apos;t placed any orders yet. Check out our latest scripts!
              </p>
              <Link
                href="/scripts"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          Order #{order.orderNumber}
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{order.status.toUpperCase()}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.paymentMethod}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-xs text-slate-400 block">Total Amount</span>
                      <span className="text-lg font-black text-slate-900">
                        {currency}
                        {order.totalAmount}
                      </span>
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-100"
                      >
                        <div className="flex items-center gap-3">
                          {item.mainImage && (
                            <img
                              src={item.mainImage}
                              alt={item.title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          )}
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                              <span>{item.version || 'v2.0'}</span>
                              <span>•</span>
                              <span>{item.framework || 'Script'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <Link
                            href="/account/downloads"
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Files</span>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Profile Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Account Preferences</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your account display name and notification preferences.
            </p>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                disabled
                value={currentUser.email}
                className="w-full px-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Email address cannot be changed as it is bound to your digital licenses.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
