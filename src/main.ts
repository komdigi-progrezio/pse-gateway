import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 8000;

  const multerConfig = {
    dest: './uploads',
  };

  app.enableCors({
    origin: true,
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('Your API Description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Serve Swagger JSON file
  const swaggerJson = JSON.stringify(document, null, 2);
  const swaggerPath = '/api/swagger.json';
  app.use(swaggerPath, (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerJson);
  });

  await app.listen(port, () => {
    console.log(`App run on port ${port}`);
  });
}
bootstrap();
