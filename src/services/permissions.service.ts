/**
 * Permissions Service
 */

import { BaseService } from './base.service'
import { COLLECTION_ENDPOINTS } from '@/lib/api/endpoints'
import type { Permission } from '@/payload-types'

export const permissionsService = new BaseService<Permission>(COLLECTION_ENDPOINTS.PERMISSIONS)
