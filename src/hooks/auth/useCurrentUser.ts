'use client'

/**
 * useCurrentUser Hook
 * Fetches current user information with React Query
 */

import { useQuery } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'

export const useCurrentUser = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => authService.getCurrentUser(),
    enabled: authService.isAuthenticated() && options?.enabled !== false,
    staleTime: Infinity, // User data doesn't change often, treat as fresh
  })
}
