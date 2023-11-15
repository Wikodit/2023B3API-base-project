import { Module, forwardRef } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthService } from './auth.service'

@Module({
  controllers: [AuthController],
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (cfg: ConfigService) => ({
        secretOrKeyProvider: () => cfg.get<string>('JWT_SECRET')
      })
    })
  ],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
