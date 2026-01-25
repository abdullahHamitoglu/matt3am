/**
 * Inventory Items Service
 */

import { BaseService } from './base.service'
import { COLLECTION_ENDPOINTS } from '@/lib/api/endpoints'
import type { InventoryItem } from '@/payload-types'

export const inventoryItemsService = new BaseService<InventoryItem>(
  COLLECTION_ENDPOINTS.INVENTORY_ITEMS,
)
