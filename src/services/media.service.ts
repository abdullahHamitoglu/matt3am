/**
 * Media Service
 */

import { BaseService } from './base.service'
import { COLLECTION_ENDPOINTS } from '@/lib/api/endpoints'
import type { Media } from '@/payload-types'

export const mediaService = new BaseService<Media>(COLLECTION_ENDPOINTS.MEDIA)
