'use client'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'

type Props = {}

const Collection = (props: Props) => {
  const t = useTranslations()

  return (
    <div className="relative mt-10 rounded-2xl overflow-hidden">
      <Image
        src="/assets/backgrounds/home_collection.jpg"
        width={1080}
        height={920}
        alt={t('collection')}
        className="w-full md:h-fit max-h-60 object-cover object-left-bottom ltr:scale-x-[-1] transform"
      />
      <div className="top-0 absolute flex justify-start items-center bg-gradient-to-l ltr:bg-gradient-to-r from-[#ffffffb7] dark:from-[#000000b7] to-transparent w-full md:w-1/2 h-full start-0">
        <h1 className="p-10 max-w-[300px] font-normal text-gray-800 dark:text-gray-200 text-xl">
          <span className="font-bold text-primary-500">{t('collectionBanner').split(',')[0]}</span>,{' '}
          {t('collectionBanner').split(',')[1]}
        </h1>
      </div>
    </div>
  )
}

export default Collection
