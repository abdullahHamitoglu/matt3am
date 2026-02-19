'use client'

import React from 'react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Spinner,
} from '@heroui/react'
import { useCurrencySelection } from '@/hooks/currencies'
import { Icon } from '@iconify/react'

export const CurrencySwitcher = () => {
  const { selectedCode, setSelectedCurrency, currencies, isLoading } = useCurrencySelection()

  if (isLoading) {
    return <Spinner size="sm" />
  }

  if (currencies.length === 0) return null

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          size="sm"
          startContent={<Icon icon="solar:dollar-minimalistic-bold" width={20} />}
        >
          {selectedCode}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Currency Actions"
        selectionMode="single"
        selectedKeys={new Set([selectedCode ?? ''])}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0] as string
          if (key) setSelectedCurrency(key)
        }}
      >
        {currencies.map((currency) => (
          <DropdownItem key={currency.code} description={currency.name}>
            {currency.code} ({currency.symbol})
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}
