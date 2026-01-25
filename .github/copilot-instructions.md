# Copilot Instructions - Matt3am Restaurant Management System

## Project Overview

Matt3am is a **multi-restaurant management system** built with:
- **Payload CMS 3.x** (headless CMS with MongoDB adapter)
- **Next.js 16** (App Router with React 19)
- **next-intl** for i18n (Arabic primary, English, Turkish)
- **Cloudflare Workers** deployment target (with R2 storage)
- **RBAC system** with restaurant-scoped permissions

## Architecture Patterns

### Service Layer Pattern
All data access goes through services extending `BaseService`:
```typescript
// src/services/*.service.ts
class MenuItemsService extends BaseService<MenuItem> {
  constructor() { super('/api/menu-items') }
  // Custom methods here
}
```
- **Never** call Payload directly from frontend components
- Use `apiClient` (axios wrapper) in services for API routes
- Services handle REST endpoints, not Payload Local API

### Multi-Tenant Restaurant Scoping
All major collections use `restaurant-scoped.ts` access control:
```typescript
// Users are assigned to restaurants, data is filtered automatically
access: { read: restaurantScoped }
```
- Admin role bypasses restaurant filters (see `src/access/helpers.ts`)
- Always include `restaurant` field in create operations
- Guest carts use `sessionId` instead of `user` (see Cart collection)

### Collections Architecture
Three logical groups:
1. **Core**: Users, Media (uploads to R2)
2. **RBAC**: Permissions, Roles (seeded via `pnpm seed`)
3. **Restaurant Operations**: Restaurants, MenuItems, Orders, Cart, Tables, Reservations, etc.

See `src/payload.config.ts` for full collection list.

## Critical Workflows

### Development Commands
```bash
pnpm dev              # Next.js dev server (localhost:3000)
pnpm seed             # Seed permissions/roles (idempotent)
pnpm generate:types   # Regenerate payload-types.ts + cloudflare-env.d.ts
pnpm test             # Run vitest + playwright
```

### After Schema Changes
1. Run `pnpm generate:types` to update `src/payload-types.ts`
2. Restart dev server if collection configs changed
3. Check existing access controls don't break new fields

### Cart & Orders Flow
```typescript
// 1. Frontend uses hooks (useCart, useCheckout)
const { addToCart, cart } = useCart({ restaurantId, autoLoad: true })

// 2. Hooks call services
await cartService.addItem(cartId, { menuItem, quantity, ... })

// 3. Services hit API routes
POST /api/cart/:id/add-item

// 4. API routes use Payload Local API with access control
const payload = await getPayload({ config })
await payload.update({ collection: 'cart', id, data })
```

Guest carts: Auto-generate `sessionId` in localStorage (see `src/hooks/cart/useCart.ts`)

## Project-Specific Conventions

### Localization
- **Default locale**: Arabic (`ar`)
- Localized fields in collections use `localized: true`
- Frontend message files: `messages/{ar,en,tr}.json`
- Routing: `app/(frontend)/[locale]/...` (next-intl routing)
- **Note**: Payload admin UI locale !== frontend locale (configured separately)

### Currency System
Multi-currency support with `Currencies` collection:
```typescript
// Always use lib/currency.ts helpers
import { formatCurrency } from '@/lib/currency'
formatCurrency(price, { currency: currencyDoc, locale: 'ar-SA' })
```
Symbol position and decimal digits are per-currency settings.

### Access Control Layers
1. **Collection-level**: `access: { create, read, update, delete }`
2. **Field-level**: `fields: [{ access: { read, update } }]`
3. **Restaurant-scoped**: Filters data by user's assigned restaurants

**Important**: Local API (`getPayload`) bypasses access by default. For programmatic access with checks, pass `user` and set `overrideAccess: false`.

### Hook Patterns
- Use `context` to prevent hook loops (e.g., `context.skipNotification`)
- Always pass `req` to nested Payload operations for transaction safety
- `beforeChange` hooks return modified `data`, `afterChange` returns `doc`

Example from existing hooks:
```typescript
beforeChange: [
  async ({ data, req, operation }) => {
    if (operation === 'create') {
      data.calculatedField = computeValue(data)
    }
    return data
  }
]
```

## Testing & Debugging

### Test Structure
- **Integration**: `tests/int/api.int.spec.ts` (Vitest, direct Payload API calls)
- **E2E**: `tests/e2e/*.e2e.spec.ts` (Playwright, full browser testing)

### Common Issues
- **GraphQL not working**: Known Cloudflare Workers limitation (use REST API)
- **Bundle size**: Cloudflare 3MB limit on free tier (use paid Workers)
- **Missing types**: Run `pnpm generate:types` after collection changes
- **Access denied**: Check if user has correct role/restaurant assignment

## Key Files Reference

| Purpose | File | Notes |
|---------|------|-------|
| Main config | `src/payload.config.ts` | All collections registered here |
| Access helpers | `src/access/restaurant-scoped.ts` | Multi-tenant logic |
| Service base | `src/services/base.service.ts` | Extend for all services |
| Cart system | `docs/CART_AND_ORDERS_SYSTEM.md` | Full architecture docs |
| Seed script | `src/seed/index.ts` | Creates roles/permissions |
| Type defs | `src/payload-types.ts` | Auto-generated, don't edit |

## Don't Do
- ❌ Call Payload directly from client components (use services)
- ❌ Edit `payload-types.ts` manually (regenerate with script)
- ❌ Skip `restaurant` field in restaurant-scoped collections
- ❌ Use generic advice patterns (e.g., "add error handling") - follow existing service patterns
- ❌ Forget `pnpm generate:types` after schema changes

## Do
- ✅ Extend `BaseService` for new collections
- ✅ Use `useCart`, `useCheckout` hooks for cart operations
- ✅ Test with `pnpm seed` to get fresh RBAC data
- ✅ Check `.cursor/rules/*.md` for detailed Payload patterns
- ✅ Use `formatCurrency` helper for all price displays
- ✅ Pass `req` object through hook chains for transaction safety
