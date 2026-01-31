/**
 * Centralized exports for all hooks
 * Import from this file for convenience: import { useRestaurants, useLogin } from '@/hooks'
 */

// Auth hooks
export * from './auth/useLogin'
export * from './auth/useLogout'
export * from './auth/useRegister'
export * from './auth/useCurrentUser'

// Collection hooks
export * from './restaurants'
export * from './menu-items'
export * from './orders'
export * from './categories'
export * from './tables'
export * from './reservations'
export * from './reviews'
export * from './inventory-items'
export * from './loyalty-program'
export * from './product-recipes'
export * from './media'
export * from './users'
export * from './roles'
export * from './permissions'
export * from './currencies'
