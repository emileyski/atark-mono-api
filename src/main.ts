import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('🚚 Delivery Service API')
    .setDescription('The delivery service API description')
    .setVersion('1.0')
    .addTag('auth')
    .addBearerAuth({
      type: 'http',
      scheme: 'Bearer',
      description: 'Enter access token here',
      bearerFormat: 'Bearer ${token}',
      in: 'header',
      name: 'Authorization',
    })
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api/docs', app, document);

  const PORT = process.env.PORT || 3000;

  app.enableCors({ origin: 'http://localhost:5173' });

  await app.listen(PORT);
  Logger.log(
    `🚚 Delivery service is running on: http://localhost:${PORT}/api`,
    'bootstrap',
  );
  Logger.log(
    `📚 Swagger documentation is running on: http://localhost:${PORT}/api/docs`,
    'bootstrap',
  );
}
bootstrap();
