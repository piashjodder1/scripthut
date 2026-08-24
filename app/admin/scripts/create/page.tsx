'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ScriptForm } from '@/components/admin/ScriptForm';
import { Script } from '@/lib/types';
import { ArrowLeft, Sparkles, PlusCircle } from 'lucide-react';

export default function CreateScriptPage() {
  const router = useRouter();
  const { addScript } = useApp();

  const handleSave = (data: Partial<Script>) => {
    addScript(data as Omit<Script, 'id' | 'createdAt' | 'updatedAt'>);
    router.push('/admin/scripts');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/scripts"
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create New Script Product</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Fill in script details, upload up to 10 screenshots, set prices, and configure external links.
          </p>
        </div>
      </div>

      {/* Script Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <ScriptForm
          onSave={handleSave}
          onCancel={() => router.push('/admin/scripts')}
        />
      </div>
    </div>
  );
}
