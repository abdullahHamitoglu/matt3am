'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { RestaurantDetailView } from '@/components/client-dashboard/restaurants'
import { useRestaurantDetail } from '@/hooks/restaurants'
import { Spinner } from '@heroui/react'

export default function RestaurantDetailPage() {
  const params = useParams()
  const router = useRouter()
  const restaurantId = params.id as string

  const { data: restaurant, isLoading } = useRestaurantDetail(restaurantId)

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
    <RestaurantDetailView
      restaurant={restaurant}
      onEdit={(id) => router.push(`/dashboard/restaurants/edit/${id}`)}
      onBack={() => router.push('/dashboard/restaurants')}
    />
  )
}
