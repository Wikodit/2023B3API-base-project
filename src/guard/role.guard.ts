import { CanActivate, ExecutionContext, UnauthorizedException, forwardRef, Inject } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { META_REQUIRED_ROLES_KEY } from '../decorator/role.decorator'
import { Request } from 'express'
import { UserService } from '../user/user.service'
import { UserRole } from '../entity/user.entity'

export class RoleGuard implements CanActivate {

  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly users: UserService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles: UserRole[] = this.reflector.getAllAndOverride(META_REQUIRED_ROLES_KEY, [
      context.getClass(),
      context.getHandler()
    ])

    const req: Request = context.switchToHttp().getRequest()
    if (!req.user) throw new UnauthorizedException()
    const user = await this.users.findById(req.user['tokenPayload']['sub'])

    if (!user || !roles.includes(user.role)) throw new UnauthorizedException()
    
    return true
  }
}