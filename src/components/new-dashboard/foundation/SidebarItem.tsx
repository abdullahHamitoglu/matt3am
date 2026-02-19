'use client'

import React from 'react'
import type { SidebarItemProps } from '../types'

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full cursor-pointer flex items-center gap-1 px-4 py-3 rounded-2xl transition-all duration-200 group ${
      active
        ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900/30'
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-orange-500 dark:hover:text-orange-400'
    }`}
  >
    <Icon
      size={22}
      className={
        active
          ? 'text-white'
          : 'text-slate-400 dark:text-slate-500 group-hover:text-orange-500 dark:group-hover:text-orange-400'
      }
    />
    <span className="font-medium">{label}</span>
  </button>
)
