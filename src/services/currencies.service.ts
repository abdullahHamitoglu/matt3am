import { BaseService } from './base.service'
import type { Currency } from '@/payload-types'

class CurrencyService extends BaseService<Currency> {
  constructor() {
    super('currencies')
  }
}

export const currencyService = new CurrencyService()
