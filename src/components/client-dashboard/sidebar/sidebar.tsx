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
import { useTranslations, useLocale } from 'next-intl'
import { MedicalIconRestaurant } from '@/components/icons/MedicalIconRestaurant'
import { IoLogOutSharp } from 'react-icons/io5'
import { useLogout } from '@/hooks/auth/useLogout'

export const SidebarWrapper = () => {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  const { collapsed, setCollapsed } = useSidebarContext()
  const t = useTranslations()
  const { mutate: logout } = useLogout()

  const withLocale = (path: string) => `/${locale}${path}`

  const menuConfig = [
    {
      title: t('mainMenu'),
      items: [
        {
          title: t('restaurants.title') || 'Restaurants',
          icon: <MedicalIconRestaurant className="text-default-400" />,
          href: withLocale('/dashboard/restaurants'),
        },
        {
          title: t('orders'),
          icon: <PaymentsIcon />,
          href: withLocale('/dashboard/orders'),
        },
        {
          title: t('menus'),
          icon: <ProductsIcon />,
          type: 'collapse',
          items: [
            { name: t('menus'), href: withLocale('/dashboard/menus') },
            { name: t('menuCategories'), href: withLocale('/dashboard/menus/categories') },
          ],
        },
        {
          title: t('tables'),
          icon: <AccountsIcon />,
          href: withLocale('/dashboard/tables'),
        },
        {
          title: t('dashboard.reservations') || 'Reservations',
          icon: <CustomersIcon />,
          href: withLocale('/dashboard/reservations'),
        },
        {
          title: t('dashboard.inventory') || 'Inventory',
          icon: <BalanceIcon />,
          type: 'collapse',
          items: [
            {
              name: t('dashboard.inventory') || 'Inventory',
              href: withLocale('/dashboard/inventory'),
            },
            {
              name: t('dashboard.recipes') || 'Recipes',
              href: withLocale('/dashboard/inventory/recipes'),
            },
            { name: t('categories'), href: withLocale('/dashboard/inventory/categories') },
          ],
        },
        {
          title: t('dashboard.loyaltyProgram') || 'Loyalty Program',
          icon: <FilterIcon />,
          href: withLocale('/dashboard/loyalty-program'),
        },
        {
          title: t('dashboard.reports') || 'Reports',
          icon: <ReportsIcon />,
          href: withLocale('/dashboard/reports'),
        },
      ],
    },
    {
      title: t('dashboard.general') || 'General',
      items: [
        {
          title: t('customers'),
          icon: <CustomersIcon />,
          href: withLocale('/dashboard/customers'),
        },
        {
          title: t('dashboard.reviews') || 'Reviews',
          icon: <ViewIcon />,
          href: withLocale('/dashboard/reviews'),
        },
        {
          title: t('settings.title'),
          icon: <SettingsIcon />,
          href: withLocale('/dashboard/settings'),
        },
      ],
    },
    {
      title: t('system'),
      items: [
        {
          title: t('users'),
          icon: <DevIcon />,
          href: withLocale('/dashboard/users'),
        },
      ],
    },
  ]

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        router.push(`/${locale}/login`)
      },
    })
  }

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
              isActive={pathname === withLocale('/dashboard') || pathname === `/${locale}`}
              href={withLocale('/dashboard')}
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
                onClick={() => router.push(withLocale('/dashboard/settings'))}
              >
                <SettingsIcon />
              </div>
            </Tooltip>
            <Tooltip content={t('settings.logout')} color="primary">
              <div
                className="hover:opacity-80 max-w-fit transition-opacity cursor-pointer"
                onClick={handleLogout}
              >
                <IoLogOutSharp className="w-6 h-6 text-gray-700" />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
    </aside>
  )
}
