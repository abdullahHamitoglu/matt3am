import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'ar', 'tr'],
  defaultLocale: 'en',
  localeCookie: true,
  localeDetection: true,
})
