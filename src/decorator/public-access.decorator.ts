import { SetMetadata } from '@nestjs/common'

export const META_PUBLIC_ACCESS_KEY = '__public_access__'

/**
 * Decorate controller or route handler with it to disable authentication guards
 */
export const PublicAccess = () => SetMetadata(META_PUBLIC_ACCESS_KEY, true)
