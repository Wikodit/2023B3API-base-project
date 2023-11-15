import {
  Controller,
  HttpCode,
  Req,
  Get,
  UseInterceptors,
  UseGuards
} from '@nestjs/common'
import { UserService } from './user.service'
import { RequestWithUser, User } from './entity/user.entity'
import { PasswordInterceptor } from '../interceptor/password.interceptor'
import { AuthGuard } from '../guard/auth.guard'

@UseGuards(AuthGuard)
@Controller('/users')
export class UserController {
  constructor(private readonly users: UserService) {}

  @UseInterceptors(PasswordInterceptor)
  @HttpCode(200)
  @Get('/me')
  public async me(@Req() req: RequestWithUser): Promise<User> {
    return this.users.findById(req.user.tokenPayload.sub)
  }
}
