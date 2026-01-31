'use client'

/**
 * CashierDashboard
 * Dashboard for Cashier role
 * Shows payment-related information and transactions
 */

import React from 'react'
import { useTranslations } from 'next-intl'
import { useRestaurantSelection } from '@/hooks/restaurants'
import { DashboardStats } from './DashboardStats'
import { RecentOrdersTable } from './RecentOrdersTable'

export const CashierDashboard: React.FC = () => {
  const t = useTranslations('dashboard')
  const { selectedRestaurant } = useRestaurantSelection()

  return (
    <div className="bg-background h-full min-h-screen">
      <div className="mx-auto px-4 lg:px-6 pt-6 sm:pt-10 pb-10 w-full max-w-[90rem]">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-foreground text-3xl">
              {t('cashierDashboard') || 'Cashier Dashboard'}
            </h1>
            <p className="text-default-500 dark:text-default-400">
              {t('cashierDashboardDesc') || 'Manage payments and transactions'}
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-success rounded-full w-1 h-6" />
              <h3 className="font-semibold text-foreground text-xl">{t('overview')}</h3>
            </div>
            <DashboardStats restaurantId={selectedRestaurant} />
          </div>

          {/* Recent Transactions */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-full w-1 h-6" />
              <h3 className="font-semibold text-foreground text-xl">{t('recentTransactions')}</h3>
            </div>
            <RecentOrdersTable restaurantId={selectedRestaurant} limit={20} />
          </div>
        </div>
      </div>
    </div>
  )
}
