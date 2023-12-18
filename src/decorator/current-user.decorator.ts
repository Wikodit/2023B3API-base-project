import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { User } from '../entity/user.entity'
import { RequestWithUser } from '../types'

/**
 * Decorate a route handler parameter using this decorator to inject current
 * authenticated user.
 * 
 * This decorator require the current authenticated user to be injected into request (job done by AuthGuard).
 */
export const CurrentUser = createParamDecorator<keyof User>(
  (key: keyof User | null = null, ctx: ExecutionContext) => {
    const req: RequestWithUser = ctx.switchToHttp().getRequest()

    return req.user ? (key ? req.user[key] : req.user) : null
  }
)
