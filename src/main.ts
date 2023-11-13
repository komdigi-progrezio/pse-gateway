import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'busboy-body-parser';
import * as multer from 'multer';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe()); //ini untuk pipevalidation global

  const port = process.env.PORT || 8000;

  const multerConfig = {
    dest: './uploads', // Ganti dengan direktori tempat menyimpan file
  };

  app.use(multer(multerConfig).any());

  app.enableCors({
    origin: true,
  });
  // app.useStaticAssets(join(__dirname, '..', '..', 'uploads'));
  await app.listen(port, () => {
    console.log(`App run on port ${port}`);
  });
}
bootstrap();
