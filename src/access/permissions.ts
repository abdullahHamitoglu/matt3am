import type { Access } from 'payload'
import type { User } from '@/payload-types'
import { isAdmin } from './helpers'

/**
 * Check if user has a specific permission
 * @param action - The action to check (create, read, update, delete, execute)
 * @param resource - The resource to check (orders, menu, inventory, etc.)
 */
export const hasPermission =
  (action: string, resource: string): Access =>
  ({ req }) => {
    const { user } = req
    if (!user) return false

    // Admins bypass permission checks
    if (isAdmin({ req })) return true

    const userRoles = user.roles

    if (!userRoles || (Array.isArray(userRoles) && userRoles.length === 0)) {
      return false
    }

    // Convert to array if not already
    const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles]

    // Check if any of the user's roles has the required permission
    for (const role of rolesArray) {
      // Role must be populated object with permissions
      if (typeof role === 'object' && role !== null && 'permissions' in role) {
        const permissions = role.permissions

        if (!permissions || !Array.isArray(permissions)) continue

        // Check each permission
        const hasRequiredPermission = permissions.some((perm) => {
          // Permission must be populated object
          if (typeof perm === 'object' && perm !== null) {
            return (
              'action' in perm &&
              'resource' in perm &&
              perm.action === action &&
              perm.resource === resource
            )
          }
          return false
        })

        if (hasRequiredPermission) return true
      }
    }

    return false
  }

/**
 * Check if user can create a specific resource
 */
export const canCreate = (resource: string): Access => hasPermission('create', resource)

/**
 * Check if user can read a specific resource
 */
export const canRead = (resource: string): Access => hasPermission('read', resource)

/**
 * Check if user can update a specific resource
 */
export const canUpdate = (resource: string): Access => hasPermission('update', resource)

/**
 * Check if user can delete a specific resource
 */
export const canDelete = (resource: string): Access => hasPermission('delete', resource)

/**
 * Check if user can execute operations on a specific resource
 */
export const canExecute = (resource: string): Access => hasPermission('execute', resource)
