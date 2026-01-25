import type { Access, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

/**
 * Check if the user is authenticated
 */
export const isAuthenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

/**
 * Check if the user has Administrator role
 * This checks the JWT-stored roles for performance
 */
export const isAdmin: Access = ({ req }) => {
  const { user } = req
  if (!user) return false

  const userRoles = user.roles

  if (!userRoles) return false

  // Roles can be stored as objects (populated) or strings (IDs)
  // When saveToJWT: true is set, they're stored as objects in the JWT
  const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles]

  return rolesArray.some((role) => {
    // Check if role is populated object
    if (typeof role === 'object' && role !== null && 'name' in role) {
      return role.name === 'Administrator'
    }
    return false
  })
}

/**
 * Field-level access: Admin only
 */
export const adminOnly: FieldAccess = ({ req }) => {
  return isAdmin({ req }) as boolean
}

/**
 * Admin or accessing own document
 */
export const adminOrSelf: Access = ({ req }) => {
  const { user } = req
  if (!user) return false

  // Admin can access all
  if (isAdmin({ req })) return true

  // Others can only access their own data
  return {
    id: { equals: user.id },
  }
}

/**
 * Field-level: Admin or self
 */
export const adminOrSelfField: FieldAccess = ({ req, doc }) => {
  const { user } = req
  if (!user) return false

  // Admin can access all
  if (isAdmin({ req })) return true

  // User can access own document
  return doc?.id === user.id
}

/**
 * Check if user is authenticated and active
 */
export const isActiveUser: Access = ({ req: { user } }) => {
  if (!user) return false

  // Check if user account is active
  if ('isActive' in user && user.isActive === false) {
    return false
  }

  return true
}
