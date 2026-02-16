import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: 'Asia/Damascus',
    formats: {
      number: {
        // Use Western Arabic numerals (0-9) for all locales including Arabic
        // Instead of Eastern Arabic/Hindi numerals (٠-٩)
        ...(locale === 'ar' && {
          default: {
            numberingSystem: 'latn', // Latin numerals (0-9)
          },
        }),
      },
    },
  }
})
