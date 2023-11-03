import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'busboy-body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe()); //ini untuk pipevalidation global

  const port = process.env.PORT || 8000;
  app.use(bodyParser());
  app.enableCors({
    origin: true,
  });
  // app.useStaticAssets(join(__dirname, '..', '..', 'uploads'));
  await app.listen(port, () => {
    console.log(`App run on port ${port}`);
  });
}
bootstrap();
