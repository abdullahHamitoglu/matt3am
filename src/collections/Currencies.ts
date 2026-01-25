import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/helpers'

interface CurrencyData {
  code?: string
  symbol?: string
  isActive?: boolean
  name?: string
  decimalDigits?: number
  symbolPosition?: string
  exchangeRate?: number
  lastUpdated?: string
}

export const Currencies: CollectionConfig = {
  slug: 'currencies',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['code', 'name', 'symbol', 'isActive'],
    group: 'Settings',
    description: 'Manage available currencies for your restaurants',
  },
  access: {
    // Public can view currencies
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'code',
          type: 'text',
          required: true,
          unique: true,
          label: 'Currency Code',
          admin: {
            width: '33%',
            description: 'ISO 4217 code (e.g., USD, SAR, EUR)',
          },
          validate: (value: string) => {
            if (!value) return 'Currency code is required'
            if (!/^[A-Z]{3}$/.test(value)) {
              return 'Currency code must be 3 uppercase letters (e.g., USD, SAR)'
            }
            return true
          },
        },
        {
          name: 'symbol',
          type: 'text',
          required: true,
          label: 'Symbol',
          admin: {
            width: '33%',
            description: 'Currency symbol (e.g., $, ر.س, €)',
          },
        },
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: true,
          label: 'Active',
          admin: {
            width: '33%',
            description: 'Only active currencies can be used',
          },
        },
      ],
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Currency Name',
      admin: {
        description: 'Full name of the currency (e.g., US Dollar, Saudi Riyal)',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'decimalDigits',
          type: 'number',
          defaultValue: 2,
          min: 0,
          max: 4,
          label: 'Decimal Digits',
          admin: {
            width: '50%',
            description: 'Number of decimal places (usually 2)',
          },
        },
        {
          name: 'symbolPosition',
          type: 'select',
          defaultValue: 'after',
          label: 'Symbol Position',
          admin: {
            width: '50%',
            description: 'Where to place the symbol',
          },
          options: [
            { label: 'Before Amount ($100)', value: 'before' },
            { label: 'After Amount (100 ر.س)', value: 'after' },
          ] as Array<{ label: string; value: string }>,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'exchangeRate',
          type: 'number',
          label: 'Exchange Rate to Base',
          admin: {
            width: '50%',
            step: 0.000001,
            description: 'Exchange rate to base currency (optional)',
          },
        },
        {
          name: 'lastUpdated',
          type: 'date',
          label: 'Rate Last Updated',
          admin: {
            width: '50%',
            readOnly: true,
            description: 'Last time exchange rate was updated',
          },
        },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }: { data: CurrencyData; operation: 'create' | 'update' }) => {
        // Ensure currency code is always uppercase
        if (data.code) {
          data.code = data.code.toUpperCase()
        }

        // Update lastUpdated when exchange rate changes
        if (data.exchangeRate && operation === 'update') {
          data.lastUpdated = new Date().toISOString()
        }

        return data
      },
    ],
  },
}
