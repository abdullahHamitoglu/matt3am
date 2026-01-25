import type { Currency } from '@/payload-types'

export interface CurrencyFormatOptions {
  currency: Currency | string
  locale?: string
}

/**
 * Format a number with currency symbol
 * @param amount - The amount to format
 * @param options - Currency formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, options: CurrencyFormatOptions): string {
  if (typeof options.currency === 'string') {
    // Fallback for string currency codes (backward compatibility)
    return `${amount.toFixed(2)} ${options.currency}`
  }

  const currency = options.currency
  const locale = options.locale || 'ar-SA'

  // Format the amount with proper decimal digits
  const formattedAmount = amount.toFixed(currency.decimalDigits || 2)

  // Position the symbol based on currency settings
  if (currency.symbolPosition === 'before') {
    return `${currency.symbol}${formattedAmount}`
  } else {
    return `${formattedAmount} ${currency.symbol}`
  }
}

/**
 * Parse a currency-formatted string back to a number
 * @param value - The currency string to parse
 * @returns The numeric value
 */
export function parseCurrency(value: string): number {
  // Remove all non-numeric characters except decimal point and minus
  const cleaned = value.replace(/[^0-9.-]/g, '')
  return parseFloat(cleaned) || 0
}

/**
 * Get currency symbol from currency object or code
 * @param currency - Currency object or code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: Currency | string): string {
  if (typeof currency === 'string') {
    // Fallback symbols for common currencies
    const symbols: Record<string, string> = {
      SAR: 'ر.س',
      USD: '$',
      EUR: '€',
      AED: 'د.إ',
      KWD: 'د.ك',
      BHD: 'د.ب',
      OMR: 'ر.ع',
      QAR: 'ر.ق',
      EGP: 'ج.م',
      TRY: '₺',
    }
    return symbols[currency] || currency
  }

  return currency.symbol
}

/**
 * Calculate discount percentage
 * @param originalPrice - Original price
 * @param discountPrice - Discounted price
 * @returns Discount percentage
 */
export function calculateDiscountPercentage(originalPrice: number, discountPrice: number): number {
  if (originalPrice <= 0) return 0
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
}
