/**
 * Base Service Class
 * Provides common CRUD operations for all collections
 */

import apiClient from '@/lib/api/client'
import { buildResourceEndpoint, buildQueryString } from '@/lib/api/endpoints'
import type { ListParams, PaginatedResponse } from '@/lib/api/types'

export class BaseService<T extends { id?: string | number }> {
  constructor(private collectionEndpoint: string) {}

  /**
   * List all documents with optional filtering and pagination
   */
  async list(params?: ListParams): Promise<PaginatedResponse<T>> {
    const queryString = buildQueryString(params || {})
    const response = await apiClient.get<PaginatedResponse<T>>(
      `${this.collectionEndpoint}${queryString}`,
    )
    return response.data
  }

  /**
   * Get a single document by ID
   */
  async getById(id: string | number, depth?: number): Promise<T> {
    const queryString = depth !== undefined ? `?depth=${depth}` : ''
    const response = await apiClient.get<T>(
      buildResourceEndpoint(this.collectionEndpoint, id) + queryString,
    )
    return response.data
  }

  /**
   * Create a new document
   */
  async create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const response = await apiClient.post<T>(this.collectionEndpoint, data)
    return response.data
  }

  /**
   * Update an existing document
   */
  async update(id: string | number, data: Partial<T>): Promise<T> {
    const response = await apiClient.patch<T>(
      buildResourceEndpoint(this.collectionEndpoint, id),
      data,
    )
    return response.data
  }

  /**
   * Delete a document
   */
  async delete(id: string | number): Promise<{ id: string | number }> {
    await apiClient.delete(buildResourceEndpoint(this.collectionEndpoint, id))
    return { id }
  }
}
