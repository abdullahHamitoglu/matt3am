import type { CollectionConfig } from 'payload'
import { isAuthenticated, isAdmin } from '@/access/helpers'
import { canCreate, canUpdate, canDelete } from '@/access/permissions'
import { APIError } from 'payload'

export const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'isActive', 'createdAt'],
    group: 'Settings',
  },
  access: {
    read: isAuthenticated, // All authenticated users can view roles
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
      label: 'Role Name',
      admin: {
        description: 'Example: Morning Manager, Trainee Cashier, Kitchen Supervisor',
      },
    },
    {
      name: 'nameEn',
      type: 'text',
      label: 'Name in English',
    },
    {
      name: 'permissions',
      type: 'relationship',
      relationTo: 'permissions',
      hasMany: true,
      required: true,
      label: 'Permissions',
      saveToJWT: true,
      admin: {
        description: 'Select the permissions available for this role',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Disabling the role prevents assigning it to new employees',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        // Prevent modification of critical system roles
        const protectedRoles = ['Administrator']

        if (operation === 'update' && originalDoc) {
          // Check if trying to modify a protected role
          if (protectedRoles.includes(originalDoc.name)) {
            // Only admins can modify protected roles
            if (!isAdmin({ req })) {
              throw new APIError('Cannot modify system role. Admin privileges required.', 403)
            }

            // Prevent changing the name of protected roles
            if (data.name && data.name !== originalDoc.name) {
              throw new APIError(`Cannot rename system role "${originalDoc.name}".`, 403)
            }
          }
        }

        return data
      },
    ],
    beforeDelete: [
      async ({ req, id }) => {
        // Prevent deleting protected roles
        const role = await req.payload.findByID({
          collection: 'roles',
          id: id as string,
          depth: 0,
        })

        const protectedRoles = ['Administrator']
        if (protectedRoles.includes(role.name)) {
          throw new APIError(`Cannot delete system role "${role.name}".`, 403)
        }
      },
    ],
    afterChange: [
      async ({ doc, operation, previousDoc, req, context }) => {
        if (context?.skipAudit) return doc

        // Log role permission changes
        if (operation === 'update') {
          const permissionsChanged =
            JSON.stringify(previousDoc?.permissions) !== JSON.stringify(doc.permissions)

          if (permissionsChanged) {
            console.log(
              `🔐 Security: Role "${doc.name}" permissions modified by ${req.user?.email || 'system'}`,
            )
            // TODO: Create audit log entry
          }
        }

        if (operation === 'create') {
          console.log(
            `🔐 Security: New role "${doc.name}" created by ${req.user?.email || 'system'}`,
          )
        }

        return doc
      },
    ],
  },
  timestamps: true,
}
