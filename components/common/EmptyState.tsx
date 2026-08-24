import React from 'react';
import { SearchX, FolderOpen, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  icon?: 'search' | 'folder' | 'alert';
}

export function EmptyState({
  title,
  description,
  actionText,
  actionHref,
  onActionClick,
  icon = 'search',
}: EmptyStateProps) {
  let IconComponent = SearchX;
  if (icon === 'folder') IconComponent = FolderOpen;
  if (icon === 'alert') IconComponent = AlertCircle;

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 bg-white rounded-2xl border border-slate-200 shadow-xs max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
        <IconComponent className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">{description}</p>

      {actionText && (
        <>
          {actionHref ? (
            <Link
              href={actionHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-xs"
            >
              {actionText}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onActionClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-xs"
            >
              {actionText}
            </button>
          )}
        </>
      )}
    </div>
  );
}
