'use client'

import { createCollectionHooks } from '@/hooks/useCollectionHooks'
import { usersService } from '@/services/users.service'

export const {
  useCollection: useUsers,
  useDetail: useUserDetail,
  useCreate: useCreateUser,
  useUpdate: useUpdateUser,
  useDelete: useDeleteUser,
  queryKeys: userQueryKeys,
} = createCollectionHooks(usersService, { collectionKey: 'users' })
