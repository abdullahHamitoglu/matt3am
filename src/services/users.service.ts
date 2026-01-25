/**
 * Users Service
 */

import { BaseService } from './base.service'
import { COLLECTION_ENDPOINTS } from '@/lib/api/endpoints'
import type { User } from '@/payload-types'

export const usersService = new BaseService<User>(COLLECTION_ENDPOINTS.USERS)
