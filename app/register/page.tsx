'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { UserPlus, Lock, Mail, User as UserIcon, ArrowRight, ShieldCheck, Download, CheckCircle2 } from 'lucide-react';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account/downloads';
  const { registerUser, currentUser } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in
  if (currentUser) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200/80 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Account Active!</h2>
          <p className="text-sm text-slate-500 mt-1">
            Logged in as <strong className="text-slate-800">{currentUser.name}</strong> ({currentUser.email})
          </p>
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
            Browse Scripts Catalog
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    const res = registerUser(name, email, password);
    setLoading(false);

    if (res.success) {
      router.push(redirectUrl);
    } else {
      setErrorMsg(res.message || 'Registration failed.');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-blue-50 rounded-2xl text-blue-600 flex items-center justify-center mx-auto shadow-inner">
          <UserPlus className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create User Account</h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Register with a secure password to unlock instant script downloads and licensing.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl">
          {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="reg-name">
            Full Name
          </label>
          <div className="relative">
            <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="reg-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="reg-email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="reg-email"
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
          <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="reg-password">
            Password (Min 5 characters)
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="reg-password"
              type="password"
              required
              minLength={5}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create strong password"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="reg-confirm-password">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="reg-confirm-password"
              type="password"
              required
              minLength={5}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-slate-900 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span>Instant download access immediately upon password creation</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span>Lifetime access to source code zip archives & updates</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-md shadow-blue-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>{loading ? 'Creating Account...' : 'Register & Unlock Downloads'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-slate-100 text-center space-y-3">
        <p className="text-xs text-slate-600">
          Already have an account?{' '}
          <Link
            href={`/login${redirectUrl ? `?redirect=${encodeURIComponent(redirectUrl)}` : ''}`}
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Log In Here
          </Link>
        </p>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Protected with secure client-side digital licensing</span>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 bg-slate-50/60">
      <Suspense fallback={<div className="p-8 text-center text-slate-500 text-sm">Loading registration...</div>}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
