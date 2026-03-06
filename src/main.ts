import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable validation
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Devdutt Samiti Service')
    .setDescription('API for managing Samiti (governance committee) hierarchy, memberships, and No Confidence Motions')
    .setVersion('0.1.0')
    .addTag('admin', 'Admin operations for samitis')
    .addTag('samitis', 'Public browsing of samiti hierarchy')
    .addTag('sabhapati', 'Sabhapati (leader) operations')
    .addTag('offers', 'Role offer management')
    .addTag('ncm', 'No Confidence Motion workflow')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`🚀 Samiti Service is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();
