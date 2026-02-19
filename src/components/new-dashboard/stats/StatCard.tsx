'use client'

import React from 'react'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import type { StatCardProps } from '../types'

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendValue,
}) => (
  <div className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 shadow-sm hover:shadow-md dark:hover:shadow-slate-900 dark:shadow-slate-900/50 p-5 md:p-6 border border-slate-100 dark:border-slate-800 rounded-3xl h-full overflow-hidden transition-all duration-300">
    <div className="z-10 relative flex justify-between items-start mb-4">
      <div className="flex justify-center items-center bg-slate-50 dark:bg-slate-800 dark:group-hover:bg-orange-500 group-hover:bg-orange-500 rounded-2xl w-10 md:w-12 h-10 md:h-12 text-slate-400 dark:text-slate-500 group-hover:text-white transition-colors duration-300">
        <Icon size={20} className="md:w-6 md:h-6" strokeWidth={2} />
      </div>
      <div
        className={`flex items-center px-2 py-1 rounded-lg text-xs font-bold ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}
      >
        {trend === 'up' ? (
          <ArrowUpRight size={14} className="ms-1" />
        ) : (
          <ArrowDownRight size={14} className="ms-1" />
        )}
        {trendValue}
      </div>
    </div>
    <div className="z-10 relative">
      <h3 className="mb-1 font-extrabold text-slate-800 dark:text-slate-100 text-3xl md:text-4xl tracking-tight">
        {value}
      </h3>
      <p className="flex items-center font-medium text-slate-400 dark:text-slate-500 text-xs md:text-sm">
        {title}
        <span className="hidden sm:inline me-2 font-normal text-[10px] text-slate-300 dark:text-slate-600 md:text-xs">
          | {subtext}
        </span>
      </p>
    </div>
    <div className="-bottom-4 absolute bg-slate-50 dark:bg-slate-800 opacity-0 group-hover:opacity-100 blur-2xl rounded-full w-24 h-24 transition-opacity duration-500 -start-4"></div>
  </div>
)
