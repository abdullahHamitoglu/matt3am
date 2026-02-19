'use client'

import React, { useState } from 'react'
import { NewDashboardSidebar } from './NewDashboardSidebar'
import { NewDashboardHeader } from './NewDashboardHeader'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

interface NewDashboardLayoutProps {
  children: React.ReactNode
}

export const NewDashboardLayout: React.FC<NewDashboardLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations()

  const getPageTitle = (): string => {
    const path = pathname.replace(`/${locale}/dashboard`, '')

    if (!path || path === '' || path === '/') return `${t('dashboard.welcome') || 'مرحباً'} ☀️`
    if (path.startsWith('/orders')) return t('orders')
    if (path.startsWith('/menus')) return t('menus')
    if (path.startsWith('/tables')) return t('tables')
    if (path.startsWith('/reservations')) return t('dashboard.reservations') || 'Reservations'
    if (path.startsWith('/inventory')) return t('dashboard.inventory') || 'Inventory'
    if (path.startsWith('/restaurants')) return t('restaurants.title') || 'Restaurants'
    if (path.startsWith('/reports')) return t('dashboard.reports') || 'Reports'
    if (path.startsWith('/reviews')) return t('dashboard.reviews') || 'Reviews'
    if (path.startsWith('/loyalty-program')) return t('dashboard.loyaltyProgram') || 'Loyalty'
    if (path.startsWith('/customers')) return t('customers')
    if (path.startsWith('/users')) return t('users')
    if (path.startsWith('/settings')) return t('settings.title')
    if (path.startsWith('/profile')) return t('dashboard.profile') || 'Profile'
    return t('home')
  }

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 h-[100dvh] overflow-hidden font-sans">
      <NewDashboardSidebar
        isMobileMenuOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <main className="flex flex-col flex-1 min-w-0 h-[100dvh]">
        <NewDashboardHeader
          title={getPageTitle()}
          subtitle={t('dashboard.subtitle') || 'إليك نظرة سريعة على ما يحدث في المطعم اليوم'}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <div className="flex-1 p-3 md:p-6 lg:p-8 pt-0 overflow-y-auto scroll-smooth">
          {children}
        </div>
      </main>
    </div>
  )
}
