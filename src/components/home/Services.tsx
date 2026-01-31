'use client'
import { Icon } from '@iconify/react'
import { useTranslations } from 'next-intl'
import React from 'react'

type Props = {}

const Services = (props: Props) => {
  const t = useTranslations()

  const services = () => {
    const liClassNames = 'font-normal text- text-colors-common-white text-xs'
    const ulClassNames = 'opacity-80 ps-5 list-disc'
    return [
      {
        name: t('performanceReportsService'),
        icon: 'solar:chef-hat-minimalistic-bold-duotone',
        description: `
        <ul class="${ulClassNames}">
          <li class="${liClassNames}">${t('performanceReportsService1')}</li>
          <li class="${liClassNames}">${t('performanceReportsService2')}</li>
        </ul>
      `,
      },
      {
        name: t('reservationManagementService'),
        icon: 'solar:document-add-bold-duotone',
        description: `
        <ul class="${ulClassNames}">
          <li class="${liClassNames}">${t('reservationManagementService1')}</li>
          <li class="${liClassNames}">${t('reservationManagementService2')}</li>
        </ul>
      `,
      },
      {
        name: t('integratedPaymentSystemService'),
        icon: 'solar:wallet-money-bold-duotone',
        description: `
        <ul class="${ulClassNames}">
          <li class="${liClassNames}">${t('integratedPaymentSystemService1')}</li>
          <li class="${liClassNames}">${t('integratedPaymentSystemService2')}</li>
        </ul>
      `,
      },
      {
        name: t('orderManagementService'),
        icon: 'solar:bar-chair-bold-duotone',
        description: `
        <ul class="${ulClassNames}">
          <li class="${liClassNames}">${t('orderManagementService1')}</li>
          <li class="${liClassNames}">${t('orderManagementService2')}</li>
        </ul>
      `,
      },
      {
        name: t('menuManagementService'),
        icon: 'solar:document-add-bold-duotone',
        description: `
        <ul class="${ulClassNames}">
          <li class="${liClassNames}">${t('menuManagementService1')}</li>
          <li class="${liClassNames}">${t('menuManagementService2')}</li>
        </ul>
      `,
      },
    ]
  }

  const features = [
    {
      name: t('multiLanguageSupport'),
      icon: 'solar:global-bold-duotone',
      description: t('multiLanguageSupportFeatureDescription'),
    },
    {
      name: t('easeOfUse'),
      icon: 'solar:star-bold-duotone',
      description: t('easeOfUseFeatureDescription'),
    },
    {
      name: t('mapIntegration'),
      icon: 'solar:point-on-map-bold-duotone',
      description: t('mapIntegrationFeatureDescription'),
    },
    {
      name: t('instantNotifications'),
      icon: 'solar:bell-bold-duotone',
      description: t('instantNotificationsFeatureDescription'),
    },
  ]

  return (
    <div className="gap-4 grid grid-cols-2 md:grid-cols-5">
      {services().map((item, index) => (
        <div
          className={`flex flex-col items-start md:p-4 p-3 rounded-2xl text-white ${index % 2 ? 'bg-secondary-500' : 'bg-primary-400'} ${index === 4 ? 'md:col-span-1 col-span-2' : ''}`}
          key={index}
        >
          <Icon icon={item.icon as string} className="mb-3 text-2xl md:text-4xl" />
          <div className="[&>ul]:opacity-80 [&>ul]:md:ps-5 [&>ul]:ps-2 w-full [&>ul]:list-disc">
            <p className="mb-2 font-bold md:text-medium text-sm">{item.name}</p>
            <div dangerouslySetInnerHTML={{ __html: item.description }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default Services
