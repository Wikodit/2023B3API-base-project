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
import { AuthService } from '../auth/auth.service'
import { META_PUBLIC_ACCESS_KEY } from '../decorator/public.decorator'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly auth: AuthService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const publicAccess = this.reflector.getAllAndOverride<boolean>(
      META_PUBLIC_ACCESS_KEY,
      [context.getClass(), context.getHandler()]
    )

    // Handler or controller is decorated using @PublicAccess,
    // no authentication required.
    if (publicAccess) return true
    const req: Request = context.switchToHttp().getRequest()

    if (req.headers.authorization) {
      const token = extractJwtFromHeader(req.headers.authorization)
      if (token) {
        const payload = await this.auth.verifyToken(token)
        if (payload) {
          req['user'] = { tokenPayload: payload }

          return true
        }
      }
    }

    // Invalid token, Http 401 Unauthorized
    throw new UnauthorizedException()
  }
}

function extractJwtFromHeader(authorizationHeader: string): string | null {
  const [type, token] = authorizationHeader.split(' ')

  return type?.toLowerCase() === 'bearer' && token ? token : null
}
