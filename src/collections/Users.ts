import type { CollectionConfig } from 'payload'
import { isAdmin, adminOnly, adminOrSelfField } from '@/access/helpers'
import { APIError } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'roles', 'restaurant'],
    group: 'Settings',
  },
  auth: true,
  access: {
    // Anyone can read user list (for relationships, lookups)
    read: () => true,
    // Authenticated users can create accounts (or handle via invite system)
    create: ({ req: { user } }) => Boolean(user),
    // Admin or self can update
    update: ({ req }) => {
      if (!req.user) return false
      if (isAdmin({ req })) return true
      return { id: { equals: req.user.id } }
    },
    // Only admin can delete users
    delete: isAdmin,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
          label: 'First Name',
          admin: {
            width: '50%',
          },
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
          label: 'Last Name',
          admin: {
            width: '50%',
          },
        },
      ],
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'roles',
      type: 'relationship',
      relationTo: 'roles',
      hasMany: true,
      required: false,
      label: 'Roles',
      saveToJWT: true, // Store in JWT for fast access control
      admin: {
        description: 'Roles and permissions assigned to the user',
      },
      access: {
        read: ({ req }) => {
          if (isAdmin({ req })) return true
          // Users with 'users' read permission can view roles
          return Boolean(req.user) // For now, allow authenticated users to see roles in relationships
        },
        update: ({ req }) => {
          if (isAdmin({ req })) return true
          // Only users with permission can update roles
          const { canUpdate } = require('@/access/permissions')
          return canUpdate('users')({ req })
        },
        create: ({ req }) => {
          if (isAdmin({ req })) return true
          const { canCreate } = require('@/access/permissions')
          return canCreate('users')({ req })
        },
      },
    },
    {
      name: 'restaurant',
      type: 'relationship',
      relationTo: 'restaurants',
      hasMany: true,
      label: 'Assigned Branches',
      saveToJWT: true, // Store in JWT for restaurant-scoped access
      admin: {
        description: 'Branches where the user can work',
      },
      access: {
        read: adminOrSelfField,
        update: adminOnly,
        create: adminOnly,
      },
    },
    {
      name: 'employeeInfo',
      type: 'group',
      label: 'Employee Information',
      admin: {
        condition: (data) => data?.roles?.length > 0,
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'employeeId',
              type: 'text',
              unique: true,
              label: 'Employee ID',
              admin: {
                width: '50%',
              },
              access: {
                read: adminOrSelfField,
                update: adminOnly,
                create: adminOnly,
              },
            },
            {
              name: 'position',
              type: 'select',
              label: 'Position',
              options: [
                { label: 'Manager', value: 'manager' },
                { label: 'Waiter', value: 'waiter' },
                { label: 'Chef', value: 'chef' },
                { label: 'Cashier', value: 'cashier' },
                { label: 'Delivery Driver', value: 'delivery' },
                { label: 'Receptionist', value: 'receptionist' },
              ],
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
              name: 'hireDate',
              type: 'date',
              label: 'Hire Date',
              admin: {
                width: '50%',
              },
            },
            {
              name: 'salary',
              type: 'number',
              label: 'Salary',
              admin: {
                width: '50%',
              },
              access: {
                read: adminOnly,
                update: adminOnly,
                create: adminOnly,
              },
            },
          ],
        },
        {
          name: 'emergencyContact',
          type: 'group',
          label: 'Emergency Contact',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Name',
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Phone',
            },
            {
              name: 'relationship',
              type: 'text',
              label: 'Relationship',
            },
          ],
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      saveToJWT: true, // Store in JWT to block inactive users
      access: {
        read: adminOrSelfField,
        update: adminOnly,
        create: adminOnly,
      },
    },
    {
      name: 'lastLogin',
      type: 'date',
      label: 'Last Login',
      admin: {
        readOnly: true,
        hidden: true,
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        // Prevent non-admins from assigning Administrator role
        if (data.roles && Array.isArray(data.roles) && data.roles.length > 0) {
          // Check if trying to assign Administrator role
          const isAssigningAdminRole = await checkForAdministratorRole(data.roles, req.payload)

          if (isAssigningAdminRole) {
            // Only admins can assign Administrator role
            if (!isAdmin({ req })) {
              throw new APIError('Only administrators can assign the Administrator role.', 403)
            }

            // If updating, check if removing admin from themselves
            if (operation === 'update' && originalDoc) {
              const wasAdmin = await checkForAdministratorRole(originalDoc.roles || [], req.payload)
              const isSelfUpdate = req.user?.id === originalDoc.id

              // Prevent admin from removing their own admin role (last admin protection)
              if (wasAdmin && isSelfUpdate && !isAssigningAdminRole) {
                throw new APIError('You cannot remove Administrator role from yourself.', 403)
              }
            }
          }
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, operation, previousDoc, req, context }) => {
        // Skip logging if context flag is set
        if (context?.skipAudit) return doc

        if (operation === 'update') {
          // Log role changes (audit trail)
          const rolesChanged = JSON.stringify(previousDoc?.roles) !== JSON.stringify(doc.roles)
          const restaurantChanged =
            JSON.stringify(previousDoc?.restaurant) !== JSON.stringify(doc.restaurant)

          if (rolesChanged || restaurantChanged) {
            console.log(
              `🔐 Security: User ${doc.email} permissions updated by ${req.user?.email || 'system'}`,
            )
            // TODO: Create audit log entry
          }
        }
        return doc
      },
    ],
  },
  timestamps: true,
}

/**
 * Helper function to check if a role array contains Administrator role
 */
async function checkForAdministratorRole(roles: any[], payload: any): Promise<boolean> {
  for (const role of roles) {
    // If role is already populated
    if (typeof role === 'object' && role !== null && 'name' in role) {
      if (role.name === 'Administrator') return true
    }
    // If role is just an ID, fetch it
    else if (typeof role === 'string') {
      try {
        const roleDoc = await payload.findByID({
          collection: 'roles',
          id: role,
          depth: 0,
        })
        if (roleDoc?.name === 'Administrator') return true
      } catch (error) {
        // Ignore errors
      }
    }
  }
  return false
}
