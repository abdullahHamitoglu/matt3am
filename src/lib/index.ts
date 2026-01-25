/**
 * Centralized exports for the entire API layer
 * Import everything from this file: import { useRestaurants, apiClient, authService } from '@/lib/api'
 */

// API Client and Configuration
export { apiClient, default as client } from './api/client'
export * from './api/endpoints'
export * from './api/types'

// Query Client
export { queryClient } from './query/client'
