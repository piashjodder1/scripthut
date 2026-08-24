'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ScriptForm } from '@/components/admin/ScriptForm';
import { EmptyState } from '@/components/common/EmptyState';
import { Script } from '@/lib/types';
import { ArrowLeft, Edit, ExternalLink } from 'lucide-react';

interface EditScriptPageProps {
  params: Promise<{ id: string }>;
}

export default function EditScriptPage({ params }: EditScriptPageProps) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { scripts, updateScript } = useApp();

  const script = scripts.find((s) => s.id === unwrappedParams.id);

  if (!script) {
    return (
      <div className="p-8">
        <EmptyState
          title="Script Not Found"
          description="The requested script could not be found or has been removed."
          actionText="Back to Scripts"
          actionHref="/admin/scripts"
          icon="alert"
        />
      </div>
    );
  }

  const handleSave = (data: Partial<Script>) => {
    updateScript(script.id, data);
    router.push('/admin/scripts');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/scripts"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Edit Script: {script.title}</h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Update information, manage up to 10 screenshots, toggle discounts, and configure demo/buy URLs.
            </p>
          </div>
        </div>

        <Link
          href={`/scripts/${script.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors self-start sm:self-auto"
        >
          <span>View Public Page</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Script Form Container */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <ScriptForm
          initialData={script}
          onSave={handleSave}
          onCancel={() => router.push('/admin/scripts')}
        />
      </div>
    </div>
  );
}
