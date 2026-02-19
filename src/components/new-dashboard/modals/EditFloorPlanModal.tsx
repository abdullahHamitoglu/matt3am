'use client'

import React from 'react'
import { PlusCircle } from 'lucide-react'
import { Modal } from '../foundation/Modal'

interface EditFloorPlanModalProps {
  isOpen: boolean
  onClose: () => void
}

export const EditFloorPlanModal: React.FC<EditFloorPlanModalProps> = ({ isOpen, onClose }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="تعديل مخطط الصالة">
    <div className="space-y-5">
      <p className="mb-2 font-medium text-slate-500 dark:text-slate-400 text-sm">
        يمكنك إضافة طاولة جديدة أو تعديل توزيع الصالات.
      </p>
      <div className="gap-4 grid grid-cols-2">
        <div>
          <label className="block ms-1 mb-1.5 font-bold text-slate-500 dark:text-slate-400 text-xs">
            اسم/رقم الطاولة
          </label>
          <input
            type="text"
            placeholder="مثال: T-20"
            className="bg-slate-50 dark:bg-slate-800 px-4 py-3.5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 w-full font-bold text-slate-800 dark:text-slate-200"
          />
        </div>
        <div>
          <label className="block ms-1 mb-1.5 font-bold text-slate-500 dark:text-slate-400 text-xs">
            سعة الكراسي
          </label>
          <input
            type="number"
            placeholder="4"
            className="bg-slate-50 dark:bg-slate-800 px-4 py-3.5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 w-full font-bold text-slate-800 dark:text-slate-200"
          />
        </div>
        <div className="col-span-2">
          <label className="block ms-1 mb-1.5 font-bold text-slate-500 dark:text-slate-400 text-xs">
            المنطقة (الصالة)
          </label>
          <select className="bg-slate-50 dark:bg-slate-800 px-4 py-3.5 border-none rounded-2xl outline-none focus:ring-2 focus:ring-orange-500/20 w-full font-bold text-slate-800 dark:text-slate-200 appearance-none cursor-pointer">
            <option>الحديقة (مساحة خارجية)</option>
            <option>الصالة الداخلية (رئيسية)</option>
            <option>تراس VIP (طابق علوي)</option>
          </select>
        </div>
      </div>
      <button className="flex justify-center items-center gap-2 bg-slate-800 hover:bg-slate-900 shadow-lg mt-2 py-4 rounded-2xl w-full font-bold text-white text-lg hover:scale-[1.02] transition-transform">
        <PlusCircle size={22} strokeWidth={2.5} />
        <span>إضافة الطاولة للمخطط</span>
      </button>
    </div>
  </Modal>
)
