import { Reflector } from '@nestjs/core'

/**
 * Decorate controller or route handler with it to disable authentication guards
 */
export const PublicAccess = Reflector.createDecorator<boolean>()
