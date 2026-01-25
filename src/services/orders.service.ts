/**
 * Orders Service
 */

import { BaseService } from './base.service'
import { COLLECTION_ENDPOINTS } from '@/lib/api/endpoints'
import type { Order } from '@/payload-types'

export const ordersService = new BaseService<Order>(COLLECTION_ENDPOINTS.ORDERS)
