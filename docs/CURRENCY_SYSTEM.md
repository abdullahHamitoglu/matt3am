# Currency System

## Overview
The currency system allows you to manage multiple currencies dynamically. You can add, remove, or deactivate currencies as needed through the admin panel.

## Features

- ✅ Dynamic currency management (add/remove currencies)
- ✅ Support for multiple currencies (SAR, USD, EUR, AED, KWD, BHD, OMR, QAR, EGP, TRY, etc.)
- ✅ Customizable currency symbols and positioning
- ✅ Configurable decimal digits per currency
- ✅ Active/inactive status for currencies
- ✅ Exchange rate tracking (optional)
- ✅ Integrated with MenuItems, InventoryItems, and Restaurants

## Default Currencies

The seed includes these currencies by default:

| Code | Symbol | Name | Decimal Digits |
|------|--------|------|----------------|
| SAR | ر.س | Saudi Riyal | 2 |
| USD | $ | US Dollar | 2 |
| EUR | € | Euro | 2 |
| AED | د.إ | UAE Dirham | 2 |
| KWD | د.ك | Kuwaiti Dinar | 3 |
| BHD | د.ب | Bahraini Dinar | 3 |
| OMR | ر.ع | Omani Rial | 3 |
| QAR | ر.ق | Qatari Riyal | 2 |
| EGP | ج.م | Egyptian Pound | 2 |
| TRY | ₺ | Turkish Lira | 2 |

## Usage

### 1. Managing Currencies

Navigate to **Settings > Currencies** in the admin panel to:
- Add new currencies
- Edit existing currencies
- Activate/deactivate currencies
- Update exchange rates

### 2. Setting Restaurant Currency

When creating or editing a restaurant:
1. Go to **Management > Restaurants**
2. Select the **Default Currency** for the branch
3. Only active currencies will be available

### 3. Menu Item Pricing

When creating menu items:
1. Enter the price
2. Select the currency (filtered to active currencies only)
3. Optionally add a discount price

### 4. Using in Components

```tsx
import type { Currency } from '@/payload-types'
import { formatCurrency } from '@/lib/currency'

// Example 1: With Currency object
const price = 9.99
const currency: Currency = {
  code: 'SAR',
  symbol: 'ر.س',
  decimalDigits: 2,
  symbolPosition: 'after',
  // ... other fields
}

const formattedPrice = formatCurrency(price, { currency })
// Output: "9.99 ر.س"

// Example 2: With currency code (backward compatibility)
const formattedPriceSimple = formatCurrency(price, { currency: 'SAR' })
// Output: "9.99 SAR"
```

### 5. ProductCard Component

```tsx
import ProductCard from '@/components/product/ProductCard'

<ProductCard
  name="معكرونة مع الخضار"
  description="معكرونة - جبنة"
  price={9.99}
  currency={currencyObject} // Can be Currency object or string code
  discountPrice={7.99} // Optional
  image="/path/to/image.jpg"
  onAddToCart={(quantity) => {
    console.log('Added to cart:', quantity)
  }}
/>
```

## Helper Functions

### `formatCurrency(amount, options)`
Format a number with the appropriate currency symbol and formatting.

**Parameters:**
- `amount` (number): The amount to format
- `options.currency` (Currency | string): Currency object or code
- `options.locale` (string, optional): Locale for formatting (default: 'ar-SA')

**Returns:** Formatted currency string

### `getCurrencySymbol(currency)`
Get the currency symbol from a currency object or code.

**Parameters:**
- `currency` (Currency | string): Currency object or code

**Returns:** Currency symbol string

### `calculateDiscountPercentage(originalPrice, discountPrice)`
Calculate the discount percentage.

**Parameters:**
- `originalPrice` (number): Original price
- `discountPrice` (number): Discounted price

**Returns:** Discount percentage as a number

### `parseCurrency(value)`
Parse a currency-formatted string back to a number.

**Parameters:**
- `value` (string): Currency string to parse

**Returns:** Numeric value

## Adding New Currencies

1. Go to **Settings > Currencies** in the admin panel
2. Click **Create New**
3. Fill in the required fields:
   - **Currency Code**: 3-letter ISO code (e.g., JPY, GBP)
   - **Symbol**: Currency symbol (e.g., ¥, £)
   - **Name**: Full currency name (supports localization)
   - **Decimal Digits**: Number of decimal places (usually 2, but some use 0 or 3)
   - **Symbol Position**: Before or after the amount
   - **Active**: Check to make it available for use
4. Optionally add exchange rate information
5. Save

## Migration from Hardcoded Currencies

If you have existing data with hardcoded currency codes:

1. Run the seed to create currency records:
   ```bash
   npm run seed
   ```

2. Update existing records to reference currency IDs instead of codes through the admin panel or a migration script

## Best Practices

- Always set at least one currency as active
- Keep exchange rates updated if using multi-currency features
- Use the default currency setting in restaurants for consistent pricing
- Test currency formatting in both RTL (Arabic) and LTR (English) layouts
- Consider timezone when updating exchange rates

## API Examples

### Get all active currencies
```typescript
const currencies = await payload.find({
  collection: 'currencies',
  where: {
    isActive: { equals: true }
  }
})
```

### Get menu items with currency info
```typescript
const menuItems = await payload.find({
  collection: 'menu-items',
  depth: 2 // Include currency relationship
})
```

## Troubleshooting

**Issue: Currency not showing in dropdown**
- Check if the currency is marked as active
- Verify the currency exists in the database

**Issue: Wrong currency format**
- Check the `symbolPosition` setting for the currency
- Verify `decimalDigits` is set correctly

**Issue: Exchange rate not updating**
- The `lastUpdated` field is automatically set when updating `exchangeRate`
- You may need to manually update exchange rates through the admin panel or API
