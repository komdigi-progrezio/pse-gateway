import { Module } from '@nestjs/common';
import { SopController } from './sop.controller';

@Module({
  controllers: [SopController]
})
export class SopModule {}
