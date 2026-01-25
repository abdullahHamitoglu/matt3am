import path from 'path'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { r2Storage } from '@payloadcms/storage-r2'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Permissions } from './collections/Permissions'
import { Roles } from './collections/Roles'
import { Restaurants } from './collections/Restaurants'
import { Categories } from './collections/Categories'
import { Currencies } from './collections/Currencies'
import { InventoryItems } from './collections/InventoryItems'
import { MenuItems } from './collections/MenuItems'
import { ProductRecipes } from './collections/ProductRecipes'
import { Tables } from './collections/Tables'
import { Orders } from './collections/Orders'
import { Cart } from './collections/Cart'
import { Reservations } from './collections/Reservations'
import { Reviews } from './collections/Reviews'
import { LoyaltyProgram } from './collections/LoyaltyProgram'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  localization: {
    locales: [
      {
        label: 'العربية',
        code: 'ar',
      },
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Türkçe',
        code: 'tr',
      },
    ],
    defaultLocale: 'ar',
    fallback: true,
  },
  collections: [
    // Core
    Users,
    Media,

    // RBAC
    Permissions,
    Roles,

    // Management
    Restaurants,
    Tables,
    Reservations,
    Reviews,
    LoyaltyProgram,

    // Menu & Inventory
    Categories,
    Currencies,
    MenuItems,
    InventoryItems,
    ProductRecipes,

    // Orders & Cart
    Cart,
    Orders,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  plugins: [
    // Note: R2 storage requires Cloudflare context
    // You may need to configure alternative storage for MongoDB deployment
    // or keep R2 if deploying to Cloudflare with MongoDB
  ],
})
