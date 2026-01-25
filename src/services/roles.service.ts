/**
 * Roles Service
 */

import { BaseService } from './base.service'
import { COLLECTION_ENDPOINTS } from '@/lib/api/endpoints'
import type { Role } from '@/payload-types'

export const rolesService = new BaseService<Role>(COLLECTION_ENDPOINTS.ROLES)
