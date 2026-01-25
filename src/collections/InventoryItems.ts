import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/helpers'
import { restaurantScoped } from '@/access/restaurant-scoped'
import { canCreate, canRead, canUpdate, canDelete } from '@/access/permissions'

export const InventoryItems: CollectionConfig = {
  slug: 'inventory-items',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'currentStock', 'unit', 'lowStockThreshold'],
    group: 'Inventory',
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      if (isAdmin({ req })) return true
      const hasPermission = canRead('inventory')({ req })
      if (!hasPermission) return false
      return restaurantScoped({ req })
    },
    create: ({ req }) => {
      if (!req.user) return false
      if (isAdmin({ req })) return true
      return canCreate('inventory')({ req })
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (isAdmin({ req })) return true
      const hasPermission = canUpdate('inventory')({ req })
      if (!hasPermission) return false
      return restaurantScoped({ req })
    },
    delete: canDelete('inventory'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Item Name',
      admin: {
        description: 'Example: Tomatoes, Meat, Olive Oil',
      },
    },
    {
      name: 'sku',
      type: 'text',
      unique: true,
      label: 'Product Code (SKU)',
      admin: {
        description: 'Unique code for inventory tracking',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Category',
      filterOptions: {
        type: {
          equals: 'inventory',
        },
      },
    },
    {
      name: 'restaurant',
      type: 'relationship',
      relationTo: 'restaurants',
      required: true,
      label: 'Branch',
      admin: {
        description: 'Inventory is specific to each branch',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'currentStock',
          type: 'number',
          required: true,
          defaultValue: 0,
          label: 'Current Quantity',
          admin: {
            width: '33%',
            step: 0.01,
          },
        },
        {
          name: 'lowStockThreshold',
          type: 'number',
          required: true,
          defaultValue: 10,
          label: 'Alert Threshold',
          admin: {
            width: '33%',
            description: 'Alert will be sent when reaching this threshold',
          },
        },
        {
          name: 'unit',
          type: 'select',
          required: true,
          defaultValue: 'kg',
          label: 'Unit',
          admin: {
            width: '33%',
          },
          options: [
            { label: 'Kilogram', value: 'kg' },
            { label: 'Gram', value: 'g' },
            { label: 'Liter', value: 'l' },
            { label: 'Milliliter', value: 'ml' },
            { label: 'Piece', value: 'piece' },
            { label: 'Box', value: 'box' },
            { label: 'Bag', value: 'bag' },
          ],
        },
      ],
    },
    {
      name: 'pricing',
      type: 'group',
      label: 'Pricing',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'costPerUnit',
              type: 'number',
              label: 'Cost Per Unit',
              admin: {
                width: '50%',
                step: 0.01,
                description: 'Purchase price',
              },
            },
            {
              name: 'currency',
              type: 'relationship',
              relationTo: 'currencies',
              required: true,
              label: 'Currency',
              admin: {
                width: '50%',
                description: 'Select currency for pricing',
              },
              filterOptions: {
                isActive: {
                  equals: true,
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: 'supplier',
      type: 'group',
      label: 'Supplier Information',
      fields: [
        {
          name: 'supplierName',
          type: 'text',
          label: 'Supplier Name',
        },
        {
          name: 'supplierPhone',
          type: 'text',
          label: 'Supplier Phone',
        },
        {
          name: 'supplierEmail',
          type: 'email',
          label: 'Supplier Email',
        },
      ],
    },
    {
      name: 'storageInfo',
      type: 'group',
      label: 'Storage Information',
      fields: [
        {
          name: 'storageLocation',
          type: 'text',
          localized: true,
          label: 'Storage Location',
          admin: {
            description: 'Example: Refrigerator, Dry Storage, Freezer',
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'expiryDate',
              type: 'date',
              label: 'Expiry Date',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'batchNumber',
              type: 'text',
              label: 'Batch Number',
              admin: {
                width: '50%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Item Image',
    },
    {
      name: 'notes',
      type: 'textarea',
      localized: true,
      label: 'Notes',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        // Send alert when stock is low
        if (doc.currentStock <= doc.lowStockThreshold) {
          // TODO: Send notification to management
          console.log(
            `⚠️ Alert: Item "${doc.name}" reached alert threshold (${doc.currentStock} ${doc.unit})`,
          )
        }
        return doc
      },
    ],
  },
  timestamps: true,
}
