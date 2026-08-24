'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export function ToastContainer() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2.5 max-w-md w-[calc(100%-2rem)] sm:w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => {
          let Icon = CheckCircle2;
          let borderClass = 'border-blue-200 bg-white text-slate-800 shadow-blue-500/10';
          let iconClass = 'text-blue-600 bg-blue-50';

          if (toast.type === 'success') {
            Icon = CheckCircle2;
            borderClass = 'border-emerald-200 bg-white text-slate-800 shadow-emerald-500/10';
            iconClass = 'text-emerald-600 bg-emerald-50';
          } else if (toast.type === 'error') {
            Icon = AlertCircle;
            borderClass = 'border-rose-200 bg-white text-slate-800 shadow-rose-500/10';
            iconClass = 'text-rose-600 bg-rose-50';
          } else if (toast.type === 'warning') {
            Icon = AlertTriangle;
            borderClass = 'border-amber-200 bg-white text-slate-800 shadow-amber-500/10';
            iconClass = 'text-amber-600 bg-amber-50';
          } else if (toast.type === 'info') {
            Icon = Info;
            borderClass = 'border-blue-200 bg-white text-slate-800 shadow-blue-500/10';
            iconClass = 'text-blue-600 bg-blue-50';
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.94 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl backdrop-blur-sm ${borderClass} w-full`}
            >
              <div className={`p-2 rounded-xl shrink-0 ${iconClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">{toast.title}</h4>
                {toast.message && (
                  <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-snug">{toast.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-lg hover:bg-slate-100 shrink-0 cursor-pointer"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
