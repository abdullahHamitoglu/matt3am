'use client'

import { createCollectionHooks } from '@/hooks/useCollectionHooks'
import { permissionsService } from '@/services/permissions.service'

export const {
  useCollection: usePermissions,
  useDetail: usePermissionDetail,
  useCreate: useCreatePermission,
  useUpdate: useUpdatePermission,
  useDelete: useDeletePermission,
  queryKeys: permissionQueryKeys,
} = createCollectionHooks(permissionsService, { collectionKey: 'permissions' })
