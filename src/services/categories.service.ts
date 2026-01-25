/**
 * Categories Service
 */

import { BaseService } from './base.service'
import { COLLECTION_ENDPOINTS } from '@/lib/api/endpoints'
import type { Category } from '@/payload-types'

export const categoriesService = new BaseService<Category>(COLLECTION_ENDPOINTS.CATEGORIES)
