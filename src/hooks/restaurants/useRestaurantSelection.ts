'use client'

/**
 * useRestaurantSelection Hook
 * Manages the currently selected restaurant for multi-restaurant users
 * Replaces RestaurantContext with a simpler hook-based approach
 */

import { useState, useEffect } from 'react'
import { useUserPermissions } from '@/hooks/auth/useUserPermissions'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const STORAGE_KEY = 'selectedRestaurantId'

export const useRestaurantSelection = () => {
  const { restaurants, isAdmin, restaurantIds, isLoading: isLoadingUser } = useUserPermissions()
  const [selectedRestaurant, setSelectedRestaurantState] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const isMultiRestaurant = restaurants.length > 1 || isAdmin

  // Convert restaurantIds array to string for stable dependency comparison
  const restaurantIdsKey = restaurantIds.join(',')

  // Initialize selected restaurant from cookies or default to first restaurant
  useEffect(() => {
    if (isLoadingUser || isInitialized) return

    // Try to get from cookies
    const stored = getCookie(STORAGE_KEY)

    if (stored) {
      // Validate that the stored restaurant is still valid for this user
      const isValid = isAdmin || restaurantIds.includes(stored)

      if (isValid) {
        setSelectedRestaurantState(stored)
        setIsInitialized(true)
        return
      }
    }

    // Default to first restaurant if user has restaurants
    if (restaurantIds.length > 0) {
      setSelectedRestaurantState(restaurantIds[0])
    } else if (isAdmin) {
      // Admin with no specific restaurant selected - null means "all restaurants"
      setSelectedRestaurantState(null)
    }

    setIsInitialized(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingUser, restaurantIdsKey, isAdmin])

  // Update cookies when selection changes
  const setSelectedRestaurant = (id: string | null) => {
    setSelectedRestaurantState(id)
    if (id) {
      setCookie(STORAGE_KEY, id, { expires: 365 })
    } else {
      removeCookie(STORAGE_KEY)
    }
  }

  return {
    selectedRestaurant,
    setSelectedRestaurant,
    restaurants,
    isMultiRestaurant,
    isLoading: isLoadingUser || !isInitialized,
  }
}
