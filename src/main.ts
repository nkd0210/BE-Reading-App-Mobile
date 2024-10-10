import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // for the IsEmail, IsEmpty in DTO
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // set the /api before every endpoints
  app.setGlobalPrefix('api', { exclude: [''] });

  //setup swagger
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation for my application')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Sets up the Swagger UI at /api/docs

  // config the port number
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  await app.listen(port);
  console.log(`Server is running on port : ${port}`);
}
bootstrap();
