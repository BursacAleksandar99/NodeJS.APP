import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { StorageConfig } from 'config/storage.config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(StorageConfig.photo.destination, {
    prefix: StorageConfig.photo.urlPrefix,
    maxAge: StorageConfig.photo.maxAge, //  7 dana
    index: false,

  });

  app.useGlobalPipes(new ValidationPipe())
  
  const config = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('Your API Description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
 
  await app.listen(3000);
}
bootstrap();
