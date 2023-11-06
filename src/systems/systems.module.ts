import { Module } from '@nestjs/common';
import { SystemsController } from './systems.controller';

@Module({
  controllers: [SystemsController]
})
export class SystemsModule {}
