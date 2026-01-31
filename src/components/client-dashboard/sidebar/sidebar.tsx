import React from 'react'
import { Sidebar } from './sidebar.styles'
import { Avatar, Tooltip } from '@heroui/react'
import { CompaniesDropdown } from './companies-dropdown'
import { HomeIcon } from '../icons/sidebar/home-icon'
import { PaymentsIcon } from '../icons/sidebar/payments-icon'
import { BalanceIcon } from '../icons/sidebar/balance-icon'
import { AccountsIcon } from '../icons/sidebar/accounts-icon'
import { CustomersIcon } from '../icons/sidebar/customers-icon'
import { ProductsIcon } from '../icons/sidebar/products-icon'
import { ReportsIcon } from '../icons/sidebar/reports-icon'
import { DevIcon } from '../icons/sidebar/dev-icon'
import { ViewIcon } from '../icons/sidebar/view-icon'
import { SettingsIcon } from '../icons/sidebar/settings-icon'
import { CollapseItems } from './collapse-items'
import { SidebarItem } from './sidebar-item'
import { SidebarMenu } from './sidebar-menu'
import { FilterIcon } from '../icons/sidebar/filter-icon'
import { useSidebarContext } from '../layout/layout-context'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

export const SidebarWrapper = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { collapsed, setCollapsed } = useSidebarContext()
  const t = useTranslations()
  const menuConfig = [
    {
      title: t('mainMenu'),
      items: [
        {
          title: t('orders'),
          icon: <PaymentsIcon />,
          href: '/dashboard/orders',
        },
        {
          title: t('menus'),
          icon: <ProductsIcon />,
          href: '/dashboard/menu',
        },
        {
          title: t('tables'),
          icon: <AccountsIcon />,
          href: '/dashboard/tables',
        },
        {
          title: t('dashboard.reservations') || 'Reservations',
          icon: <CustomersIcon />,
          href: '/dashboard/reservations',
        },
        {
          title: t('dashboard.inventory') || 'Inventory',
          icon: <BalanceIcon />,
          type: 'collapse',
          items: [
            { name: t('dashboard.inventory') || 'Inventory', href: '/dashboard/inventory' },
            { name: t('dashboard.recipes') || 'Recipes', href: '/dashboard/inventory/recipes' },
            { name: t('categories'), href: '/dashboard/inventory/categories' },
          ],
        },
        {
          title: t('dashboard.loyaltyProgram') || 'Loyalty Program',
          icon: <FilterIcon />,
          href: '/dashboard/loyalty-program',
        },
        {
          title: t('dashboard.reports') || 'Reports',
          icon: <ReportsIcon />,
          href: '/dashboard/reports',
        },
      ],
    },
    {
      title: t('dashboard.general') || 'General',
      items: [
        {
          title: t('customers'),
          icon: <CustomersIcon />,
          href: '/dashboard/customers',
        },
        {
          title: t('dashboard.reviews') || 'Reviews',
          icon: <ViewIcon />,
          href: '/dashboard/reviews',
        },
        {
          title: t('settings.title'),
          icon: <SettingsIcon />,
          href: '/dashboard/settings',
        },
      ],
    },
    {
      title: t('system'),
      items: [
        {
          title: t('users'),
          icon: <DevIcon />,
          href: '/dashboard/users',
        },
      ],
    },
  ]

  return (
    <aside className="top-0 z-[20] sticky h-screen">
      {collapsed ? <div className={Sidebar.Overlay()} onClick={setCollapsed} /> : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title={t('home')}
              icon={<HomeIcon />}
              isActive={pathname === '/dashboard' || pathname === '/'}
              href="/dashboard"
            />

            {menuConfig.map((menu, index) => (
              <SidebarMenu key={index} title={menu.title}>
                {menu.items.map((item, idx) =>
                  item.type === 'collapse' ? (
                    <CollapseItems
                      key={idx}
                      title={item.title}
                      icon={item.icon}
                      items={item.items || []}
                    />
                  ) : (
                    <SidebarItem
                      key={idx}
                      title={item.title}
                      icon={item.icon}
                      isActive={pathname === item.href}
                      href={item.href}
                    />
                  ),
                )}
              </SidebarMenu>
            ))}
          </div>
          <div className={Sidebar.Footer()}>
            <Tooltip content={t('settings.title')} color="primary">
              <div
                className="hover:opacity-80 max-w-fit transition-opacity cursor-pointer"
                onClick={() => router.push('/dashboard/settings')}
              >
                <SettingsIcon />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  )
}
