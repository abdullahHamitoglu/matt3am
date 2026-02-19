'use client'

/**
 * DefaultDashboard
 * Default dashboard for users without a specific position/role
 * Uses new dashboard theme with orange/slate design system
 */

import React from 'react'
import { useTranslations } from 'next-intl'
import { useUserPermissions } from '@/hooks/auth/useUserPermissions'
import NextLink from 'next/link'
import { DashboardPageWrapper, DashboardCard } from '@/components/new-dashboard/foundation'

export const DefaultDashboard: React.FC = () => {
  const t = useTranslations('dashboard')
  const { user } = useUserPermissions()

  return (
    <DashboardPageWrapper className="flex justify-center items-center min-h-[60vh]">
      <div className="mx-auto w-full max-w-2xl">
        <DashboardCard className="shadow-xl">
          <div className="flex flex-col items-center gap-6 p-6 md:p-12 text-center">
            <div className="bg-gradient-to-br from-orange-100 dark:from-orange-900/20 to-amber-100 dark:to-amber-900/20 p-6 rounded-full">
              <svg
                className="w-16 h-16 text-orange-500 dark:text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="font-bold text-slate-800 dark:text-slate-100 text-3xl">
                {t('welcome')}, {user?.firstName || user?.email?.split('@')[0]}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                {t('dashboardNotConfigured') || 'Your dashboard is being configured'}
              </p>
              <p className="text-slate-400 dark:text-slate-500 text-sm">
                {t('contactAdmin') ||
                  'Please contact your administrator to set up your role and permissions'}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <NextLink
                href="/dashboard/profile"
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/25 px-6 py-2.5 rounded-xl font-medium text-white transition-all duration-200"
              >
                {t('viewProfile') || 'View Profile'}
              </NextLink>
              <NextLink
                href="/dashboard/help"
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 px-6 py-2.5 rounded-xl font-medium text-slate-700 dark:text-slate-300 transition-all duration-200"
              >
                {t('getHelp') || 'Get Help'}
              </NextLink>
            </div>
          </div>
        </DashboardCard>
      </div>
    </DashboardPageWrapper>
  )
}
