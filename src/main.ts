import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // for the IsEmail, IsEmpty in DTO
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  // set the /api before every endpoints
  app.setGlobalPrefix('api', { exclude: [''] });

  // config the port number
  const configService = app.get(ConfigService);
  const port = configService.get('PORT')

  await app.listen(port);
  console.log(`Server is running on port : ${port}`)

}
bootstrap();
