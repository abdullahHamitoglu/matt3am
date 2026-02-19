'use client'

import React from 'react'
import {
  LayoutGrid,
  Map,
  UtensilsCrossed,
  ClipboardList,
  ChefHat,
  Settings,
  User,
  LogOut,
  X,
} from 'lucide-react'
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher'
import { SidebarItem } from '../foundation/SidebarItem'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { useLogout } from '@/hooks/auth/useLogout'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface SidebarNavItem {
  icon: LucideIcon
  label: string
  href: string
}

interface NewDashboardSidebarProps {
  isMobileMenuOpen: boolean
  onClose: () => void
}

export const NewDashboardSidebar: React.FC<NewDashboardSidebarProps> = ({
  isMobileMenuOpen,
  onClose,
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()
  const { mutate: logout } = useLogout()

  const withLocale = (path: string) => `/${locale}${path}`

  const mainMenuItems: SidebarNavItem[] = [
    { icon: LayoutGrid, label: t('home'), href: withLocale('/dashboard') },
    { icon: Map, label: t('tables'), href: withLocale('/dashboard/tables') },
    { icon: UtensilsCrossed, label: t('menus'), href: withLocale('/dashboard/menus') },
    { icon: ClipboardList, label: t('orders'), href: withLocale('/dashboard/orders') },
    {
      icon: ChefHat,
      label: t('dashboard.inventory') || 'Inventory',
      href: withLocale('/dashboard/inventory'),
    },
  ]

  const systemMenuItems: SidebarNavItem[] = [
    { icon: User, label: t('users'), href: withLocale('/dashboard/users') },
    { icon: Settings, label: t('settings.title'), href: withLocale('/dashboard/settings') },
  ]

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push(`/${locale}/login`)
      },
    })
  }

  const navigateTo = (href: string) => {
    router.push(href)
    onClose()
  }

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="lg:hidden z-40 fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 end-0 z-50 w-72 bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 transform lg:relative lg:translate-x-0 lg:shadow-sm lg:m-4 lg:rounded-3xl lg:border lg:border-slate-100 dark:lg:border-slate-800 flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-6 md:p-8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-orange-500 shadow-lg shadow-orange-200/10 dark:shadow-orange-600/20 rounded-xl w-10 h-10 font-bold text-white text-xl">
              M
            </div>
            <div>
              <h1 className="font-bold text-slate-800 dark:text-slate-100 text-xl">Mataam</h1>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 tracking-wider">
                RESTAURANT OS
              </p>
            </div>
          </div>
          <button
            className="lg:hidden hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-full text-slate-400 dark:text-slate-500"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-4 pb-4 overflow-y-auto scrollbar-hide">
          <nav className="space-y-1.5">
            <p className="mt-2 mb-2 px-4 font-bold text-[10px] text-slate-400 dark:text-slate-500 text-start uppercase">
              {t('mainMenu')}
            </p>
            {mainMenuItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                active={pathname === item.href}
                onClick={() => navigateTo(item.href)}
              />
            ))}

            <div className="mt-4 pt-4 border-slate-100 dark:border-slate-800 border-t">
              <p className="mb-2 px-4 font-bold text-[10px] text-slate-400 dark:text-slate-500 text-start uppercase">
                {t('system')}
              </p>
              {systemMenuItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={pathname === item.href}
                  onClick={() => navigateTo(item.href)}
                />
              ))}
            </div>
          </nav>
        </div>

        <div className="mt-auto p-4 border-slate-50 dark:border-slate-800 border-t shrink-0">
          <div className="group flex justify-between items-center bg-slate-50 hover:bg-orange-50 dark:bg-slate-800 dark:hover:bg-orange-900/20 p-3 rounded-2xl transition-colors cursor-pointer">
            <Link href={'/dashboard/profile'} className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-orange-500 shadow-sm rounded-full w-9 h-9 font-bold text-white text-sm">
                <User size={18} />
              </div>
              <div className="start">
                <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  {t('dashboard.profile') || 'Profile'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">{t('system')}</p>
              </div>
            </Link>
            <div className="flex justify-center">
              <ThemeSwitcher />
            </div>
            <button onClick={handleLogout}>
              <LogOut
                size={16}
                className="text-slate-400 dark:group-hover:text-orange-400 dark:text-slate-500 group-hover:text-orange-500"
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
