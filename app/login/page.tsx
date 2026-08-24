'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { LogIn, Lock, Mail, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account/downloads';
  const { loginUser, currentUser, settings } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in, show quick welcome & redirect
  if (currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">You are logged in!</h2>
          <p className="text-sm text-slate-500 mt-1">Logged in as <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.email})</p>
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href={redirectUrl}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Go to My Downloads</span>
          </Link>
          <Link
            href="/scripts"
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-all"
          >
            Explore More Scripts
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const res = loginUser(email, password);
    setLoading(false);

    if (res.success) {
      router.push(redirectUrl);
    } else {
      setErrorMsg(res.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleFillDemoUser = () => {
    setEmail('user@example.com');
    setPassword('password123');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl text-blue-600 flex items-center justify-center mx-auto shadow-inner">
          <LogIn className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Log in to access your purchased scripts, license keys, and instant downloads.
        </p>
      </div>

      {/* Demo Credentials Quick Fill Banner */}
      <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="text-left">
            <p className="text-xs font-bold text-blue-900">Demo User Account</p>
            <p className="text-[11px] text-blue-700">user@example.com / password123</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleFillDemoUser}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-white hover:bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-lg transition-all shadow-2xs shrink-0"
        >
          Auto Fill
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="login-email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700" htmlFor="login-password">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>{loading ? 'Verifying...' : 'Log In & Access Downloads'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-slate-100 text-center space-y-3">
        <p className="text-xs text-slate-600">
          Don&apos;t have an account yet?{' '}
          <Link
            href={`/register${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Create an Account
          </Link>
        </p>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Instant password-protected digital asset delivery</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-slate-50/60">
      <Suspense fallback={<div className="p-8 text-center text-slate-500 text-sm">Loading login...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
