import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { ToastContainer } from '@/components/common/Toast';
import { TelegramFloatingButton } from '@/components/common/TelegramFloatingButton';
import { DynamicHead } from '@/components/common/DynamicHead';

export const metadata: Metadata = {
  title: 'ScriptVault - Premium Ready-Made Scripts & Source Code Marketplace',
  description:
    'Discover, preview, and acquire high-performance web applications, mobile scripts, SaaS boilerplates, and tools with live demos and instant Telegram support.',
  openGraph: {
    title: 'ScriptVault - Premium Script Marketplace',
    description: 'Discover ready-made websites, applications and digital solutions.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScriptVault - Premium Script Marketplace',
    description: 'Discover ready-made websites, applications and digital solutions.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col antialiased selection:bg-blue-600 selection:text-white" suppressHydrationWarning>
        <AppProvider>
          <DynamicHead />
          {children}
          <TelegramFloatingButton />
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}
