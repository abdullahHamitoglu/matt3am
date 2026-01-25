import React from 'react'
import './styles.css'
import { Providers } from './[locale]/providers'
import { getLocale } from 'next-intl/server'
import { getMessages } from 'next-intl/server'

export const metadata = {
  description: 'مطعمك الرقمي على الإنترنت - أنشئ قائمتك، استقبل الطلبات، ووسع عملك بسهولة.',
  title: 'Matt3am',
  icons: {
    icon: '/assets/SVG/logo_6.svg',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const locale = await getLocale()
  const messages = await getMessages()

  return children
}
