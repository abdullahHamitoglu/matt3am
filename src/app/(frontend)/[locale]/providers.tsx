'use client'

/**
 * React Query Provider
 * Wraps the frontend application with QueryClientProvider and DevTools
 */

import React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '@/lib/query/client'
import { HeroUIProvider } from '@heroui/react'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider } from 'next-themes'
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar'

interface ProvidersProps {
  children: React.ReactNode
  locale: string
  messages: any
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <HeroUIProvider>
            {children}
            <ProgressBar
              height="3px"
              color="#F59E0B"
              options={{ showSpinner: false }}
              shallowRouting
            />
          </HeroUIProvider>
          {/* React Query DevTools for development */}
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
        </ThemeProvider>
      </QueryClientProvider>
    </NextIntlClientProvider>
  )
}
