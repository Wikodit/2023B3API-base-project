import { Controller, Get, NotFoundException, Param, ParseUUIDPipe, UseInterceptors } from '@nestjs/common'
import { CurrentUser } from '../decorator/current-user.decorator'
import { User } from '../entity/user.entity'
import { TransformInterceptor } from '../interceptor/transform.interceptor'
import { UserService } from './user.service'
import { ApiBearerAuth } from '@nestjs/swagger'

@ApiBearerAuth('JWT')
@UseInterceptors(TransformInterceptor)
@Controller('/users')
export class UserController {
  constructor(private readonly users: UserService) {}

  @Get('/me')
  public async getMe(@CurrentUser() user: User): Promise<User> {
    return user
  }

  @Get()
  public async getUsers(): Promise<User[]> {
    return this.users.findAll()
  }

  @Get('/:uuid')
  public async getUserById(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<User> {
    const user = await this.users.findById(uuid)
    if (user) return user

    throw new NotFoundException()
  }
}
