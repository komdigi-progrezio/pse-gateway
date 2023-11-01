import { Module } from '@nestjs/common';
import { KotaController } from './kota.controller';

@Module({
  controllers: [KotaController]
})
export class KotaModule {}
