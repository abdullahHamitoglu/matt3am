'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { RestaurantForm } from '@/components/client-dashboard/restaurants'
import { useCreateRestaurant } from '@/hooks/restaurants'
import { Card, CardBody } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { Restaurant } from '@/payload-types'

export default function CreateRestaurantPage() {
  const router = useRouter()
  const t = useTranslations('restaurants')
  const { mutate: createRestaurant, isPending } = useCreateRestaurant()

  const handleSubmit = (data: Partial<Restaurant>) => {
    createRestaurant(data as any, {
      onSuccess: () => {
        alert(t('restaurantCreated'))
        router.push('/dashboard/restaurants')
      },
      onError: (error: any) => {
        alert(error?.message || t('error'))
      },
    })
  }

  return (
    <div className="mx-auto p-6 container">
      <Card>
        <CardBody>
          <h1 className="mb-6 font-bold text-2xl">{t('create')}</h1>
          <RestaurantForm
            onSubmit={handleSubmit}
            onCancel={() => router.push('/dashboard/restaurants')}
            isLoading={isPending}
          />
        </CardBody>
      </Card>
    </div>
  )
}
