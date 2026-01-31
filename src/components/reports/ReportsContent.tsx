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
import { useOrders } from '@/hooks/orders'
import type { Order } from '@/payload-types'

// Dummy chart component - you can replace with actual chart library
const SimpleBarChart = ({ data, title }: { data: number[]; title: string }) => {
  const max = Math.max(...data)
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-semibold">{title}</p>
      <div className="flex items-end gap-1 h-32">
        {data.map((value, idx) => (
          <div
            key={idx}
            className="flex-1 bg-primary rounded-t transition-all hover:bg-primary-600"
            style={{ height: `${(value / max) * 100}%` }}
            title={`${value}`}
          />
        ))}
      </div>
      <div className="flex justify-between text-tiny text-default-400">
        <span>Mon</span>
        <span>Sun</span>
      </div>
    </div>
  )
}

export const ReportsContent = () => {
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
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between gap-3 items-center">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="flex gap-2 items-center">
          <Select
            size="sm"
            selectedKeys={[selectedPeriod]}
            className="w-36"
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string
              setSelectedPeriod(selected)
            }}
          >
            <SelectItem key="today">Today</SelectItem>
            <SelectItem key="week">This Week</SelectItem>
            <SelectItem key="month">This Month</SelectItem>
            <SelectItem key="year">This Year</SelectItem>
          </Select>
          <Button color="primary" variant="flat" startContent={<Icon icon="solar:download-bold" />}>
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-success-100 rounded-lg">
                <Icon icon="solar:wallet-money-bold" className="text-success text-xl" />
              </div>
              <span className="text-default-500 text-sm">Total Revenue</span>
            </div>
            <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} SAR</p>
            <Chip color="success" size="sm" variant="flat">
              <Icon icon="solar:arrow-up-bold" className="mr-1" />
              +12.5%
            </Chip>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Icon icon="solar:cart-large-2-bold" className="text-primary text-xl" />
              </div>
              <span className="text-default-500 text-sm">Total Orders</span>
            </div>
            <p className="text-2xl font-bold">{orders.length}</p>
            <Chip color="primary" size="sm" variant="flat">
              <Icon icon="solar:arrow-up-bold" className="mr-1" />
              +8.3%
            </Chip>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-warning-100 rounded-lg">
                <Icon icon="solar:bill-list-bold" className="text-warning text-xl" />
              </div>
              <span className="text-default-500 text-sm">Avg Order Value</span>
            </div>
            <p className="text-2xl font-bold">{avgOrderValue.toFixed(0)} SAR</p>
            <Chip color="warning" size="sm" variant="flat">
              <Icon icon="solar:arrow-down-bold" className="mr-1" />
              -2.1%
            </Chip>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <Icon icon="solar:check-circle-bold" className="text-secondary text-xl" />
              </div>
              <span className="text-default-500 text-sm">Completion Rate</span>
            </div>
            <p className="text-2xl font-bold">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Weekly Orders</h3>
          </CardHeader>
          <CardBody>
            <SimpleBarChart data={weeklyOrders} title="" />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-semibold">Weekly Revenue (SAR)</h3>
          </CardHeader>
          <CardBody>
            <SimpleBarChart data={weeklyRevenue} title="" />
          </CardBody>
        </Card>
      </div>

      {/* Order Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Orders by Status</h3>
          </CardHeader>
          <CardBody className="gap-3">
            {Object.entries(ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="capitalize text-sm">{status}</span>
                    <span className="text-sm font-medium">{count}</span>
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
            <h3 className="font-semibold">Orders by Type</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-default-50 rounded-lg">
                <Icon icon="solar:armchair-bold" className="text-3xl text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold">{ordersByType['dine-in']}</p>
                <p className="text-tiny text-default-400">Dine-in</p>
              </div>
              <div className="text-center p-4 bg-default-50 rounded-lg">
                <Icon icon="solar:bag-smile-bold" className="text-3xl text-warning mx-auto mb-2" />
                <p className="text-2xl font-bold">{ordersByType.takeaway}</p>
                <p className="text-tiny text-default-400">Takeaway</p>
              </div>
              <div className="text-center p-4 bg-default-50 rounded-lg">
                <Icon icon="solar:delivery-bold" className="text-3xl text-success mx-auto mb-2" />
                <p className="text-2xl font-bold">{ordersByType.delivery}</p>
                <p className="text-tiny text-default-400">Delivery</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Top Items Table */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Top Selling Items</h3>
        </CardHeader>
        <CardBody>
          <Table aria-label="Top selling items" removeWrapper>
            <TableHeader>
              <TableColumn>RANK</TableColumn>
              <TableColumn>ITEM</TableColumn>
              <TableColumn>ORDERS</TableColumn>
              <TableColumn>REVENUE</TableColumn>
              <TableColumn>TREND</TableColumn>
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
