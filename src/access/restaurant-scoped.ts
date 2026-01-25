import type { Access, Where } from 'payload'
import { isAdmin } from './helpers'

/**
 * Restaurant-scoped access control
 * Admins can access all restaurants' data
 * Other users can only access data from their assigned restaurants
 */
export const restaurantScoped: Access = ({ req }) => {
  const { user } = req
  if (!user) return false

  // Admins bypass restaurant restrictions
  if (isAdmin({ req })) return true

  // Get user's assigned restaurants
  const userRestaurants = user.restaurant

  if (!userRestaurants) return false

  // Handle both array and single value
  const restaurantIds = Array.isArray(userRestaurants)
    ? userRestaurants.map((r) =>
        typeof r === 'object' && r !== null && 'id' in r ? (r as any).id : r,
      )
    : [
        typeof userRestaurants === 'object' && userRestaurants !== null && 'id' in userRestaurants
          ? (userRestaurants as any).id
          : userRestaurants,
      ]

  // Filter for empty/null values
  const validRestaurantIds = restaurantIds.filter((id) => id != null)

  if (validRestaurantIds.length === 0) return false

  // Return query constraint
  return {
    restaurant: {
      in: validRestaurantIds,
    },
  } as Where
}

/**
 * Restaurant-scoped or user-owned
 * Used for collections where users can access either:
 * 1. Records from their assigned restaurants
 * 2. Records they created (regardless of restaurant)
 */
export const restaurantScopedOrOwned: Access = ({ req }) => {
  const { user } = req
  if (!user) return false

  // Admins bypass all restrictions
  if (isAdmin({ req })) return true

  // Get user's assigned restaurants
  const userRestaurants = user.restaurant

  const conditions: Where[] = [
    // User is the creator
    {
      createdBy: { equals: user.id },
    },
  ]

  // Add restaurant condition if user has assigned restaurants
  if (userRestaurants) {
    const restaurantIds = Array.isArray(userRestaurants)
      ? userRestaurants.map((r) =>
          typeof r === 'object' && r !== null && 'id' in r ? (r as any).id : r,
        )
      : [
          typeof userRestaurants === 'object' && userRestaurants !== null && 'id' in userRestaurants
            ? (userRestaurants as any).id
            : userRestaurants,
        ]

    const validRestaurantIds = restaurantIds.filter((id) => id != null)

    if (validRestaurantIds.length > 0) {
      conditions.push({
        restaurant: {
          in: validRestaurantIds,
        },
      })
    }
  }

  // Return OR condition
  return {
    or: conditions,
  } as Where
}

/**
 * User can only access their own documents
 * Admins can access all
 */
export const userOwned: Access = ({ req }) => {
  const { user } = req
  if (!user) return false

  // Admins can access all
  if (isAdmin({ req })) return true

  // Users see only their own data
  return {
    user: { equals: user.id },
  } as Where
}
