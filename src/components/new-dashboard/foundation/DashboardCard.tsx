'use client'

import React from 'react'

interface DashboardCardProps {
  children: React.ReactNode
  className?: string
}

/**
 * Themed card wrapper matching the new dashboard design system.
 * Use this to wrap HeroUI or other content in pages within the new dashboard layout.
 */
export const DashboardCard: React.FC<DashboardCardProps> = ({ children, className = '' }) => (
  <div
    className={`bg-white dark:bg-slate-900 shadow-sm dark:shadow-slate-900/50 p-5 md:p-6 border border-slate-100 dark:border-slate-800 rounded-3xl ${className}`}
  >
    {children}
  </div>
)

interface DashboardSectionProps {
  title: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
}

/**
 * Section wrapper with title bar matching the new dashboard theme.
 */
export const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  action,
  children,
  className = '',
}) => (
  <div className={`flex flex-col gap-4 ${className}`}>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="bg-orange-500 rounded-full w-1 h-6" />
        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg md:text-xl">{title}</h3>
      </div>
      {action}
    </div>
    {children}
  </div>
)

interface DashboardPageWrapperProps {
  children: React.ReactNode
  className?: string
}

/**
 * Full-page wrapper for dashboard content pages.
 * Adds consistent spacing and animation matching the new theme.
 */
export const DashboardPageWrapper: React.FC<DashboardPageWrapperProps> = ({
  children,
  className = '',
}) => <div className={`space-y-6 animate-in duration-500 fade-in ${className}`}>{children}</div>
