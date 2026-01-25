/**
 * Restaurants Service
 */

import { BaseService } from './base.service'
import { COLLECTION_ENDPOINTS } from '@/lib/api/endpoints'
import type { Restaurant } from '@/payload-types'

export const restaurantsService = new BaseService<Restaurant>(COLLECTION_ENDPOINTS.RESTAURANTS)
