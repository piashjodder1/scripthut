'use client';

import React, { useState } from 'react';
import { ImageLightbox } from '@/components/common/ImageLightbox';
import { Maximize2, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

interface ScreenshotGalleryProps {
  screenshots: string[];
  title: string;
}

export function ScreenshotGallery({ screenshots, title }: ScreenshotGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Filter out any empty strings
  const validScreenshots = (screenshots || []).filter((s) => Boolean(s && s.trim()));

  if (validScreenshots.length === 0) {
    return null;
  }

  const currentImage = validScreenshots[activeIdx] || validScreenshots[0];

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <span>Screenshots</span>
          <span className="text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
            {validScreenshots.length} {validScreenshots.length === 1 ? 'image' : 'images'}
          </span>
        </h3>
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/90 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors shrink-0"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden xs:inline sm:inline">Fullscreen</span>
          <span className="xs:hidden sm:hidden">Expand</span>
        </button>
      </div>

      {/* Main Preview Stage with Responsive Aspect Ratio and Touch targets */}
      <div className="relative aspect-[16/10] sm:aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs group">
        <img
          src={currentImage}
          alt={`${title} screenshot ${activeIdx + 1}`}
          className="w-full h-full object-contain cursor-pointer transition-transform duration-300"
          onClick={() => setIsLightboxOpen(true)}
        />

        {/* Hover overlay hint */}
        <div
          onClick={() => setIsLightboxOpen(true)}
          className="absolute inset-0 bg-slate-950/30 opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer pointer-events-none sm:pointer-events-auto"
        >
          <div className="flex items-center gap-2 bg-white/95 backdrop-blur-xs text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-lg">
            <Eye className="w-4 h-4 text-blue-600" />
            Click to expand image
          </div>
        </div>

        {/* Arrow Navigation on Stage with min 44px touch targets on mobile */}
        {validScreenshots.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx((prev) => (prev - 1 + validScreenshots.length) % validScreenshots.length);
              }}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white active:bg-slate-200 text-slate-800 shadow-md flex items-center justify-center transition-transform active:scale-90"
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveIdx((prev) => (prev + 1) % validScreenshots.length);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white active:bg-slate-200 text-slate-800 shadow-md flex items-center justify-center transition-transform active:scale-90"
              aria-label="Next screenshot"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Mobile current index indicator */}
        <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-lg border border-slate-700">
          {activeIdx + 1} / {validScreenshots.length}
        </div>
      </div>

      {/* Thumbnails Row (Touch scrollable) */}
      {validScreenshots.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none py-1">
          {validScreenshots.map((shot, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIdx(idx)}
              className={`relative w-16 sm:w-22 aspect-video rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                activeIdx === idx
                  ? 'border-blue-600 ring-2 ring-blue-100 scale-105 shadow-xs'
                  : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-slate-300'
              }`}
            >
              <img src={shot} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              <span className="absolute bottom-1 right-1 text-[8px] sm:text-[9px] font-bold bg-slate-900/80 text-white px-1 rounded">
                {idx + 1}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        images={validScreenshots}
        currentIndex={activeIdx}
        onClose={() => setIsLightboxOpen(false)}
        onSelectIndex={(idx) => setActiveIdx(idx)}
        title={title}
      />
    </div>
  );
}
