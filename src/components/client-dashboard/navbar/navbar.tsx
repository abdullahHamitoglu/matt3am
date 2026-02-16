import { Input, Link, Navbar, NavbarContent } from '@heroui/react'
import React from 'react'
import { BurguerButton } from './burguer-button'
import { NotificationsDropdown } from './notifications-dropdown'
import { UserDropdown } from './user-dropdown'
import { RestaurantSelector } from '../header/RestaurantSelector'
import { QuickAccess } from '../../common/QuickAccess'
import { LanguageSwitcher } from '../../common/LanguageSwitcher'
import { ThemeSwitcher } from '../../common/ThemeSwitcher'
import { CurrencySwitcher } from '../../common/CurrencySwitcher'

interface Props {
  children: React.ReactNode
}

export const NavbarWrapper = ({ children }: Props) => {
  return (
    <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
      <Navbar
        isBordered
        className="w-full"
        classNames={{
          wrapper: 'w-full max-w-full',
        }}
      >
        <NavbarContent className="md:hidden">
          <BurguerButton />
        </NavbarContent>
        <NavbarContent justify="end" className="data-[justify=end]:flex-grow-0 ms-auto w-fit">
          <QuickAccess />
          <div className="hidden md:flex items-center gap-2">
            <CurrencySwitcher />
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>

          <NotificationsDropdown />

          <NavbarContent>
            <UserDropdown />
          </NavbarContent>
        </NavbarContent>
      </Navbar>
      <div className="p-6">{children}</div>
    </div>
  )
}
