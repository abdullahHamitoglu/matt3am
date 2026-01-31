'use client'

import React, { useEffect, useState } from 'react'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Spinner,
} from '@heroui/react'
import { useCurrencies } from '@/hooks/currencies'
import { Icon } from '@iconify/react'

const STORAGE_KEY = 'selectedCurrencyCode'

export const CurrencySwitcher = () => {
  const { data, isLoading } = useCurrencies()
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      setSelectedCurrency(stored)
    } else if (data?.docs && data.docs.length > 0) {
      setSelectedCurrency(data.docs[0].code)
    }
  }, [data])

  const handleSelect = (key: string) => {
    setSelectedCurrency(key)
    localStorage.setItem(STORAGE_KEY, key)
    // Here you could convert prices or emit an event
  }

  if (isLoading) {
    return <Spinner size="sm" />
  }

  const currencies = data?.docs || []
  if (currencies.length === 0) return null

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          size="sm"
          startContent={<Icon icon="solar:dollar-minimalistic-bold" width={20} />}
        >
          {selectedCurrency}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Currency Actions"
        selectionMode="single"
        selectedKeys={new Set([selectedCurrency])}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0] as string
          if (key) handleSelect(key)
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
