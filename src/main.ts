import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up swagger options
  const config = new DocumentBuilder()
    .setTitle('Alma Labs API Template')
    .setDescription('The Official API Template of Alma Labs')
    .setVersion('0.1')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token', // This is an arbitrary identifier for this auth method in Swagger UI
    )
    .addTag('auth', 'Registering Users')
    .addTag('users', 'User information')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  app.enableCors();

  // Strip out any properties that don't have a corresponding DTO so we don't get random properties in our database
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
