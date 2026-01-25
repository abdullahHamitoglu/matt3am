'use client'

import { createCollectionHooks } from '@/hooks/useCollectionHooks'
import { reservationsService } from '@/services/reservations.service'

export const {
  useCollection: useReservations,
  useDetail: useReservationDetail,
  useCreate: useCreateReservation,
  useUpdate: useUpdateReservation,
  useDelete: useDeleteReservation,
  queryKeys: reservationQueryKeys,
} = createCollectionHooks(reservationsService, { collectionKey: 'reservations' })
