'use client'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@heroui/react'
import React, { useEffect, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useRestaurantSelection } from '@/hooks/restaurants'
import { AcmeIcon } from '../icons/acme-icon'
import { BottomIcon } from '../icons/sidebar/bottom-icon'
import type { Restaurant } from '@/payload-types'

export const CompaniesDropdown = () => {
  const t = useTranslations()
  const { selectedRestaurant, setSelectedRestaurant, restaurants, isMultiRestaurant, isLoading } =
    useRestaurantSelection()

  // Get the current restaurant object
  const currentRestaurant = useMemo(() => {
    if (!selectedRestaurant) return null
    return restaurants.find((r) => r.id === selectedRestaurant) || null
  }, [selectedRestaurant, restaurants])

  // Auto-select the first restaurant if none is selected
  useEffect(() => {
    if (!isLoading && !selectedRestaurant && restaurants.length > 0) {
      setSelectedRestaurant(restaurants[0].id)
    }
  }, [isLoading, selectedRestaurant, restaurants, setSelectedRestaurant])

  // Helper to get restaurant name (with locale support)
  const getRestaurantName = (restaurant: Restaurant | null) => {
    if (!restaurant) return t('emptyContent')
    return typeof restaurant.name === 'string'
      ? restaurant.name
      : restaurant.name || restaurant.name || t('restaurant')
  }

  // Helper to get restaurant location
  const getRestaurantLocation = (restaurant: Restaurant | null) => {
    if (!restaurant) return ''
    const city =
      typeof restaurant.city === 'string'
        ? restaurant.city
        : restaurant.city || restaurant.city || ''
    const district =
      typeof restaurant.district === 'string'
        ? restaurant.district
        : restaurant.district || restaurant.district || ''
    return district ? `${city}, ${district}` : city
  }

  // Don't show dropdown if loading or no restaurants
  if (isLoading || restaurants.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <AcmeIcon />
        <div className="flex flex-col gap-4">
          <h3 className="m-0 -mb-4 font-medium text-default-900 text-xl whitespace-wrap">
            {isLoading ? t('table_loading_message') : t('emptyContent')}
          </h3>
        </div>
      </div>
    )
  }

  // If only one restaurant, just display it without dropdown
  if (!isMultiRestaurant) {
    const restaurant = restaurants[0]
    return (
      <div className="flex items-center gap-2">
        <AcmeIcon />
        <div className="flex flex-col gap-4">
          <h3 className="m-0 -mb-4 font-medium text-default-900 text-xl whitespace-nowrap">
            {getRestaurantName(restaurant)}
          </h3>
          <span className="font-medium text-default-500 text-xs">
            {getRestaurantLocation(restaurant)}
          </span>
        </div>
      </div>
    )
  }

  // Multiple restaurants - show dropdown
  return (
    <Dropdown
      classNames={{
        base: 'w-full min-w-[260px]',
      }}
    >
      <DropdownTrigger className="cursor-pointer">
        <div className="flex items-center gap-2">
          <AcmeIcon />
          <div className="flex flex-col gap-4">
            <h3 className="m-0 -mb-4 font-medium text-default-900 text-xl whitespace-nowrap">
              {getRestaurantName(currentRestaurant)}
            </h3>
            <span className="font-medium text-default-500 text-xs">
              {getRestaurantLocation(currentRestaurant)}
            </span>
          </div>
          <BottomIcon />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        onAction={(key) => {
          setSelectedRestaurant(key as string)
        }}
        aria-label="Select Restaurant"
        selectionMode="single"
        selectedKeys={selectedRestaurant ? [selectedRestaurant] : []}
      >
        <DropdownSection title={t('restaurants')}>
          {restaurants.map((restaurant) => (
            <DropdownItem
              key={restaurant.id}
              startContent={<AcmeIcon />}
              description={getRestaurantLocation(restaurant)}
              classNames={{
                base: 'py-4',
                title: 'text-base font-semibold',
              }}
            >
              {getRestaurantName(restaurant)}
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
