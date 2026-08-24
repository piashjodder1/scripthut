'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { formatTelegramUrl } from '@/lib/utils';
import { Send, MessageCircle } from 'lucide-react';

export function TelegramFloatingButton() {
  const { settings } = useApp();
  const telegramUrl = formatTelegramUrl(settings.telegramSupportUrl);

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center group">
      {/* Tooltip on Desktop */}
      <div className="hidden sm:block mr-3 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Need help? Chat on Telegram
      </div>

      <a
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300"
        aria-label="Contact Telegram Support"
      >
        {/* Pulse indicator */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
        </span>

        <Send className="w-6 h-6 -translate-x-0.5 translate-y-0.5" />
      </a>
    </div>
  );
}
