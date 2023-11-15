import { Module } from '@nestjs/common';
import { HardwaresController } from './hardwares.controller';

@Module({
  controllers: [HardwaresController]
})
export class HardwaresModule {}
