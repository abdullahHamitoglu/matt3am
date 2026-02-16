'use client'

import React, { useState } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Progress,
  Button,
  Tabs,
  Tab,
} from '@heroui/react'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import { useOrders } from '@/hooks/orders'
import type { Order } from '@/payload-types'

// Dummy chart component - you can replace with actual chart library
const SimpleBarChart = ({ data, title }: { data: number[]; title: string }) => {
  const max = Math.max(...data)
  return (
    <div className="flex flex-col gap-2">
      <p className="font-semibold text-sm">{title}</p>
      <div className="flex items-end gap-1 h-32">
        {data.map((value, idx) => (
          <div
            key={idx}
            className="flex-1 bg-primary hover:bg-primary-600 rounded-t transition-all"
            style={{ height: `${(value / max) * 100}%` }}
            title={`${value}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-default-400 text-tiny">
        <span>Mon</span>
        <span>Sun</span>
      </div>
    </div>
  )
}

export const ReportsContent = () => {
  const t = useTranslations('reportsPage')
  const [selectedPeriod, setSelectedPeriod] = useState('week')
  const { data: ordersData } = useOrders()
  const orders = (ordersData?.docs as Order[]) || []

  // Calculate stats from orders
  const totalRevenue = orders.reduce((sum, order) => sum + (order.pricing?.total || 0), 0)
  const completedOrders = orders.filter((o) => o.status === 'completed').length
  const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0

  const ordersByStatus = {
    pending: orders.filter((o) => o.status === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  }

  const ordersByType = {
    'dine-in': orders.filter((o) => o.orderType === 'dine-in').length,
    takeaway: orders.filter((o) => o.orderType === 'takeaway').length,
    delivery: orders.filter((o) => o.orderType === 'delivery').length,
  }

  // Mock weekly data
  const weeklyOrders = [12, 19, 15, 22, 30, 45, 25]
  const weeklyRevenue = [4500, 7200, 5600, 8100, 11000, 16500, 9200]

  // Top selling items (mock - should come from API)
  const topItems = [
    { name: 'Chicken Biryani', orders: 156, revenue: 3120 },
    { name: 'Grilled Steak', orders: 98, revenue: 4900 },
    { name: 'Caesar Salad', orders: 87, revenue: 1305 },
    { name: 'Fish & Chips', orders: 76, revenue: 2280 },
    { name: 'Pasta Carbonara', orders: 65, revenue: 1625 },
  ]

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center gap-3">
        <h1 className="font-bold text-2xl">{t('title')}</h1>
        <div className="flex items-center gap-2">
          <Select
            size="sm"
            selectedKeys={[selectedPeriod]}
            className="w-36"
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string
              setSelectedPeriod(selected)
            }}
          >
            <SelectItem key="today">{t('today')}</SelectItem>
            <SelectItem key="week">{t('thisWeek')}</SelectItem>
            <SelectItem key="month">{t('thisMonth')}</SelectItem>
            <SelectItem key="year">{t('thisYear')}</SelectItem>
          </Select>
          <Button color="primary" variant="flat" startContent={<Icon icon="solar:download-bold" />}>
            {t('export')}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody className="gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-success-100 p-2 rounded-lg">
                <Icon icon="solar:wallet-money-bold" className="text-success text-xl" />
              </div>
              <span className="text-default-500 text-sm">{t('totalRevenue')}</span>
            </div>
            <p className="font-bold text-2xl">{totalRevenue.toLocaleString()} SAR</p>
            <Chip color="success" size="sm" variant="flat">
              <Icon icon="solar:arrow-up-bold" className="mr-1" />
              +12.5%
            </Chip>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary-100 p-2 rounded-lg">
                <Icon icon="solar:cart-large-2-bold" className="text-primary text-xl" />
              </div>
              <span className="text-default-500 text-sm">{t('totalOrders')}</span>
            </div>
            <p className="font-bold text-2xl">{orders.length}</p>
            <Chip color="primary" size="sm" variant="flat">
              <Icon icon="solar:arrow-up-bold" className="mr-1" />
              +8.3%
            </Chip>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-warning-100 p-2 rounded-lg">
                <Icon icon="solar:bill-list-bold" className="text-warning text-xl" />
              </div>
              <span className="text-default-500 text-sm">{t('avgOrderValue')}</span>
            </div>
            <p className="font-bold text-2xl">{avgOrderValue.toFixed(0)} SAR</p>
            <Chip color="warning" size="sm" variant="flat">
              <Icon icon="solar:arrow-down-bold" className="mr-1" />
              -2.1%
            </Chip>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-secondary-100 p-2 rounded-lg">
                <Icon icon="solar:check-circle-bold" className="text-secondary text-xl" />
              </div>
              <span className="text-default-500 text-sm">{t('completionRate')}</span>
            </div>
            <p className="font-bold text-2xl">
              {orders.length > 0 ? ((completedOrders / orders.length) * 100).toFixed(1) : 0}%
            </p>
            <Chip color="secondary" size="sm" variant="flat">
              <Icon icon="solar:arrow-up-bold" className="mr-1" />
              +5.2%
            </Chip>
          </CardBody>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h3 className="font-semibold">{t('weeklyOrders')}</h3>
          </CardHeader>
          <CardBody>
            <SimpleBarChart data={weeklyOrders} title="" />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">{t('weeklyRevenue')}</h3>
          </CardHeader>
          <CardBody>
            <SimpleBarChart data={weeklyRevenue} title="" />
          </CardBody>
        </Card>
      </div>

      {/* Order Breakdown */}
      <div className="gap-4 grid grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <h3 className="font-semibold">{t('ordersByStatus')}</h3>
          </CardHeader>
          <CardBody className="gap-3">
            {Object.entries(ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm capitalize">{status}</span>
                    <span className="font-medium text-sm">{count}</span>
                  </div>
                  <Progress
                    size="sm"
                    value={orders.length > 0 ? (count / orders.length) * 100 : 0}
                    color={
                      status === 'completed'
                        ? 'success'
                        : status === 'cancelled'
                          ? 'danger'
                          : 'primary'
                    }
                  />
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">{t('ordersByType')}</h3>
          </CardHeader>
          <CardBody>
            <div className="gap-4 grid grid-cols-3">
              <div className="bg-default-50 p-4 rounded-lg text-center">
                <Icon icon="solar:armchair-bold" className="mx-auto mb-2 text-primary text-3xl" />
                <p className="font-bold text-2xl">{ordersByType['dine-in']}</p>
                <p className="text-default-400 text-tiny">{t('dineIn')}</p>
              </div>
              <div className="bg-default-50 p-4 rounded-lg text-center">
                <Icon icon="solar:bag-smile-bold" className="mx-auto mb-2 text-warning text-3xl" />
                <p className="font-bold text-2xl">{ordersByType.takeaway}</p>
                <p className="text-default-400 text-tiny">{t('takeaway')}</p>
              </div>
              <div className="bg-default-50 p-4 rounded-lg text-center">
                <Icon icon="solar:delivery-bold" className="mx-auto mb-2 text-success text-3xl" />
                <p className="font-bold text-2xl">{ordersByType.delivery}</p>
                <p className="text-default-400 text-tiny">{t('delivery')}</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Top Items Table */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">{t('topSellingItems')}</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="Top selling items" removeWrapper>
            <TableHeader>
              <TableColumn>{t('rank')}</TableColumn>
              <TableColumn>{t('item')}</TableColumn>
              <TableColumn>{t('orders')}</TableColumn>
              <TableColumn>{t('revenue')}</TableColumn>
              <TableColumn>{t('trend')}</TableColumn>
            </TableHeader>
            <TableBody>
              {topItems.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Chip
                      size="sm"
                      color={idx === 0 ? 'warning' : idx === 1 ? 'default' : 'default'}
                      variant={idx < 3 ? 'solid' : 'flat'}
                    >
                      #{idx + 1}
                    </Chip>
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.orders}</TableCell>
                  <TableCell>{item.revenue.toLocaleString()} SAR</TableCell>
                  <TableCell>
                    <Chip color="success" size="sm" variant="flat">
                      <Icon icon="solar:arrow-up-bold" className="mr-1" />
                      {(Math.random() * 20).toFixed(1)}%
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  )
}
