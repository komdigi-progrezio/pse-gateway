import { Module } from '@nestjs/common';
import { ProvinsiController } from './provinsi.controller';

@Module({
  controllers: [ProvinsiController]
})
export class ProvinsiModule {}
