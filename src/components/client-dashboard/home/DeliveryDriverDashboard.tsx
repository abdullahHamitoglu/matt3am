'use client'

/**
 * DeliveryDriverDashboard
 * Dashboard for Delivery Driver role
 * Uses new dashboard theme with orange/slate design system
 */

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Chip, Skeleton } from '@heroui/react'
import NextLink from 'next/link'
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
import { useCurrencySelection } from '@/hooks'

export const DeliveryDriverDashboard: React.FC = () => {
  const t = useTranslations('dashboard')
  const { selectedRestaurant } = useRestaurantSelection()
  const { selectedCurrency } = useCurrencySelection()

  // Fetch delivery orders
  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['delivery-orders', selectedRestaurant],
    queryFn: async () => {
      return ordersService.list({
        where: {
          restaurant: { equals: selectedRestaurant },
          orderType: { equals: 'delivery' },
          status: { in: ['ready', 'delivering'] },
        },
        limit: 50,
        sort: 'createdAt',
      })
    },
    refetchInterval: 20000, // Refresh every 20 seconds
    refetchOnWindowFocus: false,
    enabled: !!selectedRestaurant,
  })

  const orders = ordersResponse?.docs || []
  const pendingPickup = orders.filter((o) => o.status === 'ready')
  const outForDelivery = orders.filter((o) => o.status === 'delivering')

  // Calculate today's completed deliveries
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { data: todayDeliveriesResponse } = useQuery({
    queryKey: ['today-deliveries', selectedRestaurant],
    queryFn: async () => {
      return ordersService.list({
        where: {
          restaurant: { equals: selectedRestaurant },
          orderType: { equals: 'delivery' },
          status: { equals: 'completed' },
          createdAt: { greater_than_equal: today.toISOString() },
        },
        limit: 1000,
      })
    },
    refetchOnWindowFocus: false,
    enabled: !!selectedRestaurant,
  })

  const completedToday = todayDeliveriesResponse?.totalDocs || 0

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
          title={t('pendingPickup')}
          value={pendingPickup.length}
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
          title={t('outForDelivery')}
          value={outForDelivery.length}
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

      {/* Delivery Queue */}
      <DashboardSection title={t('deliveryQueue')}>
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
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
                <p className="text-slate-500 dark:text-slate-400">{t('noDeliveries')}</p>
              </div>
            </div>
          </DashboardCard>
        ) : (
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
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

              const deliveryAddress =
                typeof order.deliveryAddress === 'string'
                  ? order.deliveryAddress
                  : order.deliveryAddress
                    ? [
                        order.deliveryAddress.street,
                        order.deliveryAddress.district,
                        order.deliveryAddress.city,
                        order.deliveryAddress.notes,
                      ]
                        .filter(Boolean)
                        .join(', ')
                    : 'Address not provided'

              return (
                <DashboardCard
                  key={order.id}
                  className="hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-slate-800 dark:text-slate-100 text-lg">
                          {customerName}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">
                          {t('order')} #{order.orderNumber || order.id.slice(0, 8)}
                        </p>
                      </div>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={order.status === 'ready' ? 'warning' : 'primary'}
                      >
                        {t(order.status || 'pending')}
                      </Chip>
                    </div>

                    <div className="flex items-start gap-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                      <svg
                        className="flex-shrink-0 mt-0.5 w-5 h-5 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <p className="flex-1 text-slate-700 dark:text-slate-300 text-sm">
                        {deliveryAddress}
                      </p>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-slate-200 dark:border-slate-700 border-t">
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-xl">
                        {formatCurrency(orderTotal, { currency: selectedCurrency })}
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
