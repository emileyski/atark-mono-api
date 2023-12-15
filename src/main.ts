import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('Atark API')
    .setDescription('This is backend for Atark project')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      description: 'Enter JWT token like [Bearer <token>]',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api/docs', app, document);

  const PORT = process.env.PORT || 3000;

  app.enableCors({ origin: 'http://localhost:5173' });

  await app.listen(PORT);
  Logger.log(`😎 Auth service is running on port ${PORT}`, `bootstrap`);
}
bootstrap();
