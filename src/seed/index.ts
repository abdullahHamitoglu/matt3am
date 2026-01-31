import { getPayload } from 'payload'
import config from '@payload-config'

type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'execute'
type PermissionResource =
  | 'orders'
  | 'menu'
  | 'inventory'
  | 'reports'
  | 'users'
  | 'tables'
  | 'reservations'
  | 'payments'
  | 'kitchen'
  | 'settings'

const permissions: Array<{
  name: string
  action: PermissionAction
  resource: PermissionResource
  description: string
}> = [
  // Orders permissions
  {
    name: 'Create Orders',
    action: 'create',
    resource: 'orders',
    description: 'Ability to create new orders',
  },
  {
    name: 'Read Orders',
    action: 'read',
    resource: 'orders',
    description: 'Ability to view orders',
  },
  {
    name: 'Update Orders',
    action: 'update',
    resource: 'orders',
    description: 'Ability to update orders',
  },
  {
    name: 'Delete Orders',
    action: 'delete',
    resource: 'orders',
    description: 'Ability to delete orders',
  },

  // Menu permissions
  {
    name: 'Create Menu Items',
    action: 'create',
    resource: 'menu',
    description: 'Ability to add menu items',
  },
  { name: 'Read Menu', action: 'read', resource: 'menu', description: 'Ability to view menu' },
  {
    name: 'Update Menu Items',
    action: 'update',
    resource: 'menu',
    description: 'Ability to update menu items',
  },
  {
    name: 'Delete Menu Items',
    action: 'delete',
    resource: 'menu',
    description: 'Ability to delete menu items',
  },

  // Inventory permissions
  {
    name: 'Create Inventory',
    action: 'create',
    resource: 'inventory',
    description: 'Ability to add inventory items',
  },
  {
    name: 'Read Inventory',
    action: 'read',
    resource: 'inventory',
    description: 'Ability to view inventory',
  },
  {
    name: 'Update Inventory',
    action: 'update',
    resource: 'inventory',
    description: 'Ability to update inventory',
  },
  {
    name: 'Delete Inventory',
    action: 'delete',
    resource: 'inventory',
    description: 'Ability to delete inventory items',
  },

  // Reports permissions
  {
    name: 'Read Reports',
    action: 'read',
    resource: 'reports',
    description: 'Ability to view reports',
  },
  {
    name: 'Execute Reports',
    action: 'execute',
    resource: 'reports',
    description: 'Ability to generate reports',
  },

  // Users permissions
  {
    name: 'Create Users',
    action: 'create',
    resource: 'users',
    description: 'Ability to create users',
  },
  { name: 'Read Users', action: 'read', resource: 'users', description: 'Ability to view users' },
  {
    name: 'Update Users',
    action: 'update',
    resource: 'users',
    description: 'Ability to update users',
  },
  {
    name: 'Delete Users',
    action: 'delete',
    resource: 'users',
    description: 'Ability to delete users',
  },

  // Tables permissions
  {
    name: 'Create Tables',
    action: 'create',
    resource: 'tables',
    description: 'Ability to create tables',
  },
  {
    name: 'Read Tables',
    action: 'read',
    resource: 'tables',
    description: 'Ability to view tables',
  },
  {
    name: 'Update Tables',
    action: 'update',
    resource: 'tables',
    description: 'Ability to update table status',
  },
  {
    name: 'Delete Tables',
    action: 'delete',
    resource: 'tables',
    description: 'Ability to delete tables',
  },

  // Reservations permissions
  {
    name: 'Create Reservations',
    action: 'create',
    resource: 'reservations',
    description: 'Ability to create reservations',
  },
  {
    name: 'Read Reservations',
    action: 'read',
    resource: 'reservations',
    description: 'Ability to view reservations',
  },
  {
    name: 'Update Reservations',
    action: 'update',
    resource: 'reservations',
    description: 'Ability to update reservations',
  },
  {
    name: 'Delete Reservations',
    action: 'delete',
    resource: 'reservations',
    description: 'Ability to delete reservations',
  },

  // Payments permissions
  {
    name: 'Create Payments',
    action: 'create',
    resource: 'payments',
    description: 'Ability to process payments',
  },
  {
    name: 'Read Payments',
    action: 'read',
    resource: 'payments',
    description: 'Ability to view payments',
  },
  {
    name: 'Update Payments',
    action: 'update',
    resource: 'payments',
    description: 'Ability to update payment status',
  },
  {
    name: 'Delete Payments',
    action: 'delete',
    resource: 'payments',
    description: 'Ability to delete/refund payments',
  },

  // Kitchen permissions
  {
    name: 'Read Kitchen',
    action: 'read',
    resource: 'kitchen',
    description: 'Ability to view kitchen display',
  },
  {
    name: 'Update Kitchen',
    action: 'update',
    resource: 'kitchen',
    description: 'Ability to update order status in kitchen',
  },

  // Settings permissions
  {
    name: 'Read Settings',
    action: 'read',
    resource: 'settings',
    description: 'Ability to view settings',
  },
  {
    name: 'Update Settings',
    action: 'update',
    resource: 'settings',
    description: 'Ability to update settings',
  },
]

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Starting seed process...')

  try {
    // 1. Seed Currencies
    console.log('💱 Seeding currencies...')
    const currencies = [
      {
        code: 'SAR',
        symbol: 'ر.س',
        name: 'Saudi Riyal',
        decimalDigits: 2,
        symbolPosition: 'after' as const,
        isActive: true,
      },
      {
        code: 'USD',
        symbol: '$',
        name: 'US Dollar',
        decimalDigits: 2,
        symbolPosition: 'before' as const,
        isActive: true,
      },
      {
        code: 'EUR',
        symbol: '€',
        name: 'Euro',
        decimalDigits: 2,
        symbolPosition: 'before' as const,
        isActive: true,
      },
      {
        code: 'AED',
        symbol: 'د.إ',
        name: 'UAE Dirham',
        decimalDigits: 2,
        symbolPosition: 'after' as const,
        isActive: true,
      },
      {
        code: 'KWD',
        symbol: 'د.ك',
        name: 'Kuwaiti Dinar',
        decimalDigits: 3,
        symbolPosition: 'after' as const,
        isActive: true,
      },
      {
        code: 'BHD',
        symbol: 'د.ب',
        name: 'Bahraini Dinar',
        decimalDigits: 3,
        symbolPosition: 'after' as const,
        isActive: true,
      },
      {
        code: 'OMR',
        symbol: 'ر.ع',
        name: 'Omani Rial',
        decimalDigits: 3,
        symbolPosition: 'after' as const,
        isActive: true,
      },
      {
        code: 'QAR',
        symbol: 'ر.ق',
        name: 'Qatari Riyal',
        decimalDigits: 2,
        symbolPosition: 'after' as const,
        isActive: true,
      },
      {
        code: 'EGP',
        symbol: 'ج.م',
        name: 'Egyptian Pound',
        decimalDigits: 2,
        symbolPosition: 'after' as const,
        isActive: true,
      },
      {
        code: 'TRY',
        symbol: '₺',
        name: 'Turkish Lira',
        decimalDigits: 2,
        symbolPosition: 'after' as const,
        isActive: true,
      },
    ]

    const createdCurrencies = []
    for (const currency of currencies) {
      try {
        const existing = await payload.find({
          collection: 'currencies',
          where: {
            code: { equals: currency.code },
          },
        })

        if (existing.docs.length === 0) {
          const created = await payload.create({
            collection: 'currencies',
            data: currency,
          })
          createdCurrencies.push(created)
          console.log(`✅ Created currency: ${currency.code} - ${currency.symbol}`)
        } else {
          createdCurrencies.push(existing.docs[0])
          console.log(`⏭️  Currency already exists: ${currency.code}`)
        }
      } catch (error) {
        console.error(`❌ Error creating currency ${currency.code}:`, error)
      }
    }

    // 2. Seed Permissions
    console.log('\n📝 Seeding permissions...')
    const createdPermissions = []

    for (const perm of permissions) {
      try {
        const existing = await payload.find({
          collection: 'permissions',
          where: {
            name: { equals: perm.name },
          },
        })

        if (existing.docs.length === 0) {
          const created = await payload.create({
            collection: 'permissions',
            data: perm,
          })
          createdPermissions.push(created)
          console.log(`✅ Created permission: ${perm.name}`)
        } else {
          createdPermissions.push(existing.docs[0])
          console.log(`⏭️  Permission already exists: ${perm.name}`)
        }
      } catch (error) {
        console.error(`❌ Error creating permission ${perm.name}:`, error)
      }
    }

    console.log(`\n✅ Permissions seeded: ${createdPermissions.length}/${permissions.length}`)

    // 2. Seed Roles
    console.log('\n👥 Seeding roles...')

    // All permission IDs
    const allPermissionIds = createdPermissions.map((p) => p.id)

    // Admin role - all permissions
    const adminRole = {
      name: 'Administrator',
      nameEn: 'Administrator',
      description: 'Full system access with all permissions',
      permissions: allPermissionIds,
      isActive: true,
    }

    // Manager role - most permissions except critical ones
    const managerPermissions = createdPermissions
      .filter((p) => !p.name.includes('Delete Users') && !p.name.includes('Delete Settings'))
      .map((p) => p.id)

    const managerRole = {
      name: 'Manager',
      nameEn: 'Manager',
      description: 'Branch manager with extensive permissions',
      permissions: managerPermissions,
      isActive: true,
    }

    // Waiter role - orders, tables, menu reading
    const waiterPermissions = createdPermissions
      .filter(
        (p) =>
          p.resource === 'orders' ||
          p.resource === 'tables' ||
          p.resource === 'reservations' ||
          (p.resource === 'menu' && p.action === 'read'),
      )
      .map((p) => p.id)

    const waiterRole = {
      name: 'Waiter',
      nameEn: 'Waiter',
      description: 'Take orders, manage tables and reservations',
      permissions: waiterPermissions,
      isActive: true,
    }

    // Chef role - kitchen and menu reading
    const chefPermissions = createdPermissions
      .filter(
        (p) =>
          p.resource === 'kitchen' ||
          (p.resource === 'menu' && p.action === 'read') ||
          (p.resource === 'inventory' && p.action === 'read'),
      )
      .map((p) => p.id)

    const chefRole = {
      name: 'Chef',
      nameEn: 'Chef',
      description: 'Kitchen operations and order preparation',
      permissions: chefPermissions,
      isActive: true,
    }

    // Cashier role - payments, orders reading
    const cashierPermissions = createdPermissions
      .filter(
        (p) =>
          p.resource === 'payments' ||
          (p.resource === 'orders' && (p.action === 'read' || p.action === 'update')),
      )
      .map((p) => p.id)

    const cashierRole = {
      name: 'Cashier',
      nameEn: 'Cashier',
      description: 'Process payments and view orders',
      permissions: cashierPermissions,
      isActive: true,
    }

    // Delivery role - orders and delivery related
    const deliveryPermissions = createdPermissions
      .filter((p) => p.resource === 'orders' && (p.action === 'read' || p.action === 'update'))
      .map((p) => p.id)

    const deliveryRole = {
      name: 'Delivery Driver',
      nameEn: 'Delivery Driver',
      description: 'Delivery operations',
      permissions: deliveryPermissions,
      isActive: true,
    }

    const roles = [adminRole, managerRole, waiterRole, chefRole, cashierRole, deliveryRole]

    for (const role of roles) {
      try {
        const existing = await payload.find({
          collection: 'roles',
          where: {
            name: { equals: role.name },
          },
        })

        if (existing.docs.length === 0) {
          await payload.create({
            collection: 'roles',
            data: role,
          })
          console.log(`✅ Created role: ${role.name} (${role.permissions.length} permissions)`)
        } else {
          console.log(`⏭️  Role already exists: ${role.name}`)
        }
      } catch (error) {
        console.error(`❌ Error creating role ${role.name}:`, error)
      }
    }

    console.log('\n✅ Seed completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   - ${currencies.length} currencies`)
    console.log(`   - ${permissions.length} permissions`)
    console.log(`   - ${roles.length} roles`)
    console.log('\n💡 Next steps:')
    console.log('   1. Create your first admin user')
    console.log('   2. Assign the Administrator role to the user')
    console.log('   3. Create restaurants/branches with default currency')
    console.log('   4. Start adding menu items and inventory')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

seed()
