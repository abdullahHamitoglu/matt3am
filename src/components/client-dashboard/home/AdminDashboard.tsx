'use client'

/**
 * AdminDashboard
 * Dashboard layout for Administrator role
 * Shows stats for all restaurants and system-wide metrics
 */

import React from 'react'
import { useTranslations } from 'next-intl'
import { useRestaurantSelection } from '@/hooks/restaurants'
import { DashboardStats } from './DashboardStats'
import { RevenueChart } from './RevenueChart'
import { RecentOrdersTable } from './RecentOrdersTable'
import { Link } from '@heroui/react'
import NextLink from 'next/link'

export const AdminDashboard: React.FC = () => {
  const t = useTranslations('dashboard')
  const { selectedRestaurant } = useRestaurantSelection()

  return (
    <div className="bg-background h-full min-h-screen">
      <div className="flex flex-wrap xl:flex-nowrap justify-center gap-4 xl:gap-6 mx-auto px-4 lg:px-6 pt-6 sm:pt-10 pb-10 w-full max-w-[90rem]">
        <div className="flex flex-col gap-8 w-full">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-foreground text-3xl">
              {t('adminDashboard') || 'Admin Dashboard'}
            </h1>
            <p className="text-default-500 dark:text-default-400">
              {t('adminDashboardDesc') || 'Overview of all restaurants and system metrics'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-full w-1 h-6" />
              <h3 className="font-semibold text-foreground text-xl">{t('overview')}</h3>
            </div>
            <DashboardStats restaurantId={selectedRestaurant} />
          </div>

          {/* Revenue Chart */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-success rounded-full w-1 h-6" />
              <h3 className="font-semibold text-foreground text-xl">
                {t('revenueOverview') || 'Revenue Overview'}
              </h3>
            </div>
            <RevenueChart restaurantId={selectedRestaurant} days={30} />
          </div>

          {/* Recent Orders Table */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="bg-warning rounded-full w-1 h-6" />
                <h3 className="font-semibold text-foreground text-xl">{t('recentOrders')}</h3>
              </div>
              <Link
                href="/dashboard/orders"
                as={NextLink}
                color="primary"
                className="font-medium hover:underline cursor-pointer"
              >
                {t('viewAll')} →
              </Link>
            </div>
            <RecentOrdersTable restaurantId={selectedRestaurant} limit={20} />
          </div>
        </div>
      </div>
    </div>
  )
}
