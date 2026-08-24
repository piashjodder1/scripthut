'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { formatTelegramUrl, formatTelegramUsername } from '@/lib/utils';
import {
  Code2,
  ShieldCheck,
  Send,
  Sparkles,
  Zap,
  Users,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

export default function AboutPage() {
  const { settings } = useApp();
  const telegramUrl = formatTelegramUrl(settings.telegramSupportUrl);
  const telegramHandle = formatTelegramUsername(settings.telegramUsername || settings.telegramSupportUrl);

  const faqs = [
    {
      q: 'What formats and code are included with each script?',
      a: 'All scripts come with 100% full source code, assets, database migrations/schemas, environment configuration examples, and documentation. No obfuscation or domain locks.',
    },
    {
      q: 'How does purchasing work?',
      a: 'Each script links to its verified checkout page or direct seller checkout URL. If you have custom requirements or inquiries, you can message our Telegram support directly.',
    },
    {
      q: 'How do I get customer support?',
      a: 'We keep our support quick and hassle-free via Telegram. Simply click the Telegram Support button anywhere on the site to chat with our engineering team in real-time.',
    },
    {
      q: 'Can I request customizations or custom scripts?',
      a: 'Yes! Reach out to us via Telegram with your scope and specifications, and we will guide you on feasibility, timeline, and pricing.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>About Our Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Empowering Developers to Launch Faster
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            We provide production-ready web scripts, boilerplates, and tools crafted with clean code, modern architecture, and straightforward licensing.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Modern Architecture</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every project follows industry best practices: React 19, Next.js 15, Tailwind CSS, TypeScript, and clean PHP/Laravel.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Instant Deployability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Detailed step-by-step guides and Docker/server scripts make deployment to VPS, Vercel, or cloud containers seamless.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Direct Telegram Channel</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Skip cumbersome ticketing queues. Connect directly on Telegram for speedy answers and personalized assistance.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <h4 className="text-sm font-bold text-slate-900">{faq.q}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-blue-600 rounded-3xl p-8 text-white text-center space-y-4 shadow-xl shadow-blue-600/20">
          <h2 className="text-2xl font-bold">Have questions or need assistance?</h2>
          <p className="text-blue-100 text-sm max-w-xl mx-auto">
            Our team is available daily on Telegram to answer questions about any script in our catalog.
          </p>
          <div className="pt-2">
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-sm hover:bg-slate-100 transition-colors shadow-md"
            >
              <Send className="w-4 h-4" />
              <span>Telegram Support: {telegramHandle}</span>
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
