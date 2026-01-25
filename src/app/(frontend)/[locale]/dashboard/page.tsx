'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Spinner } from '@heroui/react'
import { analyticsService, ordersService } from '@/services'
import type { DashboardStats, RevenueData } from '@/services/analytics.service'
import type { Order } from '@/payload-types'

export default function DashboardPage() {
  const t = useTranslations()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null)
  const [recentOrders, setRecentOrders] = useState<Partial<Order>[]>([])

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true)
      try {
        // Load stats and revenue data in parallel
        const [statsData, revenueChartData, ordersData] = await Promise.all([
          analyticsService.getDashboardStats(),
          analyticsService.getRevenueData(undefined, 30),
          ordersService.list({ limit: 10, sort: '-createdAt' }),
        ])

        setStats(statsData)
        setRevenueData(revenueChartData)
        setRecentOrders(ordersData.docs || [])
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  return <div className="mx-auto px-4 py-8 max-w-7xl container"></div>
}
