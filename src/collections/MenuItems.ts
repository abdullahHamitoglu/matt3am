import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/helpers'
import { restaurantScoped } from '@/access/restaurant-scoped'
import { canCreate, canUpdate, canDelete } from '@/access/permissions'

export const MenuItems: CollectionConfig = {
  slug: 'menu-items',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'isAvailable', 'restaurant'],
    group: 'Menu',
  },
  access: {
    read: () => true, // Public can view menu
    create: ({ req }) => {
      if (!req.user) return false
      if (isAdmin({ req })) return true
      return canCreate('menu')({ req })
    },
    update: ({ req }) => {
      if (!req.user) return false
      if (isAdmin({ req })) return true
      const hasPermission = canUpdate('menu')({ req })
      if (!hasPermission) return false
      return restaurantScoped({ req })
    },
    delete: canDelete('menu'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Dish Name',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Description',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      label: 'Category',
      filterOptions: {
        type: {
          equals: 'menu',
        },
      },
    },
    {
      name: 'restaurant',
      type: 'relationship',
      relationTo: 'restaurants',
      hasMany: true,
      required: true,
      label: 'Available Branches',
      admin: {
        description: 'Select branches where this dish is available',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          label: 'Price',
          admin: {
            width: '33%',
            step: 0.01,
          },
        },
        {
          name: 'discountPrice',
          type: 'number',
          label: 'Discount Price',
          admin: {
            width: '33%',
            step: 0.01,
            description: 'Leave empty if no discount',
          },
        },
        {
          name: 'currency',
          type: 'relationship',
          relationTo: 'currencies',
          required: true,
          label: 'Currency',
          admin: {
            width: '33%',
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
    {
      name: 'images',
      type: 'array',
      label: 'Dish Images',
      minRows: 1,
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
      name: 'dietary',
      type: 'group',
      label: 'Nutritional Information',
      fields: [
        {
          name: 'calories',
          type: 'number',
          label: 'Calories',
        },
        {
          name: 'tags',
          type: 'select',
          hasMany: true,
          label: 'Tags',
          options: [
            { label: 'Vegetarian', value: 'vegetarian' },
            { label: 'Spicy', value: 'spicy' },
            { label: 'Gluten-Free', value: 'gluten-free' },
            { label: 'Healthy', value: 'healthy' },
            { label: 'Best Seller', value: 'best-seller' },
            { label: 'New', value: 'new' },
            { label: 'Recommended', value: 'recommended' },
          ],
        },
        {
          name: 'allergens',
          type: 'select',
          hasMany: true,
          label: 'Allergens',
          options: [
            { label: 'Peanuts', value: 'peanuts' },
            { label: 'Dairy', value: 'dairy' },
            { label: 'Eggs', value: 'eggs' },
            { label: 'Seafood', value: 'seafood' },
            { label: 'Wheat', value: 'wheat' },
          ],
        },
      ],
    },
    {
      name: 'preparation',
      type: 'group',
      label: 'Preparation Information',
      fields: [
        {
          name: 'prepTime',
          type: 'number',
          label: 'Preparation Time (minutes)',
          defaultValue: 15,
        },
        {
          name: 'servingSize',
          type: 'text',
          localized: true,
          label: 'Serving Size',
          admin: {
            description: 'Example: 1 person, 2-3 people',
          },
        },
      ],
    },
    {
      name: 'customizations',
      type: 'array',
      label: 'Customization Options',
      admin: {
        description: 'Add-ons or modifications that customer can choose',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          localized: true,
          label: 'Name',
        },
        {
          name: 'options',
          type: 'array',
          label: 'Options',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'optionName',
                  type: 'text',
                  required: true,
                  localized: true,
                  label: 'Option',
                  admin: {
                    width: '60%',
                  },
                },
                {
                  name: 'additionalPrice',
                  type: 'number',
                  defaultValue: 0,
                  label: 'Additional Price',
                  admin: {
                    width: '40%',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'isRequired',
          type: 'checkbox',
          defaultValue: false,
          label: 'Required',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'isAvailable',
          type: 'checkbox',
          defaultValue: true,
          label: 'Available',
          admin: {
            width: '33%',
            description: 'Temporarily unavailable',
          },
        },
        {
          name: 'isFeatured',
          type: 'checkbox',
          defaultValue: false,
          label: 'Featured',
          admin: {
            width: '33%',
            description: 'Appears on home page',
          },
        },
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: true,
          label: 'Active',
          admin: {
            width: '33%',
          },
        },
      ],
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
    },
  ],
  timestamps: true,
}
