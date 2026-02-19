'use client'

import React from 'react'
import { UtensilsCrossed, Plus, Settings2 } from 'lucide-react'
import type { FloorPlanViewProps } from '../types'
import { TableCard } from './TableCard'

export const FloorPlanView: React.FC<FloorPlanViewProps> = ({
  tablesData,
  onTableClick,
  onAddTable,
}) => (
  <div className="relative flex flex-col h-full animate-in duration-500 fade-in">
    {/* Filter Bar */}
    <div className="z-10 flex md:flex-row flex-col justify-between md:items-center gap-4 bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-900/50 mb-4 md:mb-6 p-3 md:p-4 border border-slate-100 dark:border-slate-800 rounded-2xl md:rounded-3xl">
      <div className="flex gap-2 -mx-2 md:mx-0 px-2 md:px-0 pb-1 md:pb-0 overflow-x-auto scrollbar-hide shrink-0">
        <button className="flex items-center gap-2 bg-slate-800 dark:bg-slate-700 shadow-md px-5 py-2 rounded-full font-bold text-white text-xs md:text-sm whitespace-nowrap shrink-0">
          <UtensilsCrossed size={14} />
          <span>الكل (All)</span>
        </button>
        <button className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 px-5 py-2 rounded-full font-bold text-slate-500 dark:text-slate-400 text-xs md:text-sm whitespace-nowrap transition-colors shrink-0">
          الحديقة
        </button>
        <button className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 px-5 py-2 rounded-full font-bold text-slate-500 dark:text-slate-400 text-xs md:text-sm whitespace-nowrap transition-colors shrink-0">
          الصالة الداخلية
        </button>
        <button className="bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 px-5 py-2 rounded-full font-bold text-slate-500 dark:text-slate-400 text-xs md:text-sm whitespace-nowrap transition-colors shrink-0">
          تراس VIP
        </button>
      </div>

      <div className="flex justify-between sm:justify-end items-center gap-4 w-full sm:w-auto shrink-0">
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="bg-slate-300 rounded-full w-2.5 h-2.5"></div>
            <span className="font-medium text-[10px] text-slate-600 md:text-xs">متاح</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="bg-blue-400 rounded-full w-2.5 h-2.5"></div>
            <span className="font-medium text-[10px] text-slate-600 md:text-xs">قيد الطلب</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="bg-rose-500 rounded-full w-2.5 h-2.5"></div>
            <span className="font-medium text-[10px] text-slate-600 md:text-xs">للدفع</span>
          </div>
        </div>

        <button
          onClick={onAddTable}
          className="hidden lg:flex items-center gap-1 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl font-bold text-orange-600 text-xs transition-colors"
        >
          <Settings2 size={14} />
          <span>تعديل المخطط</span>
        </button>
      </div>
    </div>

    {/* The Grid Area */}
    <div className="relative flex-1 bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-900/50 p-4 md:p-8 border border-slate-100 dark:border-slate-800 rounded-2xl md:rounded-3xl min-h-[50vh] overflow-x-hidden overflow-y-auto">
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#cbd5e1 2px, transparent 2px)',
          backgroundSize: '32px 32px',
        }}
      ></div>
      <div className="z-10 relative mx-auto pb-24 max-w-6xl">
        <div className="gap-4 md:gap-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
          {tablesData.map((table) => (
            <TableCard key={table.id} data={table} onClick={onTableClick} />
          ))}
        </div>
      </div>

      <button
        onClick={onAddTable}
        className="lg:hidden bottom-6 z-20 absolute flex justify-center items-center bg-orange-500 hover:bg-orange-600 shadow-orange-200 shadow-xl rounded-full w-14 h-14 text-white hover:scale-105 transition-all start-6"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>
    </div>
  </div>
)
