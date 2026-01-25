/**
 * Loyalty Program Service
 */

import { BaseService } from './base.service'
import { COLLECTION_ENDPOINTS } from '@/lib/api/endpoints'
import type { LoyaltyProgram } from '@/payload-types'

export const loyaltyProgramService = new BaseService<LoyaltyProgram>(
  COLLECTION_ENDPOINTS.LOYALTY_PROGRAM,
)
