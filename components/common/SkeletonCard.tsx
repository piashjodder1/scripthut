import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse flex flex-col">
      {/* Image thumbnail skeleton */}
      <div className="w-full aspect-video bg-slate-200" />

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="h-5 w-20 bg-slate-200 rounded-full" />
            <div className="h-4 w-12 bg-slate-200 rounded-md" />
          </div>
          <div className="h-6 w-3/4 bg-slate-200 rounded-md mb-2" />
          <div className="space-y-1.5">
            <div className="h-4 w-full bg-slate-100 rounded-md" />
            <div className="h-4 w-5/6 bg-slate-100 rounded-md" />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="h-6 w-24 bg-slate-200 rounded-md" />
          <div className="h-9 w-28 bg-slate-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <SkeletonCard key={idx} />
      ))}
    </div>
  );
}
