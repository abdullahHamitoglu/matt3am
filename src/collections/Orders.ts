import type { CollectionConfig } from 'payload'
import { isAuthenticated, isAdmin } from '@/access/helpers'
import { restaurantScoped } from '@/access/restaurant-scoped'
import { canCreate, canUpdate, canDelete } from '@/access/permissions'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'restaurant', 'orderType', 'status', 'total'],
    group: 'Orders',
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      // Admin sees all, others see only their restaurant's orders
      if (isAdmin({ req })) return true
      return restaurantScoped({ req })
    },
    create: ({ req }) => {
      // Public can create orders OR authenticated users with permission
      if (!req.user) return true // Allow customer orders
      return canCreate('orders')({ req })
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (isAdmin({ req })) return true
      // Users can update only their restaurant's orders
      const hasPermission = canUpdate('orders')({ req })
      if (!hasPermission) return false
      return restaurantScoped({ req })
    },
    delete: canDelete('orders'),
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      unique: true,
      label: 'Order Number',
      admin: {
        readOnly: true,
        description: 'Generated automatically',
      },
    },
    {
      name: 'restaurant',
      type: 'relationship',
      relationTo: 'restaurants',
      required: true,
      label: 'Branch',
    },
    {
      name: 'customer',
      type: 'group',
      label: 'Customer Information',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              label: 'Name',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'phone',
              type: 'text',
              required: true,
              label: 'Phone Number',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
        },
      ],
    },
    {
      name: 'orderType',
      type: 'select',
      required: true,
      defaultValue: 'dine-in',
      label: 'Order Type',
      options: [
        { label: 'Dine-In', value: 'dine-in' },
        { label: 'Takeaway', value: 'takeaway' },
        { label: 'Delivery', value: 'delivery' },
      ],
    },
    {
      name: 'table',
      type: 'relationship',
      relationTo: 'tables',
      label: 'Table',
      admin: {
        condition: (data) => data.orderType === 'dine-in',
        description: 'For dine-in orders only',
      },
    },
    {
      name: 'deliveryAddress',
      type: 'group',
      label: 'Delivery Address',
      admin: {
        condition: (data) => data.orderType === 'delivery',
      },
      fields: [
        {
          name: 'street',
          type: 'text',
          localized: true,
          label: 'Street',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'city',
              type: 'text',
              localized: true,
              label: 'City',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'district',
              type: 'text',
              localized: true,
              label: 'District',
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'notes',
          type: 'textarea',
          localized: true,
          label: 'Address Notes',
        },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      label: 'Items',
      fields: [
        {
          name: 'menuItem',
          type: 'relationship',
          relationTo: 'menu-items',
          required: true,
          label: 'Item',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'quantity',
              type: 'number',
              required: true,
              defaultValue: 1,
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
        {
          name: 'kitchenStatus',
          type: 'select',
          defaultValue: 'pending',
          label: 'Kitchen Status',
          options: [
            { label: 'Pending', value: 'pending' },
            { label: 'Preparing', value: 'preparing' },
            { label: 'Ready', value: 'ready' },
            { label: 'Served', value: 'served' },
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
              name: 'subtotal',
              type: 'number',
              label: 'Subtotal',
              admin: {
                width: '25%',
                readOnly: true,
              },
            },
            {
              name: 'tax',
              type: 'number',
              defaultValue: 0,
              label: 'Tax',
              admin: {
                width: '25%',
              },
            },
            {
              name: 'discount',
              type: 'number',
              defaultValue: 0,
              label: 'Discount',
              admin: {
                width: '25%',
              },
            },
            {
              name: 'total',
              type: 'number',
              label: 'Total',
              admin: {
                width: '25%',
                readOnly: true,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Order Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Preparing', value: 'preparing' },
        { label: 'Ready', value: 'ready' },
        { label: 'Served', value: 'served' },
        { label: 'Out for Delivery', value: 'delivering' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'paymentStatus',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Payment Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Partially Paid', value: 'partially-paid' },
        { label: 'Refunded', value: 'refunded' },
      ],
    },
    {
      name: 'paymentMethod',
      type: 'select',
      label: 'Payment Method',
      options: [
        { label: 'Cash', value: 'cash' },
        { label: 'Credit Card', value: 'credit-card' },
        { label: 'E-Wallet', value: 'e-wallet' },
        { label: 'Bank Transfer', value: 'bank-transfer' },
      ],
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      label: 'Assigned Employee',
      admin: {
        description: 'Waiter or delivery driver',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      localized: true,
      label: 'Notes',
    },
    {
      name: 'estimatedTime',
      type: 'number',
      label: 'Estimated Time (minutes)',
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Generate order number automatically
        if (operation === 'create' && !data.orderNumber) {
          const date = new Date()
          const timestamp = date.getTime()
          data.orderNumber = `ORD-${timestamp}`
        }

        // Calculate subtotal and total
        if (data.items && data.items.length > 0) {
          let subtotal = 0

          data.items = data.items.map((item: any) => {
            const itemSubtotal = (item.price || 0) * (item.quantity || 1)
            item.subtotal = itemSubtotal
            subtotal += itemSubtotal
            return item
          })

          data.pricing = data.pricing || {}
          data.pricing.subtotal = subtotal

          const tax = data.pricing.tax || 0
          const discount = data.pricing.discount || 0
          data.pricing.total = subtotal + tax - discount
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, req, operation, previousDoc }) => {
        // Deduct inventory when order is confirmed
        if (doc.status === 'confirmed' && previousDoc?.status !== 'confirmed') {
          console.log(`✅ Order confirmed: ${doc.orderNumber} - Inventory will be deducted`)
          // TODO: Implement inventory deduction logic from ProductRecipes
        }

        // Send notification to kitchen
        if (doc.status === 'confirmed') {
          console.log(`🔔 Kitchen notification: New order ${doc.orderNumber}`)
        }

        return doc
      },
    ],
  },
  timestamps: true,
}
