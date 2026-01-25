/**
 * Reservations Service
 */

import { BaseService } from './base.service'
import { COLLECTION_ENDPOINTS } from '@/lib/api/endpoints'
import type { Reservation } from '@/payload-types'

export const reservationsService = new BaseService<Reservation>(COLLECTION_ENDPOINTS.RESERVATIONS)
