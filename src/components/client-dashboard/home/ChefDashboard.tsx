'use client'

/**
 * ChefDashboard
 * Kitchen Display System for Chef role
 * Shows orders in queue, preparing, and ready states
 */

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Card, CardBody, CardHeader, Chip, Skeleton } from '@heroui/react'
import { useRestaurantSelection } from '@/hooks/restaurants'
import { ordersService } from '@/services/orders.service'
import { StatCard } from './StatCard'
import type { Order } from '@/payload-types'

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
      <div className="p-4 h-full">
        <div className="mx-auto max-w-[90rem]">
          <Skeleton className="rounded-lg w-full h-96" />
        </div>
      </div>
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
      if (timeElapsed > 30) return 'text-danger-600 dark:text-danger-400'
      if (timeElapsed > 15) return 'text-warning-600 dark:text-warning-400'
      return 'text-success-600 dark:text-success-400'
    }

    return (
      <Card className="bg-content1 shadow-md hover:shadow-xl mb-3 border-none transition-all duration-300">
        <CardHeader className="flex justify-between pb-2">
          <div className="flex flex-col gap-1">
            <p className="font-medium text-default-500 dark:text-default-400 text-sm">
              {t('table')} {tableNumber}
            </p>
            <p className="font-semibold text-foreground text-lg">
              {t('order')} #{order.orderNumber || order.id.slice(0, 8)}
            </p>
          </div>
          <div className="flex flex-col gap-1 text-right">
            <p className="text-default-500 dark:text-default-400 text-sm">{orderTime}</p>
            <Chip size="sm" variant="flat" className={getPriorityColor()}>
              {timeElapsed} min
            </Chip>
          </div>
        </CardHeader>
        <CardBody className="pt-2">
          <div className="flex flex-col gap-2">
            {order.items?.map((item, idx) => {
              const menuItem =
                typeof item.menuItem === 'object' && item.menuItem ? item.menuItem.name : 'Unknown'
              return (
                <div
                  key={idx}
                  className="flex justify-between items-start pb-2 last:pb-0 border-default-200 dark:border-default-700 last:border-0 border-b text-sm"
                >
                  <span className="font-medium text-foreground">
                    <span className="font-bold text-primary">{item.quantity}x</span> {menuItem}
                  </span>
                  {item.specialInstructions && (
                    <span className="max-w-[50%] text-warning-600 dark:text-warning-400 text-xs text-right italic">
                      {item.specialInstructions}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </CardBody>
      </Card>
    )
  }

  return (
    <div className="bg-background h-full min-h-screen">
      <div className="mx-auto px-4 lg:px-6 pt-6 sm:pt-10 pb-10 w-full max-w-[90rem]">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="font-bold text-foreground text-3xl">
            {t('chefDashboard') || 'Kitchen Display System'}
          </h1>
          <p className="text-default-500 dark:text-default-400">
            {t('chefDashboardDesc') || 'Manage orders in kitchen workflow'}
          </p>
        </div>

        {/* Top Stats */}
        <div className="gap-5 grid grid-cols-1 md:grid-cols-3 mb-8">
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
            <div className="flex items-center gap-2 bg-warning-50 dark:bg-warning-900/10 p-3 border-2 border-warning-200 dark:border-warning-800 rounded-lg">
              <svg
                className="w-5 h-5 text-warning-600 dark:text-warning-400"
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
              <h3 className="font-semibold text-foreground text-lg">{t('pending')}</h3>
              <Chip size="sm" color="warning" variant="flat" className="ml-auto">
                {pendingOrders.length}
              </Chip>
            </div>
            <div className="flex flex-col gap-3">
              {pendingOrders.length === 0 ? (
                <Card className="bg-content1 border-none">
                  <CardBody className="p-8 text-center">
                    <p className="text-default-400 dark:text-default-500 text-sm">
                      {t('noOrders')}
                    </p>
                  </CardBody>
                </Card>
              ) : (
                pendingOrders.map((order) => <OrderCard key={order.id} order={order} />)
              )}
            </div>
          </div>

          {/* Preparing Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 bg-primary-50 dark:bg-primary-900/10 p-3 border-2 border-primary-200 dark:border-primary-800 rounded-lg">
              <svg
                className="w-5 h-5 text-primary-600 dark:text-primary-400"
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
              <h3 className="font-semibold text-foreground text-lg">{t('preparing')}</h3>
              <Chip size="sm" color="primary" variant="flat" className="ml-auto">
                {preparingOrders.length}
              </Chip>
            </div>
            <div className="flex flex-col gap-3">
              {preparingOrders.length === 0 ? (
                <Card className="bg-content1 border-none">
                  <CardBody className="p-8 text-center">
                    <p className="text-default-400 dark:text-default-500 text-sm">
                      {t('noOrders')}
                    </p>
                  </CardBody>
                </Card>
              ) : (
                preparingOrders.map((order) => <OrderCard key={order.id} order={order} />)
              )}
            </div>
          </div>

          {/* Ready Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 bg-success-50 dark:bg-success-900/10 p-3 border-2 border-success-200 dark:border-success-800 rounded-lg">
              <svg
                className="w-5 h-5 text-success-600 dark:text-success-400"
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
              <h3 className="font-semibold text-foreground text-lg">{t('ready')}</h3>
              <Chip size="sm" color="success" variant="flat" className="ml-auto">
                {readyOrders.length}
              </Chip>
            </div>
            <div className="flex flex-col gap-3">
              {readyOrders.length === 0 ? (
                <Card className="bg-content1 border-none">
                  <CardBody className="p-8 text-center">
                    <p className="text-default-400 dark:text-default-500 text-sm">
                      {t('noOrders')}
                    </p>
                  </CardBody>
                </Card>
              ) : (
                readyOrders.map((order) => <OrderCard key={order.id} order={order} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
