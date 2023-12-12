import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module'
import { User } from './entity/user.entity'
import { ProjectModule } from './project/project.module'
import { AuthModule } from './user/auth/auth.module'
import { ProjectUserModule } from './project/project-user/project-user.module'
import { Project } from './entity/project.entity'
import { ProjectUser } from './entity/project-user.entity'
import { APP_GUARD } from '@nestjs/core'
import { AuthGuard } from './guard/auth.guard'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [ '.env', '.env.local' ] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Project, ProjectUser ],
        synchronize: true,
        autoLoadEntities: true
      }),
      inject: [ConfigService]
    }),
    UserModule,
    AuthModule,
    ProjectModule,
    ProjectUserModule
  ],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard
  }],
  exports: [],
  controllers: []
})
export class AppModule {}
