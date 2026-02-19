'use client'

import { createCollectionHooks } from '@/hooks/useCollectionHooks'
import { currencyService } from '@/services/currencies.service'

export const {
  useCollection: useCurrencies,
  useDetail: useCurrencyDetail,
  useCreate: useCreateCurrency,
  useUpdate: useUpdateCurrency,
  useDelete: useDeleteCurrency,
  queryKeys: currencyQueryKeys,
} = createCollectionHooks(currencyService, { collectionKey: 'currencies' })

export { useCurrencySelection } from './useCurrencySelection'
