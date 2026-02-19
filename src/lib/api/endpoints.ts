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
// Helper to flatten nested objects into Payload qs-style bracket notation
// e.g. { where: { status: { equals: 'ready' } } } → where[status][equals]=ready
const flattenParams = (
  obj: Record<string, any>,
  prefix = '',
  result: [string, string][] = [],
): [string, string][] => {
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined || value === null) continue
    const fullKey = prefix ? `${prefix}[${key}]` : key

    if (Array.isArray(value)) {
      // Check if array items are primitives or objects
      value.forEach((item, index) => {
        if (typeof item === 'object' && item !== null) {
          flattenParams(item, `${fullKey}[${index}]`, result)
        } else {
          result.push([`${fullKey}[${index}]`, String(item)])
        }
      })
    } else if (typeof value === 'object') {
      flattenParams(value, fullKey, result)
    } else {
      result.push([fullKey, String(value)])
    }
  }
  return result
}

export const buildQueryString = (params: Record<string, any>): string => {
  const pairs = flattenParams(params)
  if (pairs.length === 0) return ''

  const searchParams = new URLSearchParams()
  pairs.forEach(([key, value]) => searchParams.append(key, value))
  return `?${searchParams.toString()}`
}
