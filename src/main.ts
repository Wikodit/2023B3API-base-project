import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { cors: true })
  const cfgService = app.get<ConfigService>(ConfigService)
  const config = new DocumentBuilder()
    .setTitle('Swagger')
    .addBearerAuth()
    .setDescription('The API description')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(cfgService.get<number>('APP_PORT'))
}

bootstrap()
