'use client'

/**
 * CashierDashboard
 * Dashboard for Cashier role
 * Uses new dashboard theme with orange/slate design system
 */

import React from 'react'
import { useTranslations } from 'next-intl'
import { useRestaurantSelection } from '@/hooks/restaurants'
import { DashboardStats } from './DashboardStats'
import { RecentOrdersTable } from './RecentOrdersTable'
import {
  DashboardPageWrapper,
  DashboardSection,
  DashboardCard,
} from '@/components/new-dashboard/foundation'

export const CashierDashboard: React.FC = () => {
  const t = useTranslations('dashboard')
  const { selectedRestaurant } = useRestaurantSelection()

  return (
    <DashboardPageWrapper>
      {/* Stats */}
      <DashboardSection title={t('overview')}>
        <DashboardStats restaurantId={selectedRestaurant} />
      </DashboardSection>

      {/* Recent Transactions */}
      <DashboardSection title={t('recentTransactions')}>
        <DashboardCard>
          <RecentOrdersTable restaurantId={selectedRestaurant} limit={20} />
        </DashboardCard>
      </DashboardSection>
    </DashboardPageWrapper>
  )
}
