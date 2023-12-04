import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { AuthService } from '../user/auth/auth.service'
import { UserService } from '../user/user.service'
import { UserRole } from '../entity/user.entity'
import { PublicAccess } from '../decorator/public-access.decorator'
import { Roles } from '../decorator/roles.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly auth: AuthService,
    @Inject(forwardRef(() => UserService))
    private readonly users: UserService,
    private readonly reflector: Reflector
  ) {}

  // Return false => 403 Forbidden
  // Return true  => Continue...
  // Throw UnauthorizeException => 401 Unauthorized
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const publicAccess = this.reflector.getAllAndOverride<boolean>(
      PublicAccess,
      [context.getClass(), context.getHandler()]
    )

    // Decorating a route handler or a controller class using @PublicAccess will
    // disable authentication process for decorated member
    if (publicAccess) return true
    const req: Request = context.switchToHttp().getRequest()

    if (req.headers.authorization) {
      const token = extractJwtFromHeader(req.headers.authorization)
      
      if (token) {
        const payload = await this.auth.verifyToken(token)
        
        if (payload && payload.sub) {
          const user = await this.users.findById(payload.sub)
          
          if (user) {
            const roles = this.reflector.getAllAndOverride<UserRole[]>(
              Roles,
              [context.getClass(), context.getHandler()]
            )

            if (roles && !roles.includes(user.role)) throw new UnauthorizedException()
            // Token and user are valid, injecting user to request object
            req['user'] = user
            return true
          }
        }
      }
    }

    // Invalid token or permission level too low, Http 401 Unauthorized
    throw new UnauthorizedException()
  }
}

/**
 * Helper for extracting JWT from request authorization header.
 */
function extractJwtFromHeader(authorizationHeader: string): string | null {
  const [type, token] = authorizationHeader.split(' ')

  return type?.toLowerCase() === 'bearer' ? token : null
}
