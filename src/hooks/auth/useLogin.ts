'use client'

/**
 * useLogin Hook
 * Handles user login with React Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import type { AuthPayload } from '@/lib/api/types'

export const useLogin = (locale: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AuthPayload) => authService.login(payload, locale),
    onSuccess: () => {
      // Invalidate current user query to refetch with new auth
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}
