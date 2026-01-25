import Image from 'next/image'
import React from 'react'

type Props = {}

const ReadyToStart = (props: Props) => {
  return (
    <div className="flex flex-col justify-center items-center gap-3 p-5">
      <h4 className="justify-center font-bold text-secondary-500 dark:text-secondary-400 text-lg text-right">
        جاهز للبدء؟
      </h4>
      <p className="justify-start font-normal text-primary-500 dark:text-primary-400 text-sm text-right">
        حمل التطبيق الآن
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
          او
        </div>
        <a
          className="flex-1 border-primary-500 dark:border-primary-400 border-b-1 font-bold text-primary-500 dark:text-primary-400 text-sm leading-7 cursor-pointer"
          href="#"
        >
          سجل
        </a>
        <div className="font-bold text-primary-500 dark:text-primary-400 text-sm leading-7">
          للحصول على نسخة تجريبية مجانية!
        </div>
      </div>
    </div>
  )
}

export default ReadyToStart
