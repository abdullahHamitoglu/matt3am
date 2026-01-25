import type { CollectionConfig } from 'payload'

export const Cart: CollectionConfig = {
  slug: 'cart',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['user', 'restaurant', 'itemCount', 'total', 'updatedAt'],
    group: 'Orders',
  },
  access: {
    read: ({ req }) => {
      // Public can read their own cart (by session/cookie)
      // Authenticated users can read their own cart
      if (!req.user) return true // Will be filtered by sessionId
      return {
        user: { equals: req.user.id },
      }
    },
    create: () => true, // Anyone can create a cart
    update: ({ req }) => {
      if (!req.user) return true // Guest carts
      return {
        user: { equals: req.user.id },
      }
    },
    delete: ({ req }) => {
      if (!req.user) return true
      return {
        user: { equals: req.user.id },
      }
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'User',
      admin: {
        description: 'Empty for guest users',
      },
    },
    {
      name: 'sessionId',
      type: 'text',
      label: 'Session ID',
      admin: {
        description: 'For guest users - generated from browser',
        readOnly: true,
      },
      index: true,
    },
    {
      name: 'restaurant',
      type: 'relationship',
      relationTo: 'restaurants',
      required: true,
      label: 'Restaurant',
      admin: {
        description: 'All cart items must be from the same restaurant',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Cart Items',
      fields: [
        {
          name: 'menuItem',
          type: 'relationship',
          relationTo: 'menu-items',
          required: true,
          label: 'Menu Item',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'quantity',
              type: 'number',
              required: true,
              defaultValue: 1,
              min: 1,
              label: 'Quantity',
              admin: {
                width: '33%',
              },
            },
            {
              name: 'price',
              type: 'number',
              required: true,
              label: 'Price',
              admin: {
                width: '33%',
                description: 'Price per unit',
              },
            },
            {
              name: 'subtotal',
              type: 'number',
              label: 'Subtotal',
              admin: {
                width: '33%',
                readOnly: true,
              },
            },
          ],
        },
        {
          name: 'customizations',
          type: 'textarea',
          localized: true,
          label: 'Customizations',
          admin: {
            description: 'Example: No onions, Add cheese',
          },
        },
        {
          name: 'specialInstructions',
          type: 'textarea',
          localized: true,
          label: 'Special Instructions',
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
              name: 'subtotal',
              type: 'number',
              defaultValue: 0,
              label: 'Subtotal',
              admin: {
                width: '33%',
                readOnly: true,
              },
            },
            {
              name: 'tax',
              type: 'number',
              defaultValue: 0,
              label: 'Tax',
              admin: {
                width: '33%',
                readOnly: true,
              },
            },
            {
              name: 'total',
              type: 'number',
              defaultValue: 0,
              label: 'Total',
              admin: {
                width: '33%',
                readOnly: true,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'itemCount',
      type: 'number',
      defaultValue: 0,
      label: 'Item Count',
      admin: {
        readOnly: true,
        description: 'Total number of items in cart',
      },
    },
    {
      name: 'couponCode',
      type: 'text',
      label: 'Coupon Code',
    },
    {
      name: 'discount',
      type: 'number',
      defaultValue: 0,
      label: 'Discount Amount',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Expires At',
      admin: {
        description: 'Cart will be automatically cleared after this date',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      label: 'Cart Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Abandoned', value: 'abandoned' },
        { label: 'Converted', value: 'converted' },
        { label: 'Expired', value: 'expired' },
      ],
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Set expiration time for guest carts (24 hours)
        if (operation === 'create' && !data.expiresAt) {
          const expirationDate = new Date()
          expirationDate.setHours(expirationDate.getHours() + 24)
          data.expiresAt = expirationDate
        }

        // Calculate totals
        if (data.items && data.items.length > 0) {
          let subtotal = 0
          let itemCount = 0

          data.items = data.items.map((item: any) => {
            const itemSubtotal = (item.price || 0) * (item.quantity || 1)
            item.subtotal = itemSubtotal
            subtotal += itemSubtotal
            itemCount += item.quantity || 1
            return item
          })

          data.itemCount = itemCount
          data.pricing = data.pricing || {}
          data.pricing.subtotal = subtotal

          // Calculate tax (15% VAT - adjust as needed)
          const taxRate = 0.15
          const tax = subtotal * taxRate
          data.pricing.tax = tax

          // Apply discount if any
          const discount = data.discount || 0

          data.pricing.total = subtotal + tax - discount
        } else {
          data.itemCount = 0
          data.pricing = {
            subtotal: 0,
            tax: 0,
            total: 0,
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, previousDoc }) => {
        // Mark as abandoned if cart hasn't been updated in 1 hour
        if (operation === 'update') {
          const lastUpdate = new Date(doc.updatedAt)
          const now = new Date()
          const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)

          if (hoursSinceUpdate > 1 && doc.status === 'active') {
            console.log(`🛒 Cart ${doc.id} marked as abandoned`)
            // Auto-update is handled elsewhere to prevent infinite loops
          }
        }

        return doc
      },
    ],
  },
  timestamps: true,
}
