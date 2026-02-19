'use client'

/**
 * ChefDashboard
 * Kitchen Display System for Chef role
 * Uses new dashboard theme with orange/slate design system
 */

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Chip, Skeleton } from '@heroui/react'
import { useRestaurantSelection } from '@/hooks/restaurants'
import { ordersService } from '@/services/orders.service'
import { StatCard } from './StatCard'
import type { Order } from '@/payload-types'
import {
  DashboardPageWrapper,
  DashboardSection,
  DashboardCard,
} from '@/components/new-dashboard/foundation'

export const ChefDashboard: React.FC = () => {
  const t = useTranslations('dashboard')
  const { selectedRestaurant } = useRestaurantSelection()

  // Fetch kitchen orders
  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['kitchen-orders', selectedRestaurant],
    queryFn: async () => {
      return ordersService.list({
        where: {
          restaurant: { equals: selectedRestaurant },
          status: { in: ['confirmed', 'preparing', 'ready'] },
        },
        limit: 100,
        sort: 'createdAt',
      })
    },
    refetchInterval: 10000, // Auto-refresh every 10 seconds
    refetchOnWindowFocus: false,
    enabled: !!selectedRestaurant,
  })

  const orders = ordersResponse?.docs || []
  const pendingOrders = orders.filter((o) => o.status === 'confirmed')
  const preparingOrders = orders.filter((o) => o.status === 'preparing')
  const readyOrders = orders.filter((o) => o.status === 'ready')

  // Calculate today's completed orders
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: todayOrdersResponse } = useQuery({
    queryKey: ['chef-today-orders', selectedRestaurant],
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
    refetchOnWindowFocus: false,
    enabled: !!selectedRestaurant,
  })

  const completedToday = todayOrdersResponse?.totalDocs || 0

  if (isLoading) {
    return (
      <DashboardPageWrapper>
        <div className="bg-white dark:bg-slate-900 shadow-sm p-6 border border-slate-100 dark:border-slate-800 rounded-3xl h-96 animate-pulse" />
      </DashboardPageWrapper>
    )
  }

  const OrderCard = ({ order }: { order: Order }) => {
    const tableNumber =
      typeof order.table === 'object' && order.table ? order.table.tableNumber : 'N/A'
    const orderTime = new Date(order.createdAt).toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit',
    })
    const timeElapsed = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)

    const getPriorityColor = () => {
      if (timeElapsed > 30) return 'text-red-600 dark:text-red-400'
      if (timeElapsed > 15) return 'text-amber-600 dark:text-amber-400'
      return 'text-emerald-600 dark:text-emerald-400'
    }

    return (
      <DashboardCard className="hover:shadow-md mb-3 transition-all duration-300">
        <div className="flex justify-between pb-2">
          <div className="flex flex-col gap-1">
            <p className="font-medium text-slate-500 dark:text-slate-400 text-sm">
              {t('table')} {tableNumber}
            </p>
            <p className="font-semibold text-slate-800 dark:text-slate-100 text-lg">
              {t('order')} #{order.orderNumber || order.id.slice(0, 8)}
            </p>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <p className="text-slate-500 dark:text-slate-400 text-sm">{orderTime}</p>
            <Chip size="sm" variant="flat" className={getPriorityColor()}>
              {timeElapsed} min
            </Chip>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          {order.items?.map((item, idx) => {
            const menuItem =
              typeof item.menuItem === 'object' && item.menuItem ? item.menuItem.name : 'Unknown'
            return (
              <div
                key={idx}
                className="flex justify-between items-start pb-2 last:pb-0 border-slate-200 dark:border-slate-700 last:border-0 border-b text-sm"
              >
                <span className="font-medium text-slate-800 dark:text-slate-100">
                  <span className="font-bold text-orange-500">{item.quantity}x</span> {menuItem}
                </span>
                {item.specialInstructions && (
                  <span className="max-w-[50%] text-amber-600 dark:text-amber-400 text-xs text-right italic">
                    {item.specialInstructions}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </DashboardCard>
    )
  }

  return (
    <DashboardPageWrapper>
      {/* Top Stats */}
      <div className="gap-5 grid grid-cols-1 md:grid-cols-3">
        <StatCard
          title={t('ordersInQueue')}
          value={pendingOrders.length}
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
          title={t('preparing')}
          value={preparingOrders.length}
          color="primary"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          }
        />
        <StatCard
          title={t('completedToday')}
          value={completedToday}
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
      </div>

      {/* Kitchen Display - Kanban Style */}
      <div className="gap-4 grid grid-cols-1 lg:grid-cols-3">
        {/* Pending Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/10 p-3 border-2 border-amber-200 dark:border-amber-800 rounded-2xl">
            <svg
              className="w-5 h-5 text-amber-600 dark:text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">
              {t('pending')}
            </h3>
            <Chip size="sm" color="warning" variant="flat" className="ml-auto">
              {pendingOrders.length}
            </Chip>
          </div>
          <div className="flex flex-col gap-3">
            {pendingOrders.length === 0 ? (
              <DashboardCard>
                <p className="p-8 text-slate-400 dark:text-slate-500 text-sm text-center">
                  {t('noOrders')}
                </p>
              </DashboardCard>
            ) : (
              pendingOrders.map((order) => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        </div>

        {/* Preparing Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-900/10 p-3 border-2 border-orange-200 dark:border-orange-800 rounded-2xl">
            <svg
              className="w-5 h-5 text-orange-600 dark:text-orange-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">
              {t('preparing')}
            </h3>
            <Chip size="sm" color="primary" variant="flat" className="ml-auto">
              {preparingOrders.length}
            </Chip>
          </div>
          <div className="flex flex-col gap-3">
            {preparingOrders.length === 0 ? (
              <DashboardCard>
                <p className="p-8 text-slate-400 dark:text-slate-500 text-sm text-center">
                  {t('noOrders')}
                </p>
              </DashboardCard>
            ) : (
              preparingOrders.map((order) => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        </div>

        {/* Ready Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/10 p-3 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl">
            <svg
              className="w-5 h-5 text-emerald-600 dark:text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-lg">
              {t('ready')}
            </h3>
            <Chip size="sm" color="success" variant="flat" className="ml-auto">
              {readyOrders.length}
            </Chip>
          </div>
          <div className="flex flex-col gap-3">
            {readyOrders.length === 0 ? (
              <DashboardCard>
                <p className="p-8 text-slate-400 dark:text-slate-500 text-sm text-center">
                  {t('noOrders')}
                </p>
              </DashboardCard>
            ) : (
              readyOrders.map((order) => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        </div>
      </div>
    </DashboardPageWrapper>
  )
}
