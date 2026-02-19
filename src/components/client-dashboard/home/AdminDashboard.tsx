'use client'

/**
 * AdminDashboard
 * Dashboard layout for Administrator role
 * Uses new dashboard theme with orange/slate design system
 */

import React from 'react'
import { useTranslations } from 'next-intl'
import { useRestaurantSelection } from '@/hooks/restaurants'
import { DashboardStats } from './DashboardStats'
import { RevenueChart } from './RevenueChart'
import { RecentOrdersTable } from './RecentOrdersTable'
import NextLink from 'next/link'
import {
  DashboardPageWrapper,
  DashboardSection,
  DashboardCard,
} from '@/components/new-dashboard/foundation'

export const AdminDashboard: React.FC = () => {
  const t = useTranslations('dashboard')
  const { selectedRestaurant } = useRestaurantSelection()

  return (
    <DashboardPageWrapper>
      {/* Stats Cards */}
      <DashboardSection title={t('overview')}>
        <DashboardStats restaurantId={selectedRestaurant} />
      </DashboardSection>

      {/* Revenue Chart */}
      <DashboardSection title={t('revenueOverview') || 'Revenue Overview'}>
        <DashboardCard>
          <RevenueChart restaurantId={selectedRestaurant} days={30} />
        </DashboardCard>
      </DashboardSection>

      {/* Recent Orders Table */}
      <DashboardSection
        title={t('recentOrders')}
        action={
          <NextLink
            href="/dashboard/orders"
            className="font-medium text-orange-500 dark:text-orange-400 text-sm hover:underline"
          >
            {t('viewAll')} →
          </NextLink>
        }
      >
        <DashboardCard>
          <RecentOrdersTable restaurantId={selectedRestaurant} limit={20} />
        </DashboardCard>
      </DashboardSection>
    </DashboardPageWrapper>
  )
}
