'use client'
import React from 'react'
import dynamic from 'next/dynamic'
import { CardBalance1 } from './card-balance1'
import { CardBalance2 } from './card-balance2'
import { CardBalance3 } from './card-balance3'
import { CardAgents } from './card-agents'
import { CardTransactions } from './card-transactions'
import { Link } from '@heroui/react'
import NextLink from 'next/link'
import { useTranslations } from 'next-intl'

const Chart = dynamic(() => import('../charts/steam').then((mod) => mod.Steam), {
  ssr: false,
})

export const Content = () => {
  const t = useTranslations()

  return (
    <div className="h-full">
      <div className="flex flex-wrap xl:flex-nowrap justify-center gap-4 xl:gap-6 mx-auto px-4 lg:px-0 w-full max-w-[90rem]">
        <div className="flex flex-col gap-6 w-full">
          {/* Card Section Top */}
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-xl">{t('availableBalance')}</h3>
            <div className="justify-center gap-5 grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 w-full">
              <CardBalance1 />
              <CardBalance2 />
              <CardBalance3 />
            </div>
          </div>

          {/* Chart */}
          <div className="flex flex-col gap-2 h-full">
            <h3 className="font-semibold text-xl">{t('statistics')}</h3>
            <div className="bg-default-50 shadow-lg p-6 rounded-2xl w-full">
              <Chart />
            </div>
          </div>
        </div>

        {/* Left Section */}
        <div className="flex flex-col gap-2 w-full xl:max-w-md">
          <h3 className="font-semibold text-xl">{t('section')}</h3>
          <div className="flex flex-col md:flex-col flex-wrap md:flex-nowrap justify-center gap-4">
            <CardAgents />
            <CardTransactions />
          </div>
        </div>
      </div>

      {/* Table Latest Users */}
      <div className="flex flex-col justify-center gap-3 mx-auto px-4 lg:px-0 py-5 w-full max-w-[90rem]">
        <div className="flex flex-wrap justify-between">
          <h3 className="font-semibold text-xl text-center">{t('latestUsers')}</h3>
          <Link href="/accounts" as={NextLink} color="primary" className="cursor-pointer">
            {t('viewAll')}
          </Link>
        </div>
        {/* <TableWrapper /> */}
      </div>
    </div>
  )
}
