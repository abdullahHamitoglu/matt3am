'use client'

import { createCollectionHooks } from '@/hooks/useCollectionHooks'
import { tablesService } from '@/services/tables.service'

export const {
  useCollection: useTables,
  useDetail: useTableDetail,
  useCreate: useCreateTable,
  useUpdate: useUpdateTable,
  useDelete: useDeleteTable,
  queryKeys: tableQueryKeys,
} = createCollectionHooks(tablesService, { collectionKey: 'tables' })
