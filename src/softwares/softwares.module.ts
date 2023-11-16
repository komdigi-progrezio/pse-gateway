import { Module } from '@nestjs/common';
import { SoftwaresController } from './softwares.controller';

@Module({
  controllers: [SoftwaresController]
})
export class SoftwaresModule {}
