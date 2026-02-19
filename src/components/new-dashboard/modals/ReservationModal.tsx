'use client'

import React from 'react'
import { Modal } from '../foundation/Modal'

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ReservationModal: React.FC<ReservationModalProps> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="حجز طاولة جديدة">
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onClose()
      }}
    >
      <div>
        <label className="block ms-1 mb-1 font-bold text-slate-500 dark:text-slate-400 text-xs">
          اسم العميل
        </label>
        <input
          type="text"
          placeholder="مثال: عبد المؤمن"
          className="bg-slate-50 dark:bg-slate-800 px-4 py-3 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 w-full text-slate-800 dark:placeholder:text-slate-600 dark:text-slate-200 placeholder:text-slate-300"
        />
      </div>
      <div className="gap-4 grid grid-cols-2">
        <div>
          <label className="block ms-1 mb-1 font-bold text-slate-500 dark:text-slate-400 text-xs">
            تاريخ الحجز
          </label>
          <input
            type="date"
            className="bg-slate-50 dark:bg-slate-800 px-4 py-3 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 w-full text-slate-800 dark:text-slate-200"
          />
        </div>
        <div>
          <label className="block ms-1 mb-1 font-bold text-slate-500 dark:text-slate-400 text-xs">
            الوقت
          </label>
          <input
            type="time"
            className="bg-slate-50 dark:bg-slate-800 px-4 py-3 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 w-full text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>
      <div>
        <label className="block ms-1 mb-1 font-bold text-slate-500 dark:text-slate-400 text-xs">
          عدد الأشخاص
        </label>
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl">
          {[2, 3, 4, 6, 8, '+8'].map((num) => (
            <button
              type="button"
              key={num}
              className="flex-1 hover:bg-white focus:bg-orange-500 dark:hover:bg-slate-700 hover:shadow-sm py-2 rounded-xl font-medium text-slate-600 focus:text-white dark:text-slate-400 transition-all"
            >
              {num}
            </button>
          ))}
        </div>
      </div>
      <button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200 mt-6 py-4 rounded-2xl w-full font-bold text-white text-lg transition-colors"
      >
        تأكيد الحجز
      </button>
    </form>
  </Modal>
)
