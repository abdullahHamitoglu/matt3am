/**
 * React Query Client Configuration
 * Sets up caching, stale time, and retry strategies
 */

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      // Retry failed requests up to 3 times
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors except 408 and 429
        if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
          if (error.statusCode === 408 || error.statusCode === 429) {
            return failureCount < 3
          }
          return false
        }
        // Retry on 5xx errors and network errors
        return failureCount < 3
      },
      // Refetch on window focus
      refetchOnWindowFocus: true,
      // Refetch on mount if stale
      refetchOnMount: true,
    },
    mutations: {
      // Retry failed mutations up to 2 times
      retry: (failureCount) => failureCount < 2,
    },
  },
})
