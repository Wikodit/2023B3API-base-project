import { UserRole } from '../entity/user.entity'
import { Reflector } from '@nestjs/core'

/**
 * Decorate controller or route handler with it to make it
 * only accessible by user that have a specific role.
 */
export const Roles = Reflector.createDecorator<UserRole[]>()
