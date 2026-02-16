import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  NavbarItem,
} from '@heroui/react'
import React from 'react'
import { NotificationIcon } from '../icons/navbar/notificationicon'
import { useTranslations } from 'next-intl'

export const NotificationsDropdown = () => {
  const t = useTranslations('settings')

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <NavbarItem>
          <NotificationIcon />
        </NavbarItem>
      </DropdownTrigger>
      <DropdownMenu className="w-80" aria-label="Notifications">
        <DropdownSection title={t('notifications')}>
          <DropdownItem
            key="empty"
            classNames={{
              base: 'py-4',
              title: 'text-sm text-default-400',
            }}
            textValue="No notifications"
          >
            <div className="flex flex-col items-center gap-2 py-2">
              <span className="text-3xl">🔔</span>
              <p className="text-default-400 text-sm text-center">
                {t('noNotifications') || 'No new notifications'}
              </p>
            </div>
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
