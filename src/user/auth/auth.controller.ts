import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common'
import { UserService } from '../user.service'
import { UserSignUpDto } from '../../dto/user-sign-up.dto'
import { User } from '../../entity/user.entity'
import { UserSignInDto } from '../../dto/user-sign-in.dto'
import { AccessToken } from './auth-token'
import { PublicAccess } from '../../decorator/public-access.decorator'
import { AuthService } from './auth.service'
import { TransformInterceptor } from '../../interceptor/transform.interceptor'

@UsePipes(ValidationPipe)
@UseInterceptors(TransformInterceptor)
@Controller('/users/auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UserService
  ) {}

  @PublicAccess()
  @Post('/sign-up')
  public async signUp(@Body() dto: UserSignUpDto): Promise<User> {
    return this.users.create(dto)
  }

  @PublicAccess()
  @HttpCode(201)
  // We're using above /sign-up as registration endpoint, according to this naming,
  // "/login" endpoint should be /sign-in.
  @Post('/login')
  public async login(@Body() dto: UserSignInDto): Promise<AccessToken> {
    const user = await this.users.findUserFromCrendentials(dto)
    if (!user) throw new UnauthorizedException()

    return { access_token: await this.auth.createToken(user) }
  }
}
