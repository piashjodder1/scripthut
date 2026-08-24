import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'discount' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    primary: 'bg-blue-50 text-blue-700 border-blue-200/80',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
    discount: 'bg-rose-50 text-rose-700 border-rose-200/80 font-bold',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/80',
    outline: 'bg-transparent text-slate-600 border-slate-300',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md font-medium tracking-tight',
    md: 'text-xs px-2.5 py-1 rounded-lg font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 border whitespace-nowrap leading-none select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}
