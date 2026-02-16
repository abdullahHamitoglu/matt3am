import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarItem,
} from '@heroui/react'
import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { deleteAuthCookie } from '@/hooks/auth/useAuth'
import { useCurrentUser } from '@/hooks'
import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'

export const UserDropdown = () => {
  const router = useRouter()
  const t = useTranslations()
  const locale = useLocale()
  const { data, isLoading } = useCurrentUser()
  const currentUser = data?.user

  const handleLogout = useCallback(async () => {
    await deleteAuthCookie()
    router.replace(`/${locale}/login`)
  }, [router, locale])

  return (
    <Dropdown>
      <NavbarItem>
        <DropdownTrigger>
          <Avatar
            as="button"
            color="secondary"
            size="md"
            fallback={
              (currentUser?.firstName?.slice(0, 1) ?? '?') +
              (currentUser?.lastName?.slice(0, 1) ?? '?')
            }
          />
        </DropdownTrigger>
      </NavbarItem>
      <DropdownMenu aria-label="User menu actions">
        {currentUser && (
          <DropdownItem
            key="profile"
            className="flex flex-col justify-start items-start w-full"
            as={Link}
            href={`/${locale}/dashboard/profile`}
          >
            <p>{t('signedInAs')}</p>
            <p>{currentUser.email}</p>
          </DropdownItem>
        )}
        <DropdownItem key="logout" color="danger" className="text-danger" onPress={handleLogout}>
          {t('logout')}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
