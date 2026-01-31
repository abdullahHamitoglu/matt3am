'use client'

/**
 * DefaultDashboard
 * Default dashboard for users without a specific position/role
 */

import React from 'react'
import { useTranslations } from 'next-intl'
import { Card, CardBody, Button } from '@heroui/react'
import { useUserPermissions } from '@/hooks/auth/useUserPermissions'

export const DefaultDashboard: React.FC = () => {
  const t = useTranslations('dashboard')
  const { user } = useUserPermissions()

  return (
    <div className="flex justify-center items-center bg-background h-full min-h-screen">
      <div className="mx-auto px-4 lg:px-6 w-full max-w-2xl">
        <Card className="bg-content1 shadow-xl border-none">
          <CardBody className="gap-6 p-12 text-center">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-primary-100 dark:from-primary-900/20 to-secondary-100 dark:to-secondary-900/20 p-6 rounded-full">
                <svg
                  className="w-16 h-16 text-primary-600 dark:text-primary-400"
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
            </div>

            <div className="flex flex-col gap-3">
              <h2 className="font-bold text-foreground text-3xl">
                {t('welcome')}, {user?.firstName || user?.email?.split('@')[0]}
              </h2>
              <p className="text-default-500 dark:text-default-400 text-lg">
                {t('dashboardNotConfigured') || 'Your dashboard is being configured'}
              </p>
              <p className="text-default-400 dark:text-default-500 text-sm">
                {t('contactAdmin') ||
                  'Please contact your administrator to set up your role and permissions'}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <Button color="primary" variant="shadow" as="a" href="/dashboard/profile">
                {t('viewProfile') || 'View Profile'}
              </Button>
              <Button color="default" variant="flat" as="a" href="/dashboard/help">
                {t('getHelp') || 'Get Help'}
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
