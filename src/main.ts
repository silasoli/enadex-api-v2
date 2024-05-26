import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/exception-filters/http-exception.filter';
import { MongoExceptionFilter } from './common/exception-filters/mongo-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.useGlobalFilters(new AllExceptionsFilter(), new MongoExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.enableCors({
    origin: '*',
  });

  const config = new DocumentBuilder()
    .setTitle('Enadex API')
    .setDescription('Enadex API developed by ENADEX')
    .setVersion('1.24.15')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: '',
    },
    customfavIcon:
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@3.25.0/favicon-32x32.png',
    customCssUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui.min.css',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-bundle.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.0/swagger-ui-standalone-preset.js',
    ],
  });

  const port = configService.get('PORT');
  if (!port) throw new Error("Application port wasn't found");
  await app.listen(port);
}
bootstrap();
