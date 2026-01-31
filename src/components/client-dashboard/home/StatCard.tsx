'use client'

/**
 * StatCard
 * Reusable card component for displaying statistics with trend indicators
 * Enhanced with dark mode support and animations
 */

import React from 'react'
import { Card, CardBody, Chip } from '@heroui/react'
import { motion } from 'framer-motion'

interface TrendData {
  value: number
  isPositive: boolean
}

interface StatCardProps {
  title: string
  value: string | number
  trend?: TrendData
  icon?: React.ReactNode
  subtitle?: string
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary' | 'default'
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  icon,
  subtitle,
  color = 'default',
}) => {
  const iconColorClasses = {
    primary: 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400',
    success: 'bg-success-100 dark:bg-success-900/20 text-success-600 dark:text-success-400',
    warning: 'bg-warning-100 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400',
    danger: 'bg-danger-100 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400',
    secondary:
      'bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400',
    default: 'bg-default-100 dark:bg-default-900/20 text-default-600 dark:text-default-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="w-full"
    >
      <Card className="bg-content1 shadow-md hover:shadow-xl border-none w-full transition-shadow duration-300">
        <CardBody className="gap-3 p-5">
          <div className="flex justify-between items-start">
            <div className="flex flex-col flex-1 gap-1">
              <span className="font-medium text-default-500 dark:text-default-400 text-sm uppercase tracking-wide">
                {title}
              </span>
              <h3 className="font-bold text-foreground text-3xl">{value}</h3>
            </div>
            {icon && (
              <div
                className={`p-3 rounded-xl ${iconColorClasses[color]} transition-all duration-200`}
              >
                {icon}
              </div>
            )}
          </div>

          <div className="flex justify-between items-center gap-2 mt-1">
            {trend && (
              <Chip
                size="sm"
                variant="flat"
                color={trend.isPositive ? 'success' : 'danger'}
                startContent={<span className="text-base">{trend.isPositive ? '↑' : '↓'}</span>}
                className="font-semibold"
              >
                {Math.abs(trend.value).toFixed(1)}%
              </Chip>
            )}
            {subtitle && (
              <span className="flex-1 text-default-400 dark:text-default-500 text-xs text-right">
                {subtitle}
              </span>
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  )
}
