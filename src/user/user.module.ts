import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entity/user.entity'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { AuthModule } from '../auth/auth.module'

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule)]
})
export class UserModule {}
