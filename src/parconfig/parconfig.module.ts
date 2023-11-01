import { Module } from '@nestjs/common';
import { ParconfigController } from './parconfig.controller';

@Module({
  controllers: [ParconfigController]
})
export class ParconfigModule {}
