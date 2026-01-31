'use client'

import React from 'react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react'
import { usePathname, useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'

export const LanguageSwitcher = () => {
  const pathname = usePathname()
  const router = useRouter()

  const currentLocale = pathname.split('/')[1] as 'en' | 'ar' | 'tr'

  const handleLocaleChange = (locale: string) => {
    if (!pathname) return
    const segments = pathname.split('/')
    segments[1] = locale
    const newPath = segments.join('/')
    router.push(newPath)
  }

  const languages = [
    { key: 'en', label: 'English', icon: 'twemoji:flag-united-states' },
    { key: 'ar', label: 'العربية', icon: 'twemoji:flag-saudi-arabia' },
    { key: 'tr', label: 'Türkçe', icon: 'twemoji:flag-turkey' },
  ]

  const currentLang = languages.find((l) => l.key === currentLocale)

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="light" isIconOnly size="sm">
          <Icon icon="mdi:translate" width={20} className="text-gray-400" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language Actions"
        selectionMode="single"
        selectedKeys={new Set([currentLocale])}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0] as string
          if (key) handleLocaleChange(key)
        }}
      >
        {languages.map((lang) => (
          <DropdownItem key={lang.key} startContent={<Icon icon={lang.icon} />}>
            {lang.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
