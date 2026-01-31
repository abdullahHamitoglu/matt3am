'use client'

/**
 * DeliveryDriverDashboard
 * Dashboard for Delivery Driver role
 * Shows active deliveries and delivery queue
 */

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { Card, CardBody, Chip, Link, Skeleton } from '@heroui/react'
import NextLink from 'next/link'
import { useRestaurantSelection } from '@/hooks/restaurants'
import { ordersService } from '@/services/orders.service'
import { StatCard } from './StatCard'
import type { Order } from '@/payload-types'
import { formatCurrency } from '@/lib/currency'

export const DeliveryDriverDashboard: React.FC = () => {
  const t = useTranslations('dashboard')
  const { selectedRestaurant } = useRestaurantSelection()

  // Fetch delivery orders
  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['delivery-orders', selectedRestaurant],
    queryFn: async () => {
      return ordersService.list({
        where: {
          restaurant: { equals: selectedRestaurant },
          orderType: { equals: 'delivery' },
          status: { in: ['ready', 'out-for-delivery'] },
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
      <div className="p-4 h-full">
        <div className="mx-auto max-w-[90rem]">
          <Skeleton className="rounded-lg w-full h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background h-full min-h-screen">
      <div className="mx-auto px-4 lg:px-6 pt-6 sm:pt-10 pb-10 w-full max-w-[90rem]">
        {/* Header */}
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="font-bold text-foreground text-3xl">
            {t('deliveryDashboard') || 'Delivery Dashboard'}
          </h1>
          <p className="text-default-500 dark:text-default-400">
            {t('deliveryDashboardDesc') || 'Manage deliveries and routes'}
          </p>
        </div>

        {/* Top Stats */}
        <div className="gap-5 grid grid-cols-1 md:grid-cols-3 mb-8">
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
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-full w-1 h-6" />
            <h3 className="font-semibold text-foreground text-xl">{t('deliveryQueue')}</h3>
          </div>

          {orders.length === 0 ? (
            <Card className="bg-content1 shadow-md border-none">
              <CardBody className="p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-default-100 dark:bg-default-900/20 p-4 rounded-full">
                    <svg
                      className="w-12 h-12 text-default-400"
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
                  <p className="text-default-500 dark:text-default-400">{t('noDeliveries')}</p>
                </div>
              </CardBody>
            </Card>
          ) : (
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              {orders.map((order: Order) => {
                const customerName =
                  typeof order.customer === 'object' && order.customer
                    ? `${order.customer?.name} ${order.customer.name}`
                    : 'Guest'

                const orderTotal = order.pricing?.total || 0
                const orderTime = new Date(order.createdAt).toLocaleTimeString('ar-SA', {
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
                  <Card
                    key={order.id}
                    className="bg-content1 hover:shadow-xl border-none transition-all duration-300"
                  >
                    <CardBody className="gap-4 p-5">
                      <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-1">
                          <p className="font-semibold text-foreground text-lg">{customerName}</p>
                          <p className="text-default-500 dark:text-default-400 text-sm">
                            {t('order')} #{order.orderNumber || order.id.slice(0, 8)}
                          </p>
                        </div>
                        <Chip
                          size="sm"
                          variant="flat"
                          color={order.status === 'ready' ? 'warning' : 'primary'}
                        >
                          {order.status}
                        </Chip>
                      </div>

                      <div className="flex items-start gap-2 bg-default-100 dark:bg-default-900/20 p-3 rounded-lg">
                        <svg
                          className="flex-shrink-0 mt-0.5 w-5 h-5 text-primary"
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
                        <p className="flex-1 text-foreground text-sm">{deliveryAddress}</p>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-default-200 dark:border-default-700 border-t">
                        <span className="font-bold text-foreground text-xl">
                          {formatCurrency(orderTotal, { locale: 'ar-SA', currency: 'USD' })}
                        </span>
                        <span className="text-default-400 dark:text-default-500 text-sm">
                          {orderTime}
                        </span>
                      </div>

                      <Link
                        href={`/dashboard/orders/${order.id}`}
                        as={NextLink}
                        color="primary"
                        className="font-medium text-sm"
                      >
                        {t('viewDetails')} →
                      </Link>
                    </CardBody>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
