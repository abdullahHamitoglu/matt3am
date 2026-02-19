'use client'

import React from 'react'
import type { ActivityItemProps, OrderStatus } from '../types'

export const ActivityItem: React.FC<ActivityItemProps> = ({
  orderId,
  table,
  items,
  time,
  status,
  onClick,
}) => {
  const statusColors: Record<OrderStatus, string> = {
    new: 'bg-emerald-100 text-emerald-600',
    cooking: 'bg-orange-100 text-orange-600',
    ready: 'bg-blue-100 text-blue-600',
  }
  const statusLabels: Record<OrderStatus, string> = {
    new: 'جديد',
    cooking: 'يُحضر',
    ready: 'جاهز',
  }

  return (
    <div
      onClick={onClick}
      className="group flex sm:flex-row flex-col justify-between sm:items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800 p-4 border-slate-50 dark:border-slate-800 last:border-0 border-b rounded-xl transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="flex justify-center items-center bg-slate-100 dark:bg-slate-800 dark:group-hover:bg-slate-700 group-hover:bg-white group-hover:shadow-sm rounded-full w-10 h-10 font-bold text-slate-500 dark:text-slate-400 text-sm transition-all shrink-0">
          {table}
        </div>
        <div>
          <h4 className="font-bold text-slate-800 dark:group-hover:text-orange-400 dark:text-slate-200 group-hover:text-orange-500 text-sm transition-colors">
            طلب #{orderId}
          </h4>
          <p className="text-slate-400 dark:text-slate-500 text-xs line-clamp-1">{items}</p>
        </div>
      </div>
      <div className="flex justify-between sm:justify-end items-center gap-4 w-full sm:w-auto">
        <span
          className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold ${statusColors[status]}`}
        >
          {statusLabels[status]}
        </span>
        <span className="font-mono text-slate-400 text-xs">{time}</span>
      </div>
    </div>
  )
}
