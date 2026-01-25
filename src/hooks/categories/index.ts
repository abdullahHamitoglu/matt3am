'use client'

import { createCollectionHooks } from '@/hooks/useCollectionHooks'
import { categoriesService } from '@/services/categories.service'

export const {
  useCollection: useCategories,
  useDetail: useCategoryDetail,
  useCreate: useCreateCategory,
  useUpdate: useUpdateCategory,
  useDelete: useDeleteCategory,
  queryKeys: categoryQueryKeys,
} = createCollectionHooks(categoriesService, { collectionKey: 'categories' })
