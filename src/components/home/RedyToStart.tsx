'use client'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import React from 'react'

type Props = {}

const ReadyToStart = (props: Props) => {
  const t = useTranslations()

  return (
    <div className="flex flex-col justify-center items-center gap-3 p-5">
      <h4 className="justify-center font-bold text-secondary-500 dark:text-secondary-400 text-lg text-right">
        {t('readyToStart')}
      </h4>
      <p className="justify-start font-normal text-primary-500 dark:text-primary-400 text-sm text-right">
        {t('downloadAppNow')}
      </p>
      <div className="inline-flex justify-start items-center gap-3">
        <a href="https://play.google.com" target="_blank" rel="noreferrer">
          <Image
            width={176}
            height={48}
            className="w-44 h-12"
            src="/assets/getOnGooglePlay.png"
            alt="google play"
          />
        </a>
        <a href="https://appstore.com" target="_blank" rel="noreferrer">
          <Image
            width={176}
            height={48}
            className="w-44 h-12"
            src="/assets/getOnAppStore.png"
            alt="app store"
          />
        </a>
      </div>
      <div className="inline-flex justify-center items-center gap-1">
        <div className="font-normal text-secondary-500 dark:text-secondary-400 text-sm leading-7">
          {t('or')}
        </div>
        <a
          className="flex-1 border-primary-500 dark:border-primary-400 border-b-1 font-bold text-primary-500 dark:text-primary-400 text-sm leading-7 cursor-pointer"
          href="#"
        >
          {t('register')}
        </a>
        <div className="font-bold text-primary-500 dark:text-primary-400 text-sm leading-7">
          {t('registerForFreeTrial')}
        </div>
      </div>
    </div>
  )
}

export default ReadyToStart
