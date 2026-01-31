'use client'
import React from 'react'
import { useUserPermissions } from '@/hooks/auth/useUserPermissions'
import { AdminDashboard } from './AdminDashboard'
import { ManagerDashboard } from './ManagerDashboard'
import { WaiterDashboard } from './WaiterDashboard'
import { ChefDashboard } from './ChefDashboard'
import { CashierDashboard } from './CashierDashboard'
import { DeliveryDriverDashboard } from './DeliveryDriverDashboard'
import { DefaultDashboard } from './DefaultDashboard'
import { DashboardSkeleton } from './DashboardSkeleton'
import { Card, CardBody, Button } from '@heroui/react'
import { useTranslations } from 'next-intl'

export const Content = () => {
  const { position, isAdmin, isLoading, user } = useUserPermissions()
  const t = useTranslations('dashboard')

  if (isLoading) {
    return <DashboardSkeleton />
  }

  // If no user, show enhanced message
  if (!user) {
    return (
      <div className="flex justify-center items-center h-full min-h-screen">
        <div className="mx-auto px-4 lg:px-0 w-full max-w-md">
          <Card className="bg-content1 shadow-lg border-none">
            <CardBody className="gap-4 p-8 text-center">
              <div className="flex justify-center">
                <div className="bg-warning-100 dark:bg-warning-900/20 p-4 rounded-full">
                  <svg
                    className="w-12 h-12 text-warning-600 dark:text-warning-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold text-foreground text-xl">
                  {t('accessDenied') || 'Access Required'}
                </h3>
                <p className="text-default-500">
                  {t('loginRequired') || 'Please log in to access the dashboard'}
                </p>
              </div>
              <Button color="primary" variant="shadow" className="mt-2" as="a" href="/login">
                {t('loginButton') || 'Log In'}
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    )
  }

  // Admin role gets AdminDashboard
  if (isAdmin) {
    return <AdminDashboard />
  }

  // Role-based dashboard rendering
  switch (position) {
    case 'manager':
      return <ManagerDashboard />
    case 'waiter':
      return <WaiterDashboard />
    case 'chef':
      return <ChefDashboard />
    case 'cashier':
      return <CashierDashboard />
    case 'delivery':
      return <DeliveryDriverDashboard />
    case 'receptionist':
      return <DefaultDashboard />
    default:
      return <DefaultDashboard />
  }
}
