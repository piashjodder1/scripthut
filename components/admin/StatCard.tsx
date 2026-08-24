'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface StatCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  icon: LucideIcon;
  color?: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose';
  index?: number;
  delay?: number;
}

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  color = 'blue',
  index = 0,
  delay,
}: StatCardProps) {
  const colorMap = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
      badgeBg: 'bg-blue-50 text-blue-700',
      hoverBorder: 'hover:border-blue-300 hover:shadow-blue-500/5',
      glow: 'group-hover:bg-blue-600/5',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      badgeBg: 'bg-emerald-50 text-emerald-700',
      hoverBorder: 'hover:border-emerald-300 hover:shadow-emerald-500/5',
      glow: 'group-hover:bg-emerald-600/5',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      badgeBg: 'bg-amber-50 text-amber-700',
      hoverBorder: 'hover:border-amber-300 hover:shadow-amber-500/5',
      glow: 'group-hover:bg-amber-600/5',
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
      badgeBg: 'bg-purple-50 text-purple-700',
      hoverBorder: 'hover:border-purple-300 hover:shadow-purple-500/5',
      glow: 'group-hover:bg-purple-600/5',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
      badgeBg: 'bg-rose-50 text-rose-700',
      hoverBorder: 'hover:border-rose-300 hover:shadow-rose-500/5',
      glow: 'group-hover:bg-rose-600/5',
    },
  };

  const scheme = colorMap[color] || colorMap.blue;
  const animationDelay = delay !== undefined ? delay : index * 0.06;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      transition={{
        duration: 0.35,
        delay: animationDelay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${scheme.hoverBorder}`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="block text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider truncate">
          {label}
        </span>
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${scheme.iconBg}`}
        >
          <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
        </div>
      </div>

      <div>
        <span className="block text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
          {value}
        </span>
        {subtext && (
          <span className="block text-[11px] font-semibold text-slate-500 mt-1.5 truncate">
            {subtext}
          </span>
        )}
      </div>
    </motion.div>
  );
}


