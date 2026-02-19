'use client'

import React from 'react'
import { Plus, Edit, Trash2, Receipt, ShoppingBag, CalendarDays, Settings2 } from 'lucide-react'
import { Modal } from '../foundation/Modal'
import type { TableData, ModalType } from '../types'

interface TableDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  selectedTable: TableData | null
  onOpenModal: (modal: ModalType) => void
}

export const TableDetailsModal: React.FC<TableDetailsModalProps> = ({
  isOpen,
  onClose,
  selectedTable,
  onOpenModal,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={selectedTable ? `إدارة الطاولة: ${selectedTable.id}` : ''}
  >
    {selectedTable && (
      <div className="space-y-5">
        <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 md:p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
          <div>
            <p className="mb-1 font-bold text-slate-400 dark:text-slate-500 text-xs">
              {selectedTable.zoneName}
            </p>
            <p className="font-black text-slate-800 dark:text-slate-100 text-xl md:text-2xl">
              {selectedTable.status === 'free' ? 'طاولة متاحة' : `ضيوف: ${selectedTable.guests}`}
            </p>
          </div>
          <div className="text-start">
            <span
              className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm border ${
                selectedTable.status === 'free'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : selectedTable.status === 'payment'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}
            >
              {selectedTable.status === 'free'
                ? 'جاهز للجلوس'
                : selectedTable.status === 'payment'
                  ? 'بانتظار الدفع'
                  : 'قيد الطلب'}
            </span>
          </div>
        </div>

        {selectedTable.status !== 'free' ? (
          <>
            <div className="space-y-3 bg-white dark:bg-slate-800 shadow-sm p-4 md:p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
              <h4 className="flex justify-between items-center mb-3 font-bold text-slate-800 dark:text-slate-100 text-sm">
                <span>الطلب الحالي</span>
                {selectedTable.time && (
                  <span className="bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded font-normal text-slate-400 dark:text-slate-500 text-xs">
                    مدة الجلوس: {selectedTable.time}
                  </span>
                )}
              </h4>
              <div className="flex justify-between items-center pb-3 border-slate-50 dark:border-slate-700 border-b">
                <div>
                  <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                    2x برجر دبل تشيز
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                    بدون بصل، زيادة صوص
                  </p>
                </div>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">₺500</p>
              </div>
              <div className="flex justify-between items-center pb-3 border-slate-50 dark:border-slate-700 border-b">
                <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">
                  1x بيبسي كبير
                </p>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">₺45</p>
              </div>
              <div className="flex justify-between items-center pt-2">
                <p className="font-bold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wide">
                  الإجمالي (شامل الضريبة)
                </p>
                <p className="font-black text-slate-800 dark:text-slate-100 text-2xl">
                  {selectedTable.bill || '₺0'}
                </p>
              </div>
            </div>

            <div className="gap-3 grid grid-cols-2 pt-2">
              <button className="flex justify-center items-center gap-2 col-span-2 bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-200 py-3.5 rounded-xl font-bold text-white text-sm hover:scale-[1.02] transition-transform">
                <Plus size={18} strokeWidth={2.5} />
                <span>إضافة أصناف للطلب</span>
              </button>
              <button className="flex justify-center items-center gap-2 bg-slate-50 hover:bg-slate-100 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 text-sm transition-colors">
                <Edit size={16} />
                <span>تعديل الطلب</span>
              </button>
              <button className="flex justify-center items-center gap-2 bg-rose-50 hover:bg-rose-100 py-3 border border-rose-100 rounded-xl font-bold text-rose-600 text-sm transition-colors">
                <Trash2 size={16} />
                <span>إلغاء الطلب</span>
              </button>
              <button
                className={`col-span-2 mt-2 text-white py-4 rounded-xl font-black text-lg shadow-lg flex justify-center items-center gap-2 transition-transform hover:scale-[1.02] ${
                  selectedTable.status === 'payment'
                    ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200'
                    : 'bg-slate-800 hover:bg-slate-900 shadow-slate-300'
                }`}
              >
                <Receipt size={22} />
                <span>
                  {selectedTable.status === 'payment'
                    ? 'إتمام الدفع وتحرير الطاولة'
                    : 'إصدار الفاتورة'}
                </span>
              </button>
            </div>
          </>
        ) : (
          <div className="gap-3 grid grid-cols-1 pt-2">
            <button
              onClick={() => onOpenModal('newOrder')}
              className="flex justify-center items-center gap-2 bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200 py-4 rounded-xl font-bold text-white text-lg hover:scale-[1.02] transition-transform"
            >
              <ShoppingBag size={20} />
              <span>بدء طلب جديد (Dine-in)</span>
            </button>
            <button
              onClick={() => onOpenModal('reservation')}
              className="flex justify-center items-center gap-2 bg-slate-50 hover:bg-slate-100 py-3.5 border border-slate-200 rounded-xl font-bold text-slate-700 text-sm transition-colors"
            >
              <CalendarDays size={18} />
              <span>حجز الطاولة لموعد قادم</span>
            </button>
            <button className="flex justify-center items-center gap-2 bg-white hover:bg-slate-50 py-3.5 border border-slate-200 rounded-xl font-bold text-slate-500 text-sm transition-colors">
              <Settings2 size={18} />
              <span>إعدادات الطاولة (السعة والمنطقة)</span>
            </button>
          </div>
        )}
      </div>
    )}
  </Modal>
)
