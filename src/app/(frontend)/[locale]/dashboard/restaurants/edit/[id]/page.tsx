'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { RestaurantForm } from '@/components/client-dashboard/restaurants'
import { useRestaurantDetail, useUpdateRestaurant } from '@/hooks/restaurants'
import { Card, CardBody, CardHeader, Spinner } from '@heroui/react'
import { useTranslations } from 'next-intl'
import { Restaurant } from '@/payload-types'

export default function EditRestaurantPage() {
  const params = useParams()
  const router = useRouter()
  const restaurantId = params.id as string
  const t = useTranslations('restaurants')

  const { data: restaurant, isLoading } = useRestaurantDetail(restaurantId)
  const { mutate: updateRestaurant, isPending } = useUpdateRestaurant(restaurantId)

  const handleSubmit = (data: Partial<Restaurant>) => {
    updateRestaurant(data as any, {
      onSuccess: () => {
        alert(t('restaurantUpdated'))
        router.push('/dashboard/restaurants')
      },
      onError: (error: any) => {
        alert(error?.message || t('error'))
      },
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!restaurant) {
    return <div>Restaurant not found</div>
  }

  return (
    <div className="mx-auto p-6 container">
      <Card>
        <CardHeader>
          <h1 className="ms-4 font-bold text-2xl">{t('edit')}</h1>
        </CardHeader>
        <CardBody>
          <RestaurantForm
            restaurant={restaurant}
            onSubmit={handleSubmit}
            onCancel={() => router.push('/dashboard/restaurants')}
            isLoading={isPending}
          />
        </CardBody>
      </Card>
    </div>
  )
}
