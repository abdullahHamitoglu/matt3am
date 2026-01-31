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
    enabled: options?.enabled !== false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false, // Don't retry on auth failure (401)
    retryOnMount: false,
  })
}
