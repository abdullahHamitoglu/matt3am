'use client'
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Listbox,
  ListboxItem,
} from '@heroui/react'
import { Icon } from '@iconify/react'
import React from 'react'
import { LightLogo } from '../icons/logo/light'
import { ItemCounter } from '.'
import { useParams, usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

type Props = {
  isOpen: boolean
  onOpen: () => void
  onOpenChange: () => void
  menu: {
    name: string
    url?: string
  }[]
}

const MobileSidebar = (props: Props) => {
  const { isOpen, onOpen, onOpenChange, menu } = props
  const { locale } = useParams()
  const t = useTranslations()
  const path = usePathname()
  const theme = useTheme()

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  return (
    <>
      <Button
        onPress={onOpen}
        isIconOnly
        color="primary"
        variant="faded"
        className="bg-primary-500 text-white"
      >
        <Icon icon="prime:bars" width={24} height={24} />
      </Button>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="w-[90%]">
          <DrawerHeader className="flex flex-col gap-1" as={Link} href="/">
            <LightLogo />
          </DrawerHeader>
          <DrawerBody>
            <Listbox
              aria-label="User Menu"
              className="gap-0 bg-content1 p-0 border-0 overflow-visible"
              itemClasses={{
                base: 'px-3 first:rounded-t-medium last:rounded-b-medium rounded-none gap-3 h-12 data-[hover=true]:bg-default-100/80',
              }}
            >
              {menu?.map((item, index) => (
                <ListboxItem
                  key={index}
                  as={Link}
                  href={item.url || '#'}
                  className="flex justify-between items-center font-semibold text-lg"
                  endContent={<ItemCounter locale={locale as string} />}
                >
                  {item.name}
                </ListboxItem>
              ))}
            </Listbox>

            <div className="flex flex-row flex-wrap gap-3">
              <Button
                isIconOnly
                color="primary"
                variant="faded"
                className="bg-primary-500 text-white"
                onPress={() => {
                  theme.resolvedTheme === 'dark' ? theme.setTheme('light') : theme.setTheme('dark')
                  onOpenChange()
                }}
              >
                <Icon icon={`iconamoon:mode-${theme.theme}`} width="24" height="24" />
              </Button>
              <Dropdown className="min-w-[100px]" backdrop="blur">
                <DropdownTrigger className="w-fit cursor-pointer">
                  <Button
                    color="primary"
                    variant="faded"
                    className="bg-primary-500 px-1 text-white"
                  >
                    <Icon icon="hugeicons:global-refresh" className="text-2xl" />
                    <span className="text-lg">{locale}</span>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem
                    key={'ar'}
                    className="flex items-center text-inherit text-xl text-center"
                  >
                    <Link hrefLang="ar" href={path.replaceAll(`${locale}`, '')} locale="ar">
                      العربية
                    </Link>
                  </DropdownItem>
                  <DropdownItem
                    key={'tr'}
                    className="flex items-center text-inherit text-xl text-center"
                  >
                    <Link hrefLang="tr" href={path.replaceAll(`${locale}`, '')} locale="tr">
                      Türkçe
                    </Link>
                  </DropdownItem>
                  <DropdownItem
                    key={'en'}
                    className="flex items-center text-inherit text-xl text-center"
                  >
                    <Link hrefLang="en" href={path.replaceAll(`${locale}`, '')} locale="en">
                      English
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownItem
                    key={'profileSettings'}
                    as={Link}
                    href={`/profile-settings`}
                    className="flex items-center text-inherit text-xl text-center"
                  >
                    {t('profileSettings')}
                  </DropdownItem>
                  <DropdownItem
                    key={'logout'}
                    as={Link}
                    href={`/logout`}
                    className="flex items-center text-inherit text-xl text-center"
                  >
                    {t('logout')}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Button
                as={Link}
                color="primary"
                href="#"
                variant="faded"
                className="bg-primary-500 rounded-full w-fit text-white"
                endContent={<Icon icon="ph:seal-percent-duotone" width="25" height="25" />}
                onPress={onOpenChange}
              >
                {t('bookNow')}
              </Button>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default MobileSidebar
