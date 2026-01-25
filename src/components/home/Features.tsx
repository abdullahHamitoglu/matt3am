import { Icon } from '@iconify/react'
import Image from 'next/image'
import React from 'react'

type Props = {}

const Features = (props: Props) => {
  const features = [
    {
      name: 'متعدد اللغات',
      icon: 'solar:global-bold-duotone',
      description: 'يدعم النطاقات متعددة لتلبية احتياجات العملاء للتنوع.',
    },
    {
      name: 'سهولة الاستخدام',
      icon: 'solar:star-bold-duotone',
      description: 'واجهة بسيطة وبديهية لأصحاب المطعم والعملاء.',
    },
    {
      name: 'تكامل مع الخرائط',
      icon: 'solar:point-on-map-bold-duotone',
      description: 'عرض مواقع الفروع وتوجيه العملاء إلى الطاولات بسهولة.',
    },
    {
      name: 'اشعارات فورية',
      icon: 'solar:bell-bold-duotone',
      description: 'إشعارات فورية للمالك بالطلبات والتحديثات في الوقت المناسب.',
    },
  ]
  return (
    <div className="items-start gap-4 grid grid-cols-5 rounded-2xl w-full">
      <div className="flex justify-center items-end col-span-5 md:col-span-3 rounded-2xl h-64 overflow-hidden">
        <Image
          width={900}
          height={256}
          src="/assets/backgrounds/services.png"
          alt="services"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="col-span-5 md:col-span-2 mt-4">
        <h4 className="mb-[10px] font-bold text-secondary-500 dark:text-secondary-400 text-lg">
          لماذا تختار تطبيقنا؟
        </h4>
        <ul className="gap-[10px] grid grid-cols-2 mt-4">
          {features.map((feature, index) => (
            <li key={index} className="flex flex-col gap-2 p-4">
              <div className="flex items-center gap-2 font-bold text-primary-500 dark:text-primary-400 text-base">
                <Icon
                  icon={feature.icon}
                  className="w-6 h-6 text-primary-500 dark:text-primary-400"
                />
                {feature.name}
              </div>
              <p className="font-normal text-[10px] text-secondary-500 dark:text-secondary-400">
                {feature.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Features
