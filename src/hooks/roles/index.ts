'use client'

import { createCollectionHooks } from '@/hooks/useCollectionHooks'
import { rolesService } from '@/services/roles.service'

export const {
  useCollection: useRoles,
  useDetail: useRoleDetail,
  useCreate: useCreateRole,
  useUpdate: useUpdateRole,
  useDelete: useDeleteRole,
  queryKeys: roleQueryKeys,
} = createCollectionHooks(rolesService, { collectionKey: 'roles' })
