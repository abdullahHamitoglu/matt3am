import Footer from '@/components/footer'
import Header from '@/components/header'
import { Providers } from './providers'
import { getMessages } from 'next-intl/server'

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const paramsResolved = await params
  const locale = paramsResolved.locale
  const messages = await getMessages()

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        <Providers locale={locale} messages={messages}>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  )
}
