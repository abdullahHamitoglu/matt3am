'use client'

import { createCollectionHooks } from '@/hooks/useCollectionHooks'
import { mediaService } from '@/services/media.service'

export const {
  useCollection: useMedia,
  useDetail: useMediaDetail,
  useCreate: useCreateMedia,
  useUpdate: useUpdateMedia,
  useDelete: useDeleteMedia,
  queryKeys: mediaQueryKeys,
} = createCollectionHooks(mediaService, { collectionKey: 'media' })
