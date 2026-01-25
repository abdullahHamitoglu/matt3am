/**
 * Menu Items Service
 */

import { BaseService } from './base.service'
import { COLLECTION_ENDPOINTS } from '@/lib/api/endpoints'
import type { MenuItem } from '@/payload-types'

export const menuItemsService = new BaseService<MenuItem>(COLLECTION_ENDPOINTS.MENU_ITEMS)
