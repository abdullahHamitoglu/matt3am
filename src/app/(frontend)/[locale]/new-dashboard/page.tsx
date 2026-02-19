'use client'

import React, { useState } from 'react'
import {
  DashboardView,
  FloorPlanView,
  NewOrderModal,
  ReservationModal,
  OrderDetailsModal,
  TableDetailsModal,
  EditFloorPlanModal,
  NewDashboardLayout,
} from '@/components/new-dashboard'
import type { TabType, ModalType, TableData } from '@/components/new-dashboard/types'

/**
 * MATAAM SYSTEM - FULLY RESPONSIVE & INTEGRATED
 * Now using split component architecture from src/components/new-dashboard
 */

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')

  // Unified Modals State Management
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  // Mock Table Data (Simulating Database)
  const tablesData: TableData[] = [
    {
      id: 'T-01',
      zoneName: 'الحديقة',
      themeColor: 'emerald',
      status: 'payment',
      guests: 4,
      bill: '₺545',
    },
    { id: 'T-02', zoneName: 'الحديقة', themeColor: 'emerald', status: 'free', capacity: 2 },
    {
      id: 'T-03',
      zoneName: 'الحديقة',
      themeColor: 'emerald',
      status: 'ordering',
      guests: 3,
      time: '1h 15m',
      bill: '₺320',
    },
    {
      id: 'T-10',
      zoneName: 'الصالة الداخلية',
      themeColor: 'blue',
      status: 'ordering',
      guests: 6,
      time: '45m',
      bill: '₺850',
    },
    { id: 'T-11', zoneName: 'الصالة الداخلية', themeColor: 'blue', status: 'free', capacity: 4 },
    {
      id: 'T-12',
      zoneName: 'الصالة الداخلية',
      themeColor: 'blue',
      status: 'payment',
      guests: 2,
      bill: '₺210',
    },
    {
      id: 'V-01',
      zoneName: 'تراس VIP',
      themeColor: 'amber',
      status: 'ordering',
      guests: 8,
      time: '15m',
      bill: '₺1,450',
    },
    { id: 'V-02', zoneName: 'تراس VIP', themeColor: 'amber', status: 'free', capacity: 6 },
  ]

  // Handlers
  const handleTableClick = (table: TableData) => {
    setSelectedTable(table)
    setActiveModal('tableDetails')
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenModal={setActiveModal}
            onOpenOrder={(id) => {
              setSelectedOrder(id)
              setActiveModal('orderDetails')
            }}
          />
        )
      case 'floor-plan':
        return (
          <FloorPlanView
            tablesData={tablesData}
            onTableClick={handleTableClick}
            onAddTable={() => setActiveModal('editFloorPlan')}
          />
        )
      case 'menu':
        return (
          <div className="bg-white dark:bg-slate-900 p-10 border border-slate-100 dark:border-slate-800 rounded-3xl font-bold text-slate-400 text-center">
            واجهة المنيو والمخزون قيد التطوير...
          </div>
        )
      case 'kitchen':
        return (
          <div className="bg-white dark:bg-slate-900 p-10 border border-slate-100 dark:border-slate-800 rounded-3xl font-bold text-slate-400 text-center">
            شاشة المطبخ KDS قيد التطوير...
          </div>
        )
      default:
        return (
          <DashboardView
            onOpenModal={setActiveModal}
            onOpenOrder={(id) => {
              setSelectedOrder(id)
              setActiveModal('orderDetails')
            }}
          />
        )
    }
  }

  return (
    <NewDashboardLayout>
      {renderContent()}

      {/* Modals */}
      <NewOrderModal
        isOpen={activeModal === 'newOrder'}
        onClose={() => setActiveModal(null)}
        tablesData={tablesData}
      />
      <ReservationModal
        isOpen={activeModal === 'reservation'}
        onClose={() => setActiveModal(null)}
      />
      <OrderDetailsModal
        isOpen={activeModal === 'orderDetails'}
        onClose={() => setActiveModal(null)}
        orderId={selectedOrder}
      />
      <TableDetailsModal
        isOpen={activeModal === 'tableDetails'}
        onClose={() => setActiveModal(null)}
        selectedTable={selectedTable}
        onOpenModal={setActiveModal}
      />
      <EditFloorPlanModal
        isOpen={activeModal === 'editFloorPlan'}
        onClose={() => setActiveModal(null)}
      />
    </NewDashboardLayout>
  )
}
