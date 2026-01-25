import type { CollectionConfig } from 'payload'
import { canCreate, canUpdate, canDelete } from '@/access/permissions'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'displayOrder', 'isActive'],
    group: 'Menu',
  },
  access: {
    read: () => true, // Public can view categories
    create: canCreate('menu'),
    update: canUpdate('menu'),
    delete: canDelete('menu'),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      label: 'Category Name',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'menu',
      label: 'Category Type',
      options: [
        { label: 'Menu Category', value: 'menu' },
        { label: 'Inventory Category', value: 'inventory' },
      ],
      admin: {
        description: 'Menu categories for dishes, Inventory categories for raw materials',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Description',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Category Image',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon',
      admin: {
        description: 'Icon name from the icon library',
      },
    },
    {
      name: 'color',
      type: 'text',
      label: 'Color',
      admin: {
        description: 'Category color code (#hex)',
      },
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Display Order',
      admin: {
        description: 'Order in the menu (lower appears first)',
      },
    },
    {
      name: 'parentCategory',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Parent Category',
      admin: {
        description: 'For creating subcategories',
      },
      filterOptions: ({ id }) => {
        return {
          id: {
            not_equals: id,
          },
        }
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },
  ],
  timestamps: true,
}
