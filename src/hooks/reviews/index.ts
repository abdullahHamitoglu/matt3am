'use client'

import { createCollectionHooks } from '@/hooks/useCollectionHooks'
import { reviewsService } from '@/services/reviews.service'

export const {
  useCollection: useReviews,
  useDetail: useReviewDetail,
  useCreate: useCreateReview,
  useUpdate: useUpdateReview,
  useDelete: useDeleteReview,
  queryKeys: reviewQueryKeys,
} = createCollectionHooks(reviewsService, { collectionKey: 'reviews' })
