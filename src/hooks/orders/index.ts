'use client'

import { createCollectionHooks } from '@/hooks/useCollectionHooks'
import { ordersService } from '@/services/orders.service'

export const {
  useCollection: useOrders,
  useDetail: useOrderDetail,
  useCreate: useCreateOrder,
  useUpdate: useUpdateOrder,
  useDelete: useDeleteOrder,
  queryKeys: orderQueryKeys,
} = createCollectionHooks(ordersService, { collectionKey: 'orders' })
