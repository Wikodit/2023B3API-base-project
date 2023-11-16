import { SetMetadata } from '@nestjs/common'
import { UserRole } from '../entity/user.entity'

export const META_REQUIRED_ROLES_KEY = '__required_roles__'

/**
 * Decorate controller or route handler with it to make it only accessible by user that have a specific role
 */
export const RequiredRole = (roles: UserRole | UserRole[]) =>
  SetMetadata(META_REQUIRED_ROLES_KEY, Array.isArray(roles)
    ? roles
    : [ roles ])
