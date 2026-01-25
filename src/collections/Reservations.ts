import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/helpers'
import { restaurantScoped } from '@/access/restaurant-scoped'
import { canUpdate, canDelete } from '@/access/permissions'

export const Reservations: CollectionConfig = {
  slug: 'reservations',
  admin: {
    useAsTitle: 'confirmationCode',
    defaultColumns: ['confirmationCode', 'restaurant', 'reservationDate', 'guestCount', 'status'],
    group: 'Management',
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      // Admin sees all
      if (isAdmin({ req })) return true
      // Staff sees only their restaurant's reservations
      return restaurantScoped({ req })
    },
    create: () => true, // Allow customers to create reservations
    update: ({ req }) => {
      if (!req.user) return false
      // Admin can update all
      if (isAdmin({ req })) return true
      // Staff with permission can update their restaurant's reservations
      const hasPermission = canUpdate('reservations')({ req })
      if (!hasPermission) return false
      return restaurantScoped({ req })
    },
    delete: ({ req }) => {
      if (!req.user) return false
      // Admin can delete all
      if (isAdmin({ req })) return true
      // Staff with permission can delete
      return canDelete('reservations')({ req })
    },
  },
  fields: [
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
      type: 'row',
      fields: [
        {
          name: 'reservationDate',
          type: 'date',
          required: true,
          label: 'Date',
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
        {
          name: 'duration',
          type: 'number',
          defaultValue: 90,
          label: 'Duration (minutes)',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'guestCount',
          type: 'number',
          required: true,
          defaultValue: 2,
          label: 'Number of Guests',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'childrenCount',
          type: 'number',
          defaultValue: 0,
          label: 'Number of Children',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'preferredTable',
      type: 'relationship',
      relationTo: 'tables',
      label: 'Preferred Table',
      admin: {
        description: 'Optional - A specific table can be assigned',
      },
    },
    {
      name: 'preferences',
      type: 'group',
      label: 'Preferences',
      fields: [
        {
          name: 'seatingPreference',
          type: 'select',
          label: 'Seating Preference',
          options: [
            { label: 'Indoor', value: 'indoor' },
            { label: 'Outdoor', value: 'outdoor' },
            { label: 'By the Window', value: 'window' },
            { label: 'VIP', value: 'vip' },
            { label: 'Family', value: 'family' },
          ],
        },
        {
          name: 'occasion',
          type: 'select',
          label: 'Occasion',
          options: [
            { label: 'Regular', value: 'regular' },
            { label: 'Birthday', value: 'birthday' },
            { label: 'Anniversary', value: 'anniversary' },
            { label: 'Business', value: 'business' },
            { label: 'Celebration', value: 'celebration' },
          ],
        },
        {
          name: 'specialRequests',
          type: 'textarea',
          localized: true,
          label: 'Special Requests',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Seated', value: 'seated' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'No-Show', value: 'no-show' },
      ],
    },
    {
      name: 'confirmationCode',
      type: 'text',
      unique: true,
      label: 'Confirmation Code',
      admin: {
        readOnly: true,
        description: 'Generated automatically',
      },
    },
    {
      name: 'reminderSent',
      type: 'checkbox',
      defaultValue: false,
      label: 'Reminder Sent',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Staff Notes',
      admin: {
        description: 'Internal notes - Not visible to customers',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Generate confirmation code
        if (operation === 'create' && !data.confirmationCode) {
          const code = Math.random().toString(36).substring(2, 8).toUpperCase()
          data.confirmationCode = `RES-${code}`
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, previousDoc }) => {
        // Send notification when confirmed
        if (doc.status === 'confirmed' && previousDoc?.status !== 'confirmed') {
          console.log(`✅ Reservation confirmed: ${doc.confirmationCode}`)
          // TODO: Send SMS or Email to customer
        }

        // Update table status
        if (doc.status === 'seated' && doc.preferredTable) {
          console.log(`🪑 Update table status to "reserved"`)
          // TODO: Update table status
        }

        return doc
      },
    ],
  },
  timestamps: true,
}
