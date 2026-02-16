'use client'

/**
 * useUserPermissions Hook
 * Provides unified interface for checking user permissions and access control
 */

import { useMemo, useCallback } from 'react'
import { useCurrentUser } from './useCurrentUser'
import type { User, Restaurant } from '@/payload-types'

export interface UserPermissions {
  user: User | null
  isLoading: boolean
  hasPermission: (action: string, resource: string) => boolean
  isAdmin: boolean
  restaurants: Restaurant[]
  position: 'manager' | 'waiter' | 'chef' | 'cashier' | 'delivery' | 'receptionist' | null
  restaurantIds: string[]
}

/**
 * Check if user has Administrator role
 */
function checkIsAdmin(user: Partial<User> | null | undefined): boolean {
  if (!user) return false

  const userRoles = user.roles
  if (!userRoles) return false

  const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles]

  return rolesArray.some((role) => {
    if (typeof role === 'object' && role !== null && 'name' in role) {
      return role.name === 'Administrator'
    }
    return false
  })
}

/**
 * Extract restaurants from user data
 */
function extractRestaurants(user: Partial<User> | null | undefined): Restaurant[] {
  if (!user?.restaurant) return []
  const restaurantsArray = Array.isArray(user.restaurant) ? user.restaurant : [user.restaurant]

  return restaurantsArray
    .filter((r) => typeof r === 'object' && r !== null)
    .map((r) => r as Restaurant)
}

/**
 * Extract restaurant IDs from user data
 */
function extractRestaurantIds(user: Partial<User> | null | undefined): string[] {
  if (!user?.restaurant) return []

  const restaurantsArray = Array.isArray(user.restaurant) ? user.restaurant : [user.restaurant]

  return restaurantsArray.map((r) => (typeof r === 'string' ? r : r.id))
}

/**
 * Extract user position from employee info
 */
function extractPosition(
  user: Partial<User> | null | undefined,
): 'manager' | 'waiter' | 'chef' | 'cashier' | 'delivery' | 'receptionist' | null {
  if (!user?.roles) return null
  return user.employeeInfo.position
}

export const useUserPermissions = (): UserPermissions => {
  const { data: currentUserResponse, isLoading, error } = useCurrentUser()

  const user = currentUserResponse?.user ?? null

  // Memoize computed values
  const isAdmin = useMemo(() => checkIsAdmin(user), [user])
  const restaurants = useMemo(() => extractRestaurants(user), [user])
  const restaurantIds = useMemo(() => extractRestaurantIds(user), [user])
  const position = useMemo(() => extractPosition(user), [user])

  /**
   * Check if user has a specific permission
   * Admins bypass all permission checks
   */
  const hasPermission = useCallback(
    (action: string, resource: string): boolean => {
      if (!user) return false

      // Admins bypass permission checks
      if (checkIsAdmin(user)) return true

      const userRoles = user.roles

      if (!userRoles || (Array.isArray(userRoles) && userRoles.length === 0)) {
        return false
      }

      // Convert to array if not already
      const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles]

      // Check if any of the user's roles has the required permission
      for (let i = 0; i < rolesArray.length; i++) {
        const roleItem = rolesArray[i]

        // Skip null/undefined/non-object roles
        if (!roleItem || typeof roleItem !== 'object') continue

        // At this point, we know roleItem is a non-null object
        const role = roleItem as Record<string, any>

        // Type guard: check if role has permissions property
        if (!('permissions' in role)) continue

        const permissions = role.permissions

        if (!permissions || !Array.isArray(permissions)) continue

        // Check each permission
        const hasRequiredPermission = permissions.some((perm) => {
          // Permission must be populated object
          if (typeof perm === 'object' && perm !== null) {
            return (
              'action' in perm &&
              'resource' in perm &&
              perm.action === action &&
              perm.resource === resource
            )
          }
          return false
        })

        if (hasRequiredPermission) return true
      }

      return false
    },
    [user],
  )

  return {
    user: user as User | null,
    isLoading,
    hasPermission,
    isAdmin,
    restaurants,
    position,
    restaurantIds,
  }
}
