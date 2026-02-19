'use client'

import React from 'react'
import { Bell, Menu } from 'lucide-react'
import { DashboardSearch } from './DashboardSearch'

interface NewDashboardHeaderProps {
  title: string
  subtitle?: string
  onOpenMobileMenu: () => void
}

export const NewDashboardHeader: React.FC<NewDashboardHeaderProps> = ({
  title,
  subtitle,
  onOpenMobileMenu,
}) => (
  <header className="z-30 flex justify-between items-center bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md px-4 md:px-8 border-slate-100/50 dark:border-slate-800/50 border-b lg:border-none h-16 md:h-24 shrink-0">
    <div className="flex items-center gap-3">
      <button
        className="lg:hidden hover:bg-slate-200/50 dark:hover:bg-slate-700/50 -me-2 p-2 rounded-xl text-slate-600 dark:text-slate-400 transition-colors"
        onClick={onOpenMobileMenu}
      >
        <Menu size={24} />
      </button>
      <div>
        <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg md:text-2xl line-clamp-1">
          {title}
        </h2>
        {subtitle && (
          <p className="hidden sm:block mt-0.5 text-[10px] text-slate-400 dark:text-slate-500 md:text-sm">
            {subtitle}
          </p>
        )}
      </div>
    </div>

    <div className="flex items-center gap-2 md:gap-4">
      <DashboardSearch />
      <button className="relative bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 shadow-sm p-2 md:p-3 border border-slate-100 dark:border-slate-700 rounded-xl md:rounded-2xl transition-colors">
        <Bell size={18} className="md:w-5 md:h-5 text-slate-600" />
        <span className="top-2 md:top-3 absolute bg-rose-500 border-2 border-white rounded-full w-2 h-2 end-2 md:end-3"></span>
      </button>
    </div>
  </header>
)
