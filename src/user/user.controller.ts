import {
  Controller,
  Req,
  Get,
  UseInterceptors,
  UseGuards,
  NotFoundException,
  Param,
  ParseUUIDPipe
} from '@nestjs/common'
import { UserService } from './user.service'
import { User } from '../entity/user.entity'
import { PasswordInterceptor } from '../interceptor/password.interceptor'
import { AuthGuard } from '../guard/auth.guard'
import { RequestWithUser } from '../types'

@UseGuards(AuthGuard)
@Controller('/users')
export class UserController {
  constructor(private readonly users: UserService) {}

  @UseInterceptors(PasswordInterceptor)
  @Get('/me')
  public async me(@Req() req: RequestWithUser): Promise<User> {
    return req.user
  }

  @UseInterceptors(PasswordInterceptor)
  @Get()
  public async root(): Promise<User[]> {
    return this.users.findAll()
  }

  @UseInterceptors(PasswordInterceptor)
  @Get('/:uuid')
  public async user(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<User> {
    const user = await this.users.findById(uuid)
    if (user) return user

    throw new NotFoundException()
  }
}
