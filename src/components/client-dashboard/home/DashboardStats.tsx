'use client'

/**
 * DashboardStats
 * Displays dynamic statistics cards based on user permissions and restaurant
 */

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { StatCard } from './StatCard'
import { Alert, Skeleton } from '@heroui/react'
import { analyticsService } from '@/services/analytics.service'
import { useUserPermissions } from '@/hooks/auth/useUserPermissions'
import { formatCurrency } from '@/lib/currency'

interface DashboardStatsProps {
  restaurantId?: string | null
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ restaurantId }) => {
  const t = useTranslations('dashboard')
  const { hasPermission } = useUserPermissions()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', restaurantId],
    queryFn: () => analyticsService.getDashboardStats(restaurantId),
    staleTime: 60000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60000, // Auto-refresh every minute
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once on failure
    enabled: hasPermission('read', 'reports'),
  })

  if (!hasPermission('read', 'reports')) {
    return (
      <div className="bg-danger-50 p-4 border border-danger-200 rounded-lg">
        <p className="text-danger-700">{t('noPermission')}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="gap-5 grid grid-cols-1 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="rounded-lg w-full h-32" />
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <Alert color="warning" className="w-full">
        {t('statsLoadError')}
      </Alert>
    )
  }

  return (
    <div className="gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <StatCard
        title={t('totalRevenue')}
        value={formatCurrency(stats.totalRevenue)}
        trend={stats.revenueTrend}
        color="success"
        subtitle={t('thisMonth') || 'This month'}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        }
      />
      <StatCard
        title={t('totalOrders')}
        value={stats.totalOrders}
        trend={stats.ordersTrend}
        color="primary"
        subtitle={t('allTime') || 'All time'}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
        }
      />
      <StatCard
        title={t('totalCustomers')}
        value={stats.totalCustomers}
        color="warning"
        subtitle={t('registered') || 'Registered'}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
      />
      <StatCard
        title={t('avgOrderValue') || 'Avg Order'}
        value={formatCurrency(stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0)}
        color="secondary"
        subtitle={t('perOrder') || 'Per order'}
        icon={
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        }
      />
    </div>
  )
}
