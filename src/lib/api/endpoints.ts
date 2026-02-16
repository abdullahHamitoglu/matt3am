/**
 * API Endpoint Constants
 * Centralized endpoint definitions for all Payload CMS collections
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  REFRESH: '/auth/refresh',
} as const

// Collection endpoints
export const COLLECTION_ENDPOINTS = {
  CART: '/cart',
  CATEGORIES: '/categories',
  CURRENCIES: '/currencies',
  INVENTORY_ITEMS: '/inventory-items',
  LOYALTY_PROGRAM: '/loyalty-program',
  MEDIA: '/media',
  MENU_ITEMS: '/menu-items',
  ORDERS: '/orders',
  PERMISSIONS: '/permissions',
  PRODUCT_RECIPES: '/product-recipes',
  RESERVATIONS: '/reservations',
  RESTAURANTS: '/restaurants',
  REVIEWS: '/reviews',
  ROLES: '/roles',
  TABLES: '/tables',
  USERS: '/users',
} as const

// Helper to build resource endpoint
export const buildResourceEndpoint = (
  collectionUrl: string,
  resourceId?: string | number,
): string => {
  if (!resourceId) return collectionUrl
  return `${collectionUrl}/${resourceId}`
}

// Helper to build query string
export const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, String(v)))
      } else {
        searchParams.append(key, String(value))
      }
    }
  })

  const queryString = searchParams.toString()
  return queryString ? `?${queryString}` : ''
}
