'use client'

import { createCollectionHooks } from '@/hooks/useCollectionHooks'
import { restaurantsService } from '@/services/restaurants.service'

export const {
  useCollection: useRestaurants,
  useDetail: useRestaurantDetail,
  useCreate: useCreateRestaurant,
  useUpdate: useUpdateRestaurant,
  useDelete: useDeleteRestaurant,
  queryKeys: restaurantQueryKeys,
} = createCollectionHooks(restaurantsService, { collectionKey: 'restaurants' })

// Export the restaurant selection hook
export { useRestaurantSelection } from './useRestaurantSelection'
