'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { Button } from '@heroui/react'
import { Icon } from '@iconify/react'

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="light"
      isIconOnly
      size="sm"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Icon
        icon={theme === 'dark' ? 'solar:sun-bold' : 'solar:moon-bold'}
        width={24}
        className="text-default-500"
      />
    </Button>
  )
}
