# Seed Data Script

This script seeds essential data for the restaurant management system.

## What it seeds:

### 1. **Permissions** (52 permissions)
All combinations of actions × resources:
- **Actions**: create, read, update, delete, execute
- **Resources**: orders, menu, inventory, reports, users, tables, reservations, payments, kitchen, settings

### 2. **Roles** (6 roles)

#### Administrator
- **All permissions** (full system access)
- Use for: System admins, owners

#### Manager
- All permissions except: Delete Users, Delete Settings
- Use for: Branch managers, supervisors

#### Waiter
- Orders (all actions)
- Tables (all actions)
- Reservations (all actions)
- Menu (read only)
- Use for: Waiters, front-of-house staff

#### Chef
- Kitchen (read, update)
- Menu (read only)
- Inventory (read only)
- Use for: Kitchen staff, cooks

#### Cashier
- Payments (all actions)
- Orders (read, update)
- Use for: Cashiers, payment processing

#### Delivery Driver
- Orders (read, update)
- Use for: Delivery personnel

## How to run:

```bash
# Make sure DATABASE_URL is set in your .env
pnpm seed
```

## What happens:

1. ✅ Creates all 52 permissions (skips if already exist)
2. ✅ Creates 6 roles with appropriate permissions (skips if already exist)
3. ✅ Safe to run multiple times (won't duplicate)

## Next steps after seeding:

1. Start the dev server: `pnpm dev`
2. Go to: http://localhost:3000/admin
3. Create your first admin user
4. Assign **Administrator** role to the user
5. Create restaurants/branches
6. Add categories, menu items, and inventory

## Notes:

- Seed is **idempotent** - safe to run multiple times
- Existing records won't be duplicated
- Requires MongoDB connection (DATABASE_URL in .env)
