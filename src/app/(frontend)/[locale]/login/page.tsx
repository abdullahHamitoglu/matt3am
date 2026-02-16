'use client'

import { Button, Divider, Form, Input, Link } from '@heroui/react'
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { useLogin } from '@/hooks/auth/useLogin'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const t = useTranslations()
  const router = useRouter()
  const locale = useLocale()
  const login = useLogin(locale)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      await login.mutateAsync({ email, password })
      // Redirect to dashboard after successful login
      router.push('/dashboard')
    } catch (err: any) {
      setError(err?.message || t('loginError'))
    }
  }

  return (
    <div className="flex justify-center items-center bg-default-50 p-4 min-h-screen">
      <div className="flex flex-col gap-4 bg-content1 shadow-md p-6 rounded-lg w-full max-w-sm">
        <div className="flex justify-center mb-2">
          <Image src="/assets/SVG/logo.svg" alt={t('matt3am')} width={120} height={40} priority />
        </div>
        <h2 className="font-medium text-xl text-center">{t('welcomeBack')}</h2>

        {error && (
          <div className="bg-danger-50 p-3 rounded-md text-danger-500 text-sm">{error}</div>
        )}

        <Form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            isRequired
            label={t('email')}
            name="email"
            placeholder={t('enterYourEmail')}
            type="email"
            variant="bordered"
            isDisabled={login.isPending}
          />
          <Input
            isRequired
            label={t('password')}
            name="password"
            placeholder={t('enterYourPassword')}
            type="password"
            variant="bordered"
            isDisabled={login.isPending}
          />
          <div className="flex justify-between items-center">
            <Link href="#" size="sm">
              {t('forgotPassword')}
            </Link>
          </div>
          <Button className="w-full" color="primary" type="submit" isLoading={login.isPending}>
            {t('signIn')}
          </Button>
        </Form>
        <Divider />
        {/* <div className="flex flex-col gap-2">
          <Button
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
          >
            {t('continueWithGoogle')}
          </Button>
          <Button startContent={<Icon icon="fe:github" width={24} />} variant="bordered">
            {t('continueWithGithub')}
          </Button>
        </div> */}
        <p className="text-small text-center">
          {t('needAnAccount')}{' '}
          <Link href="/register" size="sm">
            {t('signUp')}
          </Link>
        </p>
      </div>
    </div>
  )
}
