'use client'

import { createCollectionHooks } from '@/hooks/useCollectionHooks'
import { menuItemsService } from '@/services/menu-items.service'

export const {
  useCollection: useMenuItems,
  useDetail: useMenuItemDetail,
  useCreate: useCreateMenuItem,
  useUpdate: useUpdateMenuItem,
  useDelete: useDeleteMenuItem,
  queryKeys: menuItemQueryKeys,
} = createCollectionHooks(menuItemsService, { collectionKey: 'menu-items' })
