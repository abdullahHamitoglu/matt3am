'use client'

/**
 * RecentOrdersTable
 * Displays recent orders for admins and managers
 */

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Link,
  Skeleton,
} from '@heroui/react'
import NextLink from 'next/link'
import { ordersService } from '@/services/orders.service'
import { formatCurrency } from '@/lib/currency'
import type { Order } from '@/payload-types'

interface RecentOrdersTableProps {
  restaurantId?: string | null
  limit?: number
}

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

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({
  restaurantId,
  limit = 15,
}) => {
  const t = useTranslations('dashboard')

  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ['recent-orders', restaurantId, limit],
    queryFn: async () => {
      const where: any = {}
      if (restaurantId) {
        where.restaurant = { equals: restaurantId }
      }

      return ordersService.getAll({
        where,
        limit,
        sort: '-createdAt',
      })
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once on failure
  })

  const orders = ordersResponse?.docs || []

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="rounded-lg w-full h-12" />
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="bg-default-100 p-8 rounded-lg text-center">
        <p className="text-default-500">{t('noOrders')}</p>
      </div>
    )
  }

  return (
    <Table aria-label="Recent orders table">
      <TableHeader>
        <TableColumn>ORDER #</TableColumn>
        <TableColumn>CUSTOMER</TableColumn>
        <TableColumn>TYPE</TableColumn>
        <TableColumn>STATUS</TableColumn>
        <TableColumn>TOTAL</TableColumn>
        <TableColumn>DATE</TableColumn>
      </TableHeader>
      <TableBody>
        {orders.map((order: Order) => {
          const customerName =
            typeof order.customer === 'object' && order.customer
              ? `${order.customer.firstName} ${order.customer.lastName}`
              : 'Guest'

          const orderTotal = order.pricing?.total || 0
          const orderDate = new Date(order.createdAt).toLocaleDateString('ar-SA', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })

          return (
            <TableRow key={order.id}>
              <TableCell>
                <Link
                  as={NextLink}
                  href={`/dashboard/orders/${order.id}`}
                  className="font-medium"
                  color="primary"
                >
                  #{order.orderNumber || order.id.slice(0, 8)}
                </Link>
              </TableCell>
              <TableCell>{customerName}</TableCell>
              <TableCell className="capitalize">{order.orderType || 'dine-in'}</TableCell>
              <TableCell>
                <Chip size="sm" color={getStatusColor(order.status || 'pending')}>
                  {order.status || 'pending'}
                </Chip>
              </TableCell>
              <TableCell>{formatCurrency(orderTotal, { locale: 'ar-SA' })}</TableCell>
              <TableCell className="text-default-500 text-sm">{orderDate}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
