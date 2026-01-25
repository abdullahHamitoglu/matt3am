import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/helpers'
import { restaurantScoped, userOwned } from '@/access/restaurant-scoped'
import { canUpdate, canDelete } from '@/access/permissions'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  admin: {
    useAsTitle: 'restaurant',
    defaultColumns: ['restaurant', 'rating', 'status', 'createdAt'],
    group: 'Management',
  },
  access: {
    read: () => true, // Reviews are public
    create: () => true, // Anyone can add a review
    update: ({ req }) => {
      if (!req.user) return false
      // Admin can update all reviews
      if (isAdmin({ req })) return true
      // Staff with permission can update restaurant reviews
      const hasPermission = canUpdate('reviews')({ req })
      if (hasPermission) {
        return restaurantScoped({ req })
      }
      // Users can update their own reviews
      return userOwned({ req })
    },
    delete: ({ req }) => {
      if (!req.user) return false
      // Admin can delete all
      if (isAdmin({ req })) return true
      // Staff with permission can delete
      return canDelete('reviews')({ req })
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
      name: 'order',
      type: 'relationship',
      relationTo: 'orders',
      label: 'Order',
      admin: {
        description: 'Order associated with the review (optional)',
      },
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
      name: 'ratings',
      type: 'group',
      label: 'Ratings',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'overall',
              type: 'number',
              required: true,
              min: 1,
              max: 5,
              label: 'Overall Rating',
              admin: {
                width: '33%',
                step: 0.5,
              },
            },
            {
              name: 'food',
              type: 'number',
              min: 1,
              max: 5,
              label: 'Food Quality',
              admin: {
                width: '33%',
                step: 0.5,
              },
            },
            {
              name: 'service',
              type: 'number',
              min: 1,
              max: 5,
              label: 'Service Quality',
              admin: {
                width: '33%',
                step: 0.5,
              },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'ambiance',
              type: 'number',
              min: 1,
              max: 5,
              label: 'Ambiance',
              admin: {
                width: '33%',
                step: 0.5,
              },
            },
            {
              name: 'cleanliness',
              type: 'number',
              min: 1,
              max: 5,
              label: 'Cleanliness',
              admin: {
                width: '33%',
                step: 0.5,
              },
            },
            {
              name: 'valueForMoney',
              type: 'number',
              min: 1,
              max: 5,
              label: 'Value for Money',
              admin: {
                width: '33%',
                step: 0.5,
              },
            },
          ],
        },
      ],
    },
    {
      name: 'comment',
      type: 'textarea',
      localized: true,
      label: 'Comment',
      admin: {
        description: "Customer's comment on the experience",
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Images',
      maxRows: 5,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
      label: 'Verified Review',
      admin: {
        description: 'Verified that customer actually placed an order',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Published', value: 'published' },
        { label: 'Hidden', value: 'hidden' },
        { label: 'Deleted', value: 'deleted' },
      ],
    },
    {
      name: 'response',
      type: 'group',
      label: 'Management Response',
      fields: [
        {
          name: 'text',
          type: 'textarea',
          label: 'Response Text',
        },
        {
          name: 'respondedBy',
          type: 'relationship',
          relationTo: 'users',
          label: 'Responded By',
        },
        {
          name: 'respondedAt',
          type: 'date',
          label: 'Response Date',
          admin: {
            date: {
              pickerAppearance: 'dayAndTime',
            },
          },
        },
      ],
    },
    {
      name: 'helpful',
      type: 'number',
      defaultValue: 0,
      label: 'Helpful Count',
      admin: {
        description: 'Number of people who found this review helpful',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create') {
          console.log(`⭐ New review: ${doc.ratings.overall} stars`)
          // TODO: Update restaurant average rating
          // TODO: Send notification to management
        }

        return doc
      },
    ],
  },
  timestamps: true,
}
