'use client'

/**
 * RevenueChart
 * Dynamic revenue chart using ApexCharts
 */

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import dynamic from 'next/dynamic'
import { Card, CardBody, Skeleton } from '@heroui/react'
import { analyticsService } from '@/services/analytics.service'
import { useTranslations } from 'next-intl'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface RevenueChartProps {
  restaurantId?: string | null
  days?: number
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ restaurantId, days = 30 }) => {
  const t = useTranslations('dashboard')

  const { data, isLoading, error } = useQuery({
    queryKey: ['revenue-data', restaurantId, days],
    queryFn: () => analyticsService.getRevenueData(restaurantId, days),
    refetchInterval: 60000, // Refresh every minute
    refetchOnWindowFocus: false,
    retry: 1, // Only retry once on failure
  })

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardBody>
          <Skeleton className="rounded-lg w-full h-64" />
        </CardBody>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardBody>
          <p className="text-danger">Failed to load chart data</p>
        </CardBody>
      </Card>
    )
  }

  if (!data) return null

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'area',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      categories: data.categories,
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => {
          return value.toLocaleString('ar-SA')
        },
      },
    },
    tooltip: {
      x: {
        format: 'dd MMM',
      },
    },
    colors: ['#0070F0', '#17C964'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
  }

  return (
    <div className="flex flex-col gap-2 h-full">
      <h3 className="font-semibold text-xl">{t('statistics')}</h3>
      <Card className="w-full">
        <CardBody className="p-6">
          <Chart options={options} series={data.series} type="area" height={300} />
        </CardBody>
      </Card>
    </div>
  )
}
