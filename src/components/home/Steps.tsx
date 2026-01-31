'use client'
import { Divider } from '@heroui/react'
import { useTranslations } from 'next-intl'
import React from 'react'

type Props = {}

const Steps = (props: Props) => {
  const t = useTranslations()

  const steps = [
    {
      name: t('startManagement'),
      description: t('startManagementDescription'),
    },
    {
      name: t('customizeApp'),
      description: t('customizeAppDescription'),
    },
    {
      name: t('registerAccount'),
      description: t('registerAccountDescription'),
    },
  ]

  return (
    <div className="flex flex-col justify-center items-center gap-4 p-5 w-full">
      <h4 className="font-bold text-secondary-500 dark:text-secondary-400 text-lg text-center">
        {t('howToStart')}
      </h4>
      <ul className="items-start gap-4 grid grid-cols-3">
        {steps.map((step, index) => (
          <li key={index} className="relative flex flex-col justify-center items-center">
            <Divider className="top-1.5 z-0 absolute bg-primary-500 dark:bg-primary-400 rounded-full w-[120%] h-1" />
            <span className="z-10 bg-primary-500 dark:bg-primary-400 px-[5px] border-2 border-primary-200 dark:border-primary-300 rounded-full text-white text-xs">
              {index + 1}
            </span>
            <h5 className="justify-center mt-4 mb-2.5 font-bold text-primary-500 dark:text-primary-400 text-base">
              {step.name}
            </h5>
            <p className="justify-center opacity-80 font-normal text-secondary-500 dark:text-secondary-400 text-xs text-center">
              {step.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Steps
