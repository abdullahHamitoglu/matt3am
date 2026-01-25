'use client'

/**
 * useRegister Hook
 * Handles user registration with React Query
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/auth.service'
import type { RegisterPayload } from '@/lib/api/types'

export const useRegister = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: () => {
      // Invalidate current user query to refetch with new auth
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
    },
  })
}
