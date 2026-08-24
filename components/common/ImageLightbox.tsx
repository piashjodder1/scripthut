'use client';

import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface ImageLightboxProps {
  isOpen: boolean;
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
  title?: string;
}

export function ImageLightbox({
  isOpen,
  images,
  currentIndex,
  onClose,
  onSelectIndex,
  title,
}: ImageLightboxProps) {
  const currentImage = images[currentIndex] || images[0];

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    onSelectIndex((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, onSelectIndex]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    onSelectIndex((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, onSelectIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || images.length === 0) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950/95 text-white backdrop-blur-md">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-3 sm:py-4 bg-slate-950/80 border-b border-slate-800/80 z-20">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
            <span className="bg-blue-600/30 text-blue-400 font-bold px-2.5 py-1 rounded-lg text-[11px] sm:text-xs border border-blue-500/30 shrink-0">
              {currentIndex + 1} / {images.length}
            </span>
            {title && <p className="text-xs sm:text-sm font-semibold text-slate-200 truncate">{title}</p>}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {currentImage && (
              <a
                href={currentImage}
                target="_blank"
                rel="noreferrer"
                className="p-2 sm:p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 active:bg-slate-700 rounded-xl transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                title="Open original image"
                aria-label="Open original image"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-2 sm:p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 active:bg-slate-700 rounded-xl transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
              title="Close (Esc)"
              aria-label="Close"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Main Stage */}
        <div className="relative flex-1 flex items-center justify-center p-2 sm:p-8 min-h-0 overflow-hidden">
          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 z-20 p-2.5 sm:p-3.5 rounded-full bg-slate-900/90 hover:bg-blue-600 active:bg-blue-700 text-white border border-slate-700/60 shadow-xl transition-all active:scale-90"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="relative max-w-5xl max-h-[76vh] w-full h-full flex items-center justify-center"
          >
            <img
              src={currentImage}
              alt={`Screenshot ${currentIndex + 1}`}
              className="max-w-full max-h-[76vh] object-contain rounded-lg sm:rounded-xl shadow-2xl border border-slate-800/80 select-none"
            />
          </motion.div>

          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-6 z-20 p-2.5 sm:p-3.5 rounded-full bg-slate-900/90 hover:bg-blue-600 active:bg-blue-700 text-white border border-slate-700/60 shadow-xl transition-all active:scale-90"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}
        </div>

        {/* Bottom Thumbnail Strip */}
        {images.length > 1 && (
          <div className="px-3 py-2.5 sm:py-3 bg-slate-950/80 border-t border-slate-800/80 overflow-x-auto">
            <div className="flex items-center justify-center gap-2 max-w-3xl mx-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectIndex(idx)}
                  className={`relative w-14 sm:w-16 h-10 sm:h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                    idx === currentIndex
                      ? 'border-blue-500 scale-105 shadow-md shadow-blue-500/20 opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
