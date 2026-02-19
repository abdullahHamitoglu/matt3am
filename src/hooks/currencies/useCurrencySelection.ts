'use client'

/**
 * useCurrencySelection Hook
 * Manages the currently selected currency across the application.
 * Persists selection to cookies and provides the full Currency object.
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useCurrencies } from '@/hooks/currencies'
import { getCookie, setCookie } from '@/lib/cookies'
import type { Currency } from '@/payload-types'

const CURRENCY_COOKIE_KEY = 'selectedCurrencyCode'

export const useCurrencySelection = () => {
  const { data, isLoading } = useCurrencies()
  const [selectedCode, setSelectedCode] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const currencies = useMemo(() => data?.docs ?? [], [data])

  // Initialize from cookie or default to first currency
  useEffect(() => {
    if (isLoading || isInitialized) return

    const stored = getCookie(CURRENCY_COOKIE_KEY)

    if (stored && currencies.some((c) => c.code === stored)) {
      setSelectedCode(stored)
    } else if (currencies.length > 0) {
      const defaultCurrency = currencies[0]
      setSelectedCode(defaultCurrency.code)
      setCookie(CURRENCY_COOKIE_KEY, defaultCurrency.code, { expires: 365 })
    }

    setIsInitialized(true)
  }, [isLoading, currencies, isInitialized])

  const setSelectedCurrency = useCallback(
    (code: string) => {
      const found = currencies.find((c) => c.code === code)
      if (!found) return

      setSelectedCode(code)
      setCookie(CURRENCY_COOKIE_KEY, code, { expires: 365 })
    },
    [currencies],
  )

  const selectedCurrency: Currency | null = useMemo(
    () => currencies.find((c) => c.code === selectedCode) ?? null,
    [currencies, selectedCode],
  )

  return {
    /** The full Currency object for the selected currency */
    selectedCurrency,
    /** The selected currency code (e.g. "USD") */
    selectedCode,
    /** Update the selected currency by code */
    setSelectedCurrency,
    /** All available currencies */
    currencies,
    /** True while currencies are loading or selection is not yet initialized */
    isLoading: isLoading || !isInitialized,
  }
}
