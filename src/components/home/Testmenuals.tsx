'use client'
import { Avatar } from '@heroui/react'
import React from 'react'

type Props = {}

const Testimonials = (props: Props) => {
  const testimonials = [
    {
      name: 'عبدالله العمري',
      section: 'مدير مطعم',
      description: 'تطبيق رائع وسهل الاستخدام، أنصح به بشدة.',
      image: '/assets/testimonials/1.jpg',
    },
    {
      name: 'محمد العتيبي',
      section: 'مدير مطعم',

      description: 'تطبيق ممتاز ويحتوي على كل الأدوات التي تحتاجها لإدارة مطعمك.',
      image: '/assets/testimonials/2.jpg',
    },
    {
      name: 'عبدالرحمن العنزي',
      section: 'مدير مطعم',
      description: 'تطبيق رائع وسهل الاستخدام، أنصح به بشدة.',
      image: '/assets/testimonials/3.jpg',
    },
    {
      name: 'عبدالله العمري',
      section: 'مدير مطعم',
      description: 'تطبيق رائع وسهل الاستخدام، أنصح به بشدة.',
      image: '/assets/testimonials/1.jpg',
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      <h4 className="font-bold text-secondary-500 dark:text-secondary-400 text-lg text-center">
        ما يقوله عملاؤنا ؟
      </h4>
      <div className="justify-center items-center gap-4 grid grid-cols-1 md:grid-cols-4 m-auto w-fit max-w-[80%]">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="flex flex-col justify-start items-start self-stretch gap-2.5 bg-[#0000000a] dark:bg-[#ffffff0a] p-4 rounded-xl"
          >
            <h5 className="flex items-center gap-2 font-bold text-primary-500 dark:text-primary-400 text-base">
              <Avatar src={testimonial.image} showFallback size="sm" />
              {testimonial.name}
              <span className="justify-center opacity-80 font-normal text-secondary-500 dark:text-secondary-400 text-xs text-right">
                {testimonial.section}
              </span>
            </h5>
            <p className="justify-center self-stretch opacity-80 font-normal text-secondary-500 dark:text-secondary-400 text-xl text-right">
              {testimonial.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Testimonials
