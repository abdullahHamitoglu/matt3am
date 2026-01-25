import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/helpers'
import { restaurantScoped } from '@/access/restaurant-scoped'
import { canCreate, canUpdate, canDelete } from '@/access/permissions'

export const Tables: CollectionConfig = {
  slug: 'tables',
  admin: {
    useAsTitle: 'tableNumber',
    defaultColumns: ['tableNumber', 'restaurant', 'zone', 'capacity', 'status'],
    group: 'Management',
  },
  access: {
    read: () => true, // Public can view tables for reservations
    create: ({ req }) => {
      if (!req.user) return false
      if (isAdmin({ req })) return true
      return canCreate('tables')({ req })
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (isAdmin({ req })) return true
      const hasPermission = canUpdate('tables')({ req })
      if (!hasPermission) return false
      return restaurantScoped({ req })
    },
    delete: canDelete('tables'),
  },
  fields: [
    {
      name: 'tableNumber',
      type: 'text',
      required: true,
      label: 'Table Number',
    },
    {
      name: 'restaurant',
      type: 'relationship',
      relationTo: 'restaurants',
      required: true,
      label: 'Branch',
    },
    {
      name: 'zone',
      type: 'select',
      required: true,
      label: 'Zone',
      options: [
        { label: 'Indoor', value: 'indoor' },
        { label: 'Outdoor', value: 'outdoor' },
        { label: 'VIP', value: 'vip' },
        { label: 'Family', value: 'family' },
        { label: 'Singles', value: 'singles' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'capacity',
          type: 'number',
          required: true,
          defaultValue: 4,
          label: 'Number of Seats',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'minCapacity',
          type: 'number',
          defaultValue: 1,
          label: 'Minimum',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'available',
      label: 'Status',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Reserved', value: 'reserved' },
        { label: 'Occupied', value: 'occupied' },
        { label: 'Cleaning', value: 'cleaning' },
        { label: 'Unavailable', value: 'unavailable' },
      ],
    },
    {
      name: 'qrCode',
      type: 'text',
      unique: true,
      label: 'QR Code',
      admin: {
        description: 'Generated automatically',
        readOnly: true,
      },
    },
    {
      name: 'position',
      type: 'group',
      label: 'Position in Floor Plan',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'x',
              type: 'number',
              label: 'X Coordinate',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'y',
              type: 'number',
              label: 'Y Coordinate',
              admin: {
                width: '50%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'features',
      type: 'select',
      hasMany: true,
      label: 'Features',
      options: [
        { label: 'By the Window', value: 'window' },
        { label: 'Private', value: 'private' },
        { label: 'High Chair', value: 'high-chair' },
        { label: 'Wheelchair Accessible', value: 'accessible' },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Generate QR Code automatically on creation
        if (operation === 'create' && !data.qrCode) {
          data.qrCode = `TABLE-${data.restaurant}-${data.tableNumber}-${Date.now()}`
        }
        return data
      },
    ],
  },
  timestamps: true,
}
