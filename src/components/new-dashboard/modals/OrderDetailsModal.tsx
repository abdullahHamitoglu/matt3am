'use client'

import React from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Modal } from '../foundation/Modal'

interface OrderDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  orderId: string | null
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  orderId,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={`تفاصيل الطلب #${orderId}`}>
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 mb-4 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-white dark:bg-slate-700 shadow-sm rounded-xl w-12 h-12 font-bold text-slate-700 dark:text-slate-200 text-lg">
            T-12
          </div>
          <div>
            <p className="font-medium text-slate-400 dark:text-slate-500 text-xs">طاولة داخلية</p>
            <p className="font-bold text-slate-800 dark:text-slate-200">تناول محلي (Dine-in)</p>
          </div>
        </div>
        <div className="text-start">
          <span className="bg-emerald-100 px-3 py-1 rounded-full font-bold text-emerald-700 text-xs">
            قيد التحضير
          </span>
        </div>
      </div>

      <div className="space-y-3 pe-2 max-h-48 overflow-y-auto">
        <div className="flex justify-between items-center pb-2 border-slate-100 dark:border-slate-700 border-b">
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-200">2x برجر دبل تشيز</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs">بدون بصل، زيادة صوص</p>
          </div>
          <p className="font-bold text-slate-800 dark:text-slate-200">₺500</p>
        </div>
        <div className="flex justify-between items-center pb-2 border-slate-100 dark:border-slate-700 border-b">
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-200">1x بيبسي كبير</p>
          </div>
          <p className="font-bold text-slate-800 dark:text-slate-200">₺45</p>
        </div>
      </div>

      <div className="flex justify-between items-end mt-4 pt-4 border-slate-100 dark:border-slate-700 border-t">
        <div>
          <p className="font-bold text-slate-400 dark:text-slate-500 text-xs uppercase">
            الإجمالي المطلوب
          </p>
          <p className="font-black text-slate-800 dark:text-slate-100 text-3xl">₺545</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-4 py-3 rounded-2xl font-bold text-slate-600 dark:text-slate-400 transition-colors">
            طباعة الفاتورة
          </button>
          <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200 px-6 py-3 rounded-2xl font-bold text-white transition-colors">
            <CheckCircle2 size={18} />
            <span>إتمام الدفع</span>
          </button>
        </div>
      </div>
    </div>
  </Modal>
)
