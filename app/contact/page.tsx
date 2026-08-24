'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { formatTelegramUrl, formatTelegramUsername } from '@/lib/utils';
import {
  Send,
  MessageCircle,
  Mail,
  Clock,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function ContactPage() {
  const { settings, showToast } = useApp();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const telegramUrl = formatTelegramUrl(settings.telegramSupportUrl);
  const telegramHandle = formatTelegramUsername(settings.telegramUsername || settings.telegramSupportUrl);

  const handleSendToTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      showToast('error', 'Message Required', 'Please enter your question before continuing.');
      return;
    }

    const text = encodeURIComponent(
      `Hello ScriptHub Team,\n\nSubject: ${subject || 'General Inquiry'}\nMessage: ${message}`
    );
    const targetUrl = settings.telegramUsername
      ? `https://t.me/${settings.telegramUsername.replace('@', '')}?text=${text}`
      : `${telegramUrl}?text=${text}`;

    window.open(targetUrl, '_blank');
    showToast('success', 'Redirecting', 'Opening Telegram chat with your inquiry message pre-filled.');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-3.5 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 sm:space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] sm:text-xs font-bold border border-blue-200">
            <Send className="w-3.5 h-3.5" />
            <span>Instant Telegram Support</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            How Can We Help You?
          </h1>
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
            We provide direct developer assistance via Telegram. No complicated tickets or delays.
          </p>
        </div>

        {/* Telegram Spotlight Box */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl sm:rounded-3xl p-5 sm:p-10 text-white shadow-xl shadow-blue-600/20 space-y-5 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 sm:gap-6 pb-5 sm:pb-6 border-b border-blue-500/50">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white shrink-0 border border-white/20">
                <Send className="w-6 h-6 sm:w-7 sm:h-7 -translate-x-0.5 translate-y-0.5" />
              </div>
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold text-blue-200">
                  Official Channel
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white">Telegram Direct Chat</h3>
                <p className="text-xs text-blue-100 mt-0.5 font-medium">Username: {telegramHandle}</p>
              </div>
            </div>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-blue-700 font-bold text-xs sm:text-sm shadow-md transition-all shrink-0"
            >
              <span>Open Telegram Now</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Fast reply during business hours</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Pre-sale script consultations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Custom modification quotes</span>
            </div>
          </div>
        </div>

        {/* Quick Message Helper */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 shadow-xs space-y-5 sm:space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">Prepare an Inquiry for Telegram</h3>
            <p className="text-xs text-slate-600 mt-1">
              Type your message below and we will automatically open Telegram with your text formatted ready to send.
            </p>
          </div>

          <form onSubmit={handleSendToTelegram} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Topic / Script Name
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Gaming Tournament Script Inquiry"
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-blue-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Your Message / Question <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I would like to know if this script supports..."
                className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:border-blue-500 leading-relaxed font-medium"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Send via Telegram</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
