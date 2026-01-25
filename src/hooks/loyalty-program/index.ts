'use client'

import { createCollectionHooks } from '@/hooks/useCollectionHooks'
import { loyaltyProgramService } from '@/services/loyalty-program.service'

export const {
  useCollection: useLoyaltyPrograms,
  useDetail: useLoyaltyProgramDetail,
  useCreate: useCreateLoyaltyProgram,
  useUpdate: useUpdateLoyaltyProgram,
  useDelete: useDeleteLoyaltyProgram,
  queryKeys: loyaltyProgramQueryKeys,
} = createCollectionHooks(loyaltyProgramService, { collectionKey: 'loyalty-program' })
