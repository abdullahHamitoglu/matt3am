import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/helpers'

export const Restaurants: CollectionConfig = {
  slug: 'restaurants',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'isActive', 'createdAt'],
    group: 'Management',
  },
  access: {
    read: () => true, // Public can view restaurants list
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Branch Name',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'city',
          type: 'text',
          required: true,
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
      name: 'address',
      type: 'textarea',
      required: true,
      localized: true,
      label: 'Detailed Address',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'latitude',
          type: 'number',
          label: 'Latitude',
          admin: {
            width: '50%',
            description: 'For map display',
          },
        },
        {
          name: 'longitude',
          type: 'number',
          label: 'Longitude',
          admin: {
            width: '50%',
            description: 'For map display',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'phone',
          type: 'text',
          required: true,
          label: 'Phone Number',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'workingHours',
      type: 'group',
      label: 'Working Hours',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'openTime',
              type: 'text',
              label: 'Opening Time',
              admin: {
                width: '50%',
                placeholder: '09:00 AM',
              },
            },
            {
              name: 'closeTime',
              type: 'text',
              label: 'Closing Time',
              admin: {
                width: '50%',
                placeholder: '11:00 PM',
              },
            },
          ],
        },
        {
          name: 'closedDays',
          type: 'select',
          hasMany: true,
          label: 'Closed Days',
          options: [
            { label: 'Saturday', value: 'saturday' },
            { label: 'Sunday', value: 'sunday' },
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
          ],
        },
      ],
    },
    {
      name: 'features',
      type: 'group',
      label: 'Available Features',
      fields: [
        {
          name: 'hasDineIn',
          type: 'checkbox',
          defaultValue: true,
          label: 'Dine-In Service',
        },
        {
          name: 'hasTakeaway',
          type: 'checkbox',
          defaultValue: true,
          label: 'Takeaway Service',
        },
        {
          name: 'hasDelivery',
          type: 'checkbox',
          defaultValue: false,
          label: 'Delivery Service',
        },
        {
          name: 'hasReservation',
          type: 'checkbox',
          defaultValue: true,
          label: 'Reservation System',
        },
        {
          name: 'hasQROrdering',
          type: 'checkbox',
          defaultValue: true,
          label: 'QR Code Ordering',
        },
      ],
    },
    {
      name: 'capacity',
      type: 'group',
      label: 'Capacity',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'totalTables',
              type: 'number',
              label: 'Number of Tables',
              admin: {
                width: '33%',
              },
            },
            {
              name: 'totalSeats',
              type: 'number',
              label: 'Number of Seats',
              admin: {
                width: '33%',
              },
            },
            {
              name: 'parkingSpaces',
              type: 'number',
              label: 'Parking Spaces',
              admin: {
                width: '33%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'defaultCurrency',
      type: 'relationship',
      relationTo: 'currencies',
      required: true,
      label: 'Default Currency',
      admin: {
        description: 'Default currency for this restaurant branch',
      },
      filterOptions: {
        isActive: {
          equals: true,
        },
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Branch Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          localized: true,
          label: 'Description',
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Disabling the branch hides it from the app',
      },
    },
  ],
  timestamps: true,
}
