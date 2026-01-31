'use client'

/**
 * RestaurantSelector
 * Dropdown for selecting restaurant in multi-restaurant scenarios
 */

import React from 'react'
import { Select, SelectItem } from '@heroui/react'
import { useRestaurantSelection } from '@/hooks/restaurants'
import { useUserPermissions } from '@/hooks/auth/useUserPermissions'
import { useTranslations } from 'next-intl'

export const RestaurantSelector: React.FC = () => {
  const t = useTranslations('dashboard')
  const { restaurants, selectedRestaurant, setSelectedRestaurant, isMultiRestaurant } =
    useRestaurantSelection()
  const { isAdmin } = useUserPermissions()

  // If user only has one restaurant and is not admin, show restaurant name
  if (!isMultiRestaurant && !isAdmin) {
    if (restaurants.length === 0) return null

    return (
      <div className="bg-default-100 px-3 py-2 rounded-lg text-default-600 text-sm">
        {restaurants[0]?.name}
      </div>
    )
  }

  // Multi-restaurant or admin user: show dropdown
  const items = [...(isAdmin ? [{ id: 'all', name: t('allRestaurants') }] : []), ...restaurants]

  return (
    <Select
      label={t('selectRestaurant')}
      placeholder={t('selectRestaurant')}
      selectedKeys={selectedRestaurant ? [selectedRestaurant] : []}
      onChange={(e) => {
        const value = e.target.value
        setSelectedRestaurant(value || null)
      }}
      className="max-w-xs"
      size="sm"
    >
      {items.map((item) => (
        <SelectItem key={item.id}>{item.name}</SelectItem>
      ))}
    </Select>
  )
}
