'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import { LightLogo } from '../icons/logo/light'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import dynamic from 'next/dynamic'
import FooterNavBar from './navbar'

const NewsLater = dynamic(() => import('./NewsLeter'), { ssr: false })

type Props = {}

const Footer = (props: Props) => {
  const t = useTranslations()
  const contactLinks = [
    {
      name: t('emailLabel'),
      value: 'info@matt3am.com',
      url: 'mailto:info@matt3am.com',
      icon: 'ic:twotone-mail',
    },
    {
      name: t('phoneLabel'),
      value: '+20123456789',
      url: 'tel:+20123456789',
      icon: 'solar:phone-bold-duotone',
    },
    {
      name: t('addressLabel'),
      value: 'سوريا - دمشق',
      url: 'https://maps.app.goo.gl/wgGNqzi9M3Thmyyx7',
      icon: 'solar:point-on-map-bold-duotone',
    },
    {
      name: t('supportLabel'),
      value: t('technicalSupport'),
      url: '/support',
      icon: 'ic:twotone-support',
    },
  ]
  return (
    <footer className="flex flex-col justify-start items-start self-stretch !mx-auto p-3 md:p-0 container">
      <Link href="/" className="m-auto md:m-0 mb-4 px-3 md:py-6">
        <LightLogo />
      </Link>
      <p className="justify-start self-stretch mb-6 font-normal text-zinc-400 text-base text-right leading-normal">
        {t('collectionBanner')}
      </p>
      <ul className="gap-2 md:gap-4 grid grid-cols-2 md:grid-cols-4 mb-0 md:mb-6 w-full">
        {contactLinks.map((link, index) => (
          <li key={index} className="inline-flex justify-start items-start self-stretch gap-3">
            <Icon icon={link.icon} className="w-8 h-8 text-slate-300" />
            <div className="inline-flex flex-col justify-start items-end gap-0.5 w-40">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="justify-center self-stretch font-['IBM_Plex_Sans_Arabic'] font-normal text-zinc-400 text-sm text-right"
              >
                {link.name}
              </a>
              <p className="justify-center self-stretch h-5 font-['IBM_Plex_Sans_Arabic'] font-medium text-secondary-500 text-base text-right">
                {link.value}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <NewsLater />
      <FooterNavBar />
    </footer>
  )
}

export default Footer
