'use client'

import { addToast, Button, Divider, Form, Input, Link } from '@heroui/react'
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { useRegister } from '@/hooks/auth/useRegister'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Image from 'next/image'

export default function RegisterPage() {
  const t = useTranslations()
  const router = useRouter()
  const register = useRegister()
  const [error, setError] = useState<string>('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    const formData = new FormData(event.currentTarget)
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const phone = formData.get('phone') as string

    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch'))
      return
    }

    try {
      await register.mutateAsync({ firstName, lastName, email, password, phone })
      router.push('/dashboard')
    } catch (err: any) {
      err?.errors?.errors?.map((e: any) => {
        addToast({
          title: t('error'),
          description: e.message,
          color: 'danger',
        })
      })
      setError(err?.message || t('registerError'))
    }
  }

  return (
    <div className="flex justify-center items-center bg-default-50 p-4 min-h-screen">
      <div className="flex flex-col gap-4 bg-content1 shadow-md p-6 rounded-lg w-full max-w-sm">
        <div className="flex justify-center mb-2">
          <Image src="/assets/SVG/logo.svg" alt={t('matt3am')} width={120} height={40} priority />
        </div>
        <h2 className="font-medium text-xl text-center">{t('createAccount')}</h2>

        {error && (
          <div className="bg-danger-50 p-3 rounded-md text-danger-500 text-sm">{error}</div>
        )}

        <Form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            isRequired
            label={t('firstName')}
            name="firstName"
            placeholder={t('enterYourFirstName')}
            type="text"
            variant="bordered"
            isDisabled={register.isPending}
          />
          <Input
            isRequired
            label={t('lastName')}
            name="lastName"
            placeholder={t('enterYourLastName')}
            type="text"
            variant="bordered"
            isDisabled={register.isPending}
          />
          <Input
            label={t('phone')}
            name="phone"
            placeholder={t('enterYourPhone')}
            type="tel"
            variant="bordered"
            isDisabled={register.isPending}
          />
          <Input
            isRequired
            label={t('email')}
            name="email"
            placeholder={t('enterYourEmail')}
            type="email"
            variant="bordered"
            isDisabled={register.isPending}
          />
          <Input
            isRequired
            label={t('password')}
            name="password"
            placeholder={t('createAPassword')}
            type="password"
            variant="bordered"
            isDisabled={register.isPending}
          />
          <Input
            isRequired
            label={t('confirmPassword')}
            name="confirmPassword"
            placeholder={t('confirmYourPassword')}
            type="password"
            variant="bordered"
            isDisabled={register.isPending}
          />
          <Button className="w-full" color="primary" type="submit" isLoading={register.isPending}>
            {t('signUp')}
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
          {t('alreadyHaveAnAccount')}{' '}
          <Link href="/login" size="sm">
            {t('loginHere')}
          </Link>
        </p>
      </div>
    </div>
  )
}
