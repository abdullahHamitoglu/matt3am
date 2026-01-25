import type { CollectionConfig } from 'payload'
import { isAuthenticated, isAdmin } from '@/access/helpers'
import { canCreate, canUpdate, canDelete } from '@/access/permissions'

export const Permissions: CollectionConfig = {
  slug: 'permissions',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'action', 'resource', 'description'],
    group: 'Settings',
  },
  access: {
    read: isAuthenticated, // All authenticated users can view permissions
    create: ({ req }) => {
      // Admin can always create OR users with 'settings' permission
      if (isAdmin({ req })) return true
      return canCreate('settings')({ req })
    },
    update: ({ req }) => {
      if (isAdmin({ req })) return true
      return canUpdate('settings')({ req })
    },
    delete: ({ req }) => {
      if (isAdmin({ req })) return true
      return canDelete('settings')({ req })
    },
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      label: 'Permission Name',
      admin: {
        description: 'Example: Create Order, View Reports, Delete Product',
      },
    },
    {
      name: 'action',
      type: 'select',
      required: true,
      label: 'Action',
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Read', value: 'read' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
        { label: 'Execute', value: 'execute' },
      ],
    },
    {
      name: 'resource',
      type: 'select',
      required: true,
      label: 'Resource',
      options: [
        { label: 'Orders', value: 'orders' },
        { label: 'Menu', value: 'menu' },
        { label: 'Inventory', value: 'inventory' },
        { label: 'Reports', value: 'reports' },
        { label: 'Staff', value: 'users' },
        { label: 'Tables', value: 'tables' },
        { label: 'Reservations', value: 'reservations' },
        { label: 'Payments', value: 'payments' },
        { label: 'Kitchen', value: 'kitchen' },
        { label: 'Settings', value: 'settings' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        description: 'Detailed description of what this permission allows',
      },
    },
  ],
  timestamps: true,
}
