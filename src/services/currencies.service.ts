import { BaseService } from './base.service'
import { COLLECTION_ENDPOINTS } from '@/lib/api/endpoints'
import type { Currency } from '@/payload-types'

class CurrencyService extends BaseService<Currency> {
  constructor() {
    super(COLLECTION_ENDPOINTS.CURRENCIES)
  }
}

export const currencyService = new CurrencyService()
