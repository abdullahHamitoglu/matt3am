/**
 * Reviews Service
 */

import { BaseService } from './base.service'
import { COLLECTION_ENDPOINTS } from '@/lib/api/endpoints'
import type { Review } from '@/payload-types'

export const reviewsService = new BaseService<Review>(COLLECTION_ENDPOINTS.REVIEWS)
