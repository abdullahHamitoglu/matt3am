'use client'

/**
 * Base Collection Hooks Factory
 * Generates useCollection, useCreate, useUpdate, and useDelete hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { BaseService } from '@/services/base.service'
import type { ListParams } from '@/lib/api/types'

export interface CollectionHooksOptions {
  collectionKey: string // e.g., 'restaurants', 'menu-items'
}

export function createCollectionHooks<T extends { id?: string | number }>(
  service: BaseService<T>,
  options: CollectionHooksOptions,
) {
  const { collectionKey } = options
  const queryKeys = {
    all: [collectionKey],
    lists: () => [...queryKeys.all, 'list'],
    list: (params?: ListParams) => [...queryKeys.lists(), { params }],
    details: () => [...queryKeys.all, 'detail'],
    detail: (id: string | number) => [...queryKeys.details(), id],
  }

  return {
    /**
     * Hook to fetch all documents with optional pagination and filtering
     */
    useCollection: (params?: ListParams, options?: { enabled?: boolean }) => {
      return useQuery({
        queryKey: queryKeys.list(params),
        queryFn: () => service.list(params),
        enabled: options?.enabled,
      })
    },

    /**
     * Hook to fetch a single document by ID
     */
    useDetail: (id: string | number, depth?: number, options?: { enabled?: boolean }) => {
      return useQuery({
        queryKey: queryKeys.detail(id),
        queryFn: () => service.getById(id, depth),
        enabled: options?.enabled !== false && !!id,
      })
    },

    /**
     * Hook to create a new document
     */
    useCreate: () => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: (data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => service.create(data),
        onSuccess: (newDoc: T) => {
          // Add new doc to list cache
          queryClient.setQueryData(queryKeys.list(), (old: any) => ({
            ...old,
            docs: [newDoc, ...old?.docs],
            totalDocs: (old?.totalDocs || 0) + 1,
          }))
          // Invalidate lists to refetch with new doc
          queryClient.invalidateQueries({ queryKey: queryKeys.lists() })
        },
      })
    },

    /**
     * Hook to update an existing document
     */
    useUpdate: (id: string | number) => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: (data: Partial<T>) => service.update(id, data),
        onSuccess: (updatedDoc: T) => {
          // Update detail cache
          queryClient.setQueryData(queryKeys.detail(id), updatedDoc)
          // Invalidate lists to refetch
          queryClient.invalidateQueries({ queryKey: queryKeys.lists() })
        },
      })
    },

    /**
     * Hook to delete a document
     */
    useDelete: (id: string | number) => {
      const queryClient = useQueryClient()

      return useMutation({
        mutationFn: () => service.delete(id),
        onSuccess: () => {
          // Remove from detail cache
          queryClient.removeQueries({ queryKey: queryKeys.detail(id) })
          // Invalidate lists to refetch
          queryClient.invalidateQueries({ queryKey: queryKeys.lists() })
        },
      })
    },

    /**
     * Query keys for manual cache invalidation
     */
    queryKeys,
  }
}
