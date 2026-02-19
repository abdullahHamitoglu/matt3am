'use client'

import React from 'react'
import { X } from 'lucide-react'
import type { ModalProps } from '../types'

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null
  return (
    <div className="z-[100] fixed inset-0 flex justify-center items-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm p-4 animate-in duration-200 fade-in">
      <div
        className="flex flex-col bg-white dark:bg-slate-900 shadow-2xl rounded-[2rem] w-full max-w-lg max-h-[90vh] overflow-hidden animate-in duration-200 zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50 p-4 md:p-6 border-slate-50 dark:border-slate-700 border-b shrink-0">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg md:text-xl">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="hover:bg-slate-200 dark:hover:bg-slate-700 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 dark:text-slate-500 transition-colors"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>
        <div className="p-4 md:p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
