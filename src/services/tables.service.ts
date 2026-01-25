/**
 * Tables Service
 */

import { BaseService } from './base.service'
import { COLLECTION_ENDPOINTS } from '@/lib/api/endpoints'
import type { Table } from '@/payload-types'

export const tablesService = new BaseService<Table>(COLLECTION_ENDPOINTS.TABLES)
