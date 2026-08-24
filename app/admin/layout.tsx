'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminNavbar } from '@/components/admin/AdminNavbar';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAdmin, isLoading } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (!isLoginPage && !isLoading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, isLoading, isLoginPage, router]);

  // If this is the login page, render children directly without the admin shell
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 gap-3">
        <LoadingSpinner size="lg" />
        <span className="text-xs font-bold text-slate-500">Loading admin portal...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Admin Wrapper */}
      <div className="lg:pl-64 flex flex-col flex-1 min-h-screen">
        <AdminNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
