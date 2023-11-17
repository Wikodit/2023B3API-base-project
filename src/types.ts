import { User } from './entity/user.entity'
import { Request as ExpressRequest } from 'express'

/** 
 * Express Http request which have an extra user property which point to the current
 * authenticated user. This property will not be injected to the Express Http request
 * if authentication fail.
 */
export type RequestWithUser = ExpressRequest & { user: User }

/**
 * JWT embedded payload.
 */
export interface JwtPayload {
  // User UUID (owner of this JWT)
  sub: string
}