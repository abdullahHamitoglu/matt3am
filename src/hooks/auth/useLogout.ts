'use client'

/**
 * useLogout Hook
 * Handles user logout with React Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear()
    },
  })
}
