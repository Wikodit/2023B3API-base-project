import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constant';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwtStrat';
import { EventsModule } from '../events/events.module';
import { AuthModule } from '../auth/auth.module';


@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([User]),
    forwardRef(() => EventsModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
