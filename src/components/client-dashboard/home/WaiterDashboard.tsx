'use client'

/**
 * WaiterDashboard
 * Dashboard layout for Waiter role
 * Uses new dashboard theme with orange/slate design system
 */

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Chip, Skeleton } from '@heroui/react'
import NextLink from 'next/link'
import { useUserPermissions } from '@/hooks/auth/useUserPermissions'
import { useRestaurantSelection } from '@/hooks/restaurants'
import { ordersService } from '@/services/orders.service'
import { StatCard } from './StatCard'
import type { Order } from '@/payload-types'
import { formatCurrency } from '@/lib/currency'
import {
  DashboardPageWrapper,
  DashboardSection,
  DashboardCard,
} from '@/components/new-dashboard/foundation'

const getStatusColor = (status: string) => {
  const statusColors: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
    pending: 'warning',
    confirmed: 'primary',
    preparing: 'primary',
    ready: 'success',
    completed: 'success',
    cancelled: 'danger',
  }
  return statusColors[status] || 'default'
}

export const WaiterDashboard: React.FC = () => {
  const t = useTranslations('dashboard')
  const { user } = useUserPermissions()
  const { selectedRestaurant } = useRestaurantSelection()

  // Fetch orders assigned to this waiter
  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['waiter-orders', user?.id, selectedRestaurant],
    queryFn: async () => {
      const where: any = {
        restaurant: { equals: selectedRestaurant },
        status: { in: ['confirmed', 'preparing', 'ready'] },
      }

      return ordersService.list({
        where,
        limit: 50,
        sort: 'createdAt',
      })
    },
    refetchInterval: 15000, // Refresh every 15 seconds
    enabled: !!user && !!selectedRestaurant,
  })

  const orders = ordersResponse?.docs || []
  const activeOrders = orders.filter((o) => ['confirmed', 'preparing'].includes(o.status || ''))
  const readyOrders = orders.filter((o) => o.status === 'ready')

  // Calculate today's stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: todayOrdersResponse } = useQuery({
    queryKey: ['waiter-today-orders', user?.id, selectedRestaurant],
    queryFn: async () => {
      return ordersService.list({
        where: {
          restaurant: { equals: selectedRestaurant },
          status: { equals: 'completed' },
          createdAt: { greater_than_equal: today.toISOString() },
        },
        limit: 1000,
      })
    },
    enabled: !!user && !!selectedRestaurant,
  })

  const todayCompletedOrders = todayOrdersResponse?.docs || []

  if (isLoading) {
    return (
      <DashboardPageWrapper>
        <div className="bg-white dark:bg-slate-900 shadow-sm p-6 border border-slate-100 dark:border-slate-800 rounded-3xl h-96 animate-pulse" />
      </DashboardPageWrapper>
    )
  }

  return (
    <DashboardPageWrapper>
      {/* Top Stats */}
      <div className="gap-5 grid grid-cols-1 md:grid-cols-3">
        <StatCard
          title={t('myActiveOrders')}
          value={activeOrders.length}
          color="warning"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title={t('readyForPickup')}
          value={readyOrders.length}
          color="success"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title={t('completedToday')}
          value={todayCompletedOrders.length}
          color="primary"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          }
        />
      </div>

      {/* Active Orders List */}
      <DashboardSection
        title={t('activeOrders')}
        action={
          <NextLink
            href="/dashboard/orders"
            className="font-medium text-orange-500 dark:text-orange-400 text-sm hover:underline"
          >
            {t('viewAll')} →
          </NextLink>
        }
      >
        {orders.length === 0 ? (
          <DashboardCard>
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full">
                  <svg
                    className="w-12 h-12 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <p className="text-slate-500 dark:text-slate-400">{t('noActiveOrders')}</p>
              </div>
            </div>
          </DashboardCard>
        ) : (
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order: Order) => {
              const customerName =
                typeof order.customer === 'object' && order.customer
                  ? order.customer.name
                  : t('guest') || 'Guest'

              const orderTotal = order.pricing?.total || 0
              const orderTime = new Date(order.createdAt).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              })

              const tableNumber =
                typeof order.table === 'object' && order.table ? order.table.tableNumber : 'N/A'

              return (
                <DashboardCard
                  key={order.id}
                  className="hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <p className="font-medium text-slate-500 dark:text-slate-400 text-sm">
                          {t('table')} {tableNumber}
                        </p>
                        <p className="font-semibold text-slate-800 dark:text-slate-100 text-lg">
                          {customerName}
                        </p>
                      </div>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={getStatusColor(order.status || 'pending')}
                      >
                        {t(order.status || 'pending')}
                      </Chip>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-slate-200 dark:border-slate-700 border-t">
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-xl">
                        {formatCurrency(orderTotal)}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 text-sm">
                        {orderTime}
                      </span>
                    </div>

                    <NextLink
                      href={`/dashboard/orders/${order.id}`}
                      className="font-medium text-orange-500 dark:text-orange-400 text-sm hover:underline"
                    >
                      {t('viewDetails')} →
                    </NextLink>
                  </div>
                </DashboardCard>
              )
            })}
          </div>
        )}
      </DashboardSection>
    </DashboardPageWrapper>
  )
}
