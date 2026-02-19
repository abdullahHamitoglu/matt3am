'use client'

import React from 'react'
import { Modal } from '../foundation/Modal'
import type { TableData } from '../types'

interface NewOrderModalProps {
  isOpen: boolean
  onClose: () => void
  tablesData: TableData[]
}

export const NewOrderModal: React.FC<NewOrderModalProps> = ({ isOpen, onClose, tablesData }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="بدء طلب جديد">
    <div className="space-y-4">
      <p className="mb-4 text-slate-500 text-sm">اختر طاولة متاحة لبدء تسجيل الطلب:</p>
      <div className="gap-3 grid grid-cols-3">
        {tablesData
          .filter((t) => t.status === 'free')
          .map((table) => (
            <button
              key={table.id}
              className="group flex flex-col justify-center items-center bg-emerald-50 hover:bg-emerald-500 p-4 border border-emerald-200 rounded-2xl text-emerald-700 hover:text-white transition-colors"
            >
              <span className="font-bold text-lg">{table.id}</span>
              <span className="opacity-80 mt-1 font-medium text-[10px]">
                {table.capacity} مقاعد
              </span>
            </button>
          ))}
        <button className="flex justify-center items-center col-span-3 bg-slate-50 hover:bg-slate-100 mt-2 p-4 border border-slate-200 rounded-2xl font-bold text-slate-600 transition-colors">
          + طلب سفري / توصيل (بدون طاولة)
        </button>
      </div>
    </div>
  </Modal>
)
