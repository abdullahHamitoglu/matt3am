'use client'

import React from 'react'
import { Clock, CreditCard, Utensils, Users } from 'lucide-react'
import type { TableCardProps, ThemeColor } from '../types'

export const TableCard: React.FC<TableCardProps> = ({ data, onClick }) => {
  const { id, zoneName, themeColor = 'slate', status, guests, capacity, time, bill } = data
  const colors: Record<ThemeColor, string> = {
    slate: 'bg-slate-50 border-slate-200 text-slate-700',
    emerald: 'bg-emerald-900/20 border-emerald-200 text-emerald-700',
    blue: 'bg-blue-900/20 border-blue-200 text-blue-700',
    amber: 'bg-amber-900/20 border-amber-200 text-amber-800',
    rose: 'bg-rose-900/20 border-rose-200 text-rose-700',
  }

  const baseColor = colors[themeColor] || colors.slate

  return (
    <div
      onClick={() => onClick(data)}
      className={`relative flex flex-col p-4 md:p-5 border-2 rounded-3xl cursor-pointer hover:scale-[1.02] transition-all duration-200 shadow-sm ${baseColor} ${status !== 'free' ? 'shadow-md' : 'border-dashed opacity-80'}`}
    >
      <div className="flex justify-between items-center mb-2 md:mb-3">
        <span className="opacity-60 font-bold text-[10px] md:text-xs uppercase line-clamp-1 tracking-wider">
          {zoneName}
        </span>
        {status === 'payment' && (
          <span className="relative flex w-3 h-3 shrink-0">
            <span className="inline-flex absolute bg-rose-400 opacity-75 rounded-full w-full h-full animate-ping"></span>
            <span className="inline-flex relative bg-rose-500 rounded-full w-3 h-3"></span>
          </span>
        )}
      </div>

      <div className="flex justify-between items-end mb-4 md:mb-5">
        <h4 className="font-black text-2xl md:text-3xl">{id}</h4>
        <div className="flex items-center gap-1 opacity-75">
          <Users size={14} className="md:w-4 md:h-4" />
          <span className="font-bold text-xs md:text-sm">
            {status === 'free' ? capacity : guests} ضيوف
          </span>
        </div>
      </div>

      <div className="mt-auto">
        {status === 'free' && (
          <div className="inline-flex items-center gap-1 bg-white/50 px-2 md:px-3 py-1.5 rounded-xl font-bold text-[10px] md:text-xs">
            <span>متاح للجلوس</span>
          </div>
        )}

        {status === 'ordering' && (
          <div className="flex justify-between items-center">
            <div className="inline-flex items-center gap-1 bg-white/60 shadow-sm px-2 md:px-3 py-1.5 rounded-xl font-bold text-[10px] md:text-xs">
              <Utensils size={12} className="md:w-[14px] md:h-[14px]" />
              <span>قيد الطلب</span>
            </div>
            {time && (
              <span className="flex items-center opacity-75 font-bold text-[10px] md:text-xs">
                <Clock size={10} className="ms-1" /> {time}
              </span>
            )}
          </div>
        )}

        {status === 'payment' && (
          <div className="flex justify-between items-center">
            <div className="inline-flex items-center gap-1 bg-rose-100 shadow-sm px-2 md:px-3 py-1.5 border border-rose-200 rounded-xl font-bold text-[10px] text-rose-700 md:text-xs">
              <CreditCard size={12} className="md:w-[14px] md:h-[14px]" />
              <span>بانتظار الدفع</span>
            </div>
            {bill && <span className="font-black text-rose-700 text-xs md:text-sm">{bill}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
