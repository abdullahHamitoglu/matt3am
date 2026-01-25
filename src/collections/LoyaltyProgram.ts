import type { CollectionConfig } from 'payload'
import { isAuthenticated } from '@/access/helpers'
import { canCreate, canUpdate, canDelete } from '@/access/permissions'

export const LoyaltyProgram: CollectionConfig = {
  slug: 'loyalty-program',
  admin: {
    useAsTitle: 'membershipId',
    defaultColumns: ['membershipId', 'currentPoints', 'tier', 'totalSpent'],
    group: 'Management',
  },
  access: {
    read: isAuthenticated,
    create: canCreate('users'), // Staff permission
    update: canUpdate('users'),
    delete: canDelete('users'),
  },
  fields: [
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
              unique: true,
              label: 'Phone Number',
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
              name: 'email',
              type: 'email',
              label: 'Email',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'dateOfBirth',
              type: 'date',
              label: 'Date of Birth',
              admin: {
                width: '50%',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'membershipId',
      type: 'text',
      unique: true,
      required: true,
      label: 'Membership ID',
      admin: {
        readOnly: true,
        description: 'Generated automatically',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'currentPoints',
          type: 'number',
          defaultValue: 0,
          label: 'Current Points',
          admin: {
            width: '33%',
            readOnly: true,
          },
        },
        {
          name: 'lifetimePoints',
          type: 'number',
          defaultValue: 0,
          label: 'Lifetime Points',
          admin: {
            width: '33%',
            readOnly: true,
          },
        },
        {
          name: 'redeemedPoints',
          type: 'number',
          defaultValue: 0,
          label: 'Redeemed Points',
          admin: {
            width: '33%',
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'tier',
      type: 'select',
      required: true,
      defaultValue: 'bronze',
      label: 'Tier',
      options: [
        { label: 'Bronze', value: 'bronze' },
        { label: 'Silver', value: 'silver' },
        { label: 'Gold', value: 'gold' },
        { label: 'Platinum', value: 'platinum' },
        { label: 'VIP', value: 'vip' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'totalOrders',
          type: 'number',
          defaultValue: 0,
          label: 'Total Orders',
          admin: {
            width: '50%',
            readOnly: true,
          },
        },
        {
          name: 'totalSpent',
          type: 'number',
          defaultValue: 0,
          label: 'Total Spent',
          admin: {
            width: '50%',
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'pointsHistory',
      type: 'array',
      label: 'Points History',
      admin: {
        readOnly: true,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'type',
              type: 'select',
              required: true,
              label: 'Type',
              options: [
                { label: 'Earned', value: 'earned' },
                { label: 'Redeemed', value: 'redeemed' },
                { label: 'Expired', value: 'expired' },
                { label: 'Adjusted', value: 'adjusted' },
              ],
              admin: {
                width: '25%',
              },
            },
            {
              name: 'points',
              type: 'number',
              required: true,
              label: 'Points',
              admin: {
                width: '25%',
              },
            },
            {
              name: 'balance',
              type: 'number',
              label: 'Balance After',
              admin: {
                width: '25%',
              },
            },
            {
              name: 'date',
              type: 'date',
              label: 'Date',
              admin: {
                width: '25%',
              },
            },
          ],
        },
        {
          name: 'description',
          type: 'text',
          localized: true,
          label: 'Description',
        },
        {
          name: 'relatedOrder',
          type: 'relationship',
          relationTo: 'orders',
          label: 'Related Order',
        },
      ],
    },
    {
      name: 'rewards',
      type: 'array',
      label: 'Available Rewards',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          localized: true,
          label: 'Reward Name',
        },
        {
          type: 'row',
          fields: [
            {
              name: 'pointsRequired',
              type: 'number',
              required: true,
              label: 'Points Required',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'discount',
              type: 'number',
              label: 'Discount Value',
              admin: {
                width: '50%',
                description: 'In local currency or percentage',
              },
            },
          ],
        },
        {
          name: 'isRedeemed',
          type: 'checkbox',
          defaultValue: false,
          label: 'Redeemed',
        },
        {
          name: 'redeemedAt',
          type: 'date',
          label: 'Redemption Date',
        },
      ],
    },
    {
      name: 'preferences',
      type: 'group',
      label: 'Preferences',
      fields: [
        {
          name: 'favoriteItems',
          type: 'relationship',
          relationTo: 'menu-items',
          hasMany: true,
          label: 'Favorite Items',
        },
        {
          name: 'dietaryRestrictions',
          type: 'select',
          hasMany: true,
          label: 'Dietary Restrictions',
          options: [
            { label: 'Vegetarian', value: 'vegetarian' },
            { label: 'Vegan', value: 'vegan' },
            { label: 'Gluten-Free', value: 'gluten-free' },
            { label: 'Halal', value: 'halal' },
            { label: 'Nut Allergy', value: 'nut-allergy' },
            { label: 'Lactose Intolerant', value: 'lactose-intolerant' },
          ],
        },
        {
          name: 'receivePromotions',
          type: 'checkbox',
          defaultValue: true,
          label: 'Receive Promotions',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      label: 'Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'joinDate',
      type: 'date',
      label: 'Join Date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'lastActivity',
      type: 'date',
      label: 'Last Activity',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Generate membership ID
        if (operation === 'create') {
          if (!data.membershipId) {
            const timestamp = Date.now().toString().slice(-8)
            data.membershipId = `LOYAL-${timestamp}`
          }
          data.joinDate = new Date()
        }

        // Update tier based on points
        if (data.lifetimePoints !== undefined) {
          if (data.lifetimePoints >= 10000) {
            data.tier = 'vip'
          } else if (data.lifetimePoints >= 5000) {
            data.tier = 'platinum'
          } else if (data.lifetimePoints >= 2000) {
            data.tier = 'gold'
          } else if (data.lifetimePoints >= 500) {
            data.tier = 'silver'
          } else {
            data.tier = 'bronze'
          }
        }

        return data
      },
    ],
  },
  timestamps: true,
}
