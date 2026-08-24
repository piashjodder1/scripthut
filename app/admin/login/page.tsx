'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, Code2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAdmin, settings } = useApp();
  const [email, setEmail] = useState('admin@scripthub.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      router.push('/admin');
    }
  }, [isAdmin, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const success = login(email, password);
    setIsSubmitting(false);

    if (success) {
      router.push('/admin');
    } else {
      setError('Invalid credentials. You can use the default demo credentials provided below.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/25 group-hover:scale-105 transition-transform">
            <Code2 className="w-6 h-6" />
          </div>
          <span className="font-black text-2xl text-slate-900 tracking-tight">
            {settings.websiteName || 'ScriptVault'}
          </span>
        </Link>

        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          Admin Portal Authentication
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500">
          Sign in to manage scripts, categories, pricing, and marketplace settings.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-slate-200 py-8 px-6 sm:px-8 shadow-xl rounded-3xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs leading-relaxed font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@scripthub.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold shadow-md shadow-blue-600/25 transition-all cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span>Sign In to Admin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Hint */}
          <div className="pt-4 border-t border-slate-100">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-1.5 text-blue-600 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Demo Credentials Pre-filled:</span>
              </div>
              <div className="font-mono text-[11px] text-slate-700">
                Email: <span className="font-bold text-slate-900">admin@scripthub.com</span>
                <br />
                Password: <span className="font-bold text-slate-900">admin123</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            ← Return to Public Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
