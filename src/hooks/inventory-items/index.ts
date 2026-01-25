'use client'

import { createCollectionHooks } from '@/hooks/useCollectionHooks'
import { inventoryItemsService } from '@/services/inventory-items.service'

export const {
  useCollection: useInventoryItems,
  useDetail: useInventoryItemDetail,
  useCreate: useCreateInventoryItem,
  useUpdate: useUpdateInventoryItem,
  useDelete: useDeleteInventoryItem,
  queryKeys: inventoryItemQueryKeys,
} = createCollectionHooks(inventoryItemsService, { collectionKey: 'inventory-items' })
