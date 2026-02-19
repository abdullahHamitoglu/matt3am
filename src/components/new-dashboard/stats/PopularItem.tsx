'use client'

import React from 'react'
import type { PopularItemProps } from '../types'

export const PopularItem: React.FC<PopularItemProps> = ({ name, count, price, rank }) => (
  <div className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 mb-3 p-3 rounded-2xl transition-colors cursor-pointer">
    <div className="flex items-center gap-3">
      <div className="flex justify-center items-center bg-white dark:bg-slate-900 shadow-sm rounded-lg w-8 h-8 font-bold text-orange-500 dark:text-orange-400 text-sm shrink-0">
        #{rank}
      </div>
      <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{name}</span>
    </div>
    <div className="ms-2 text-end shrink-0">
      <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">{count} طلب</p>
      <p className="text-[10px] text-slate-400 dark:text-slate-500">{price}</p>
    </div>
  </div>
)
