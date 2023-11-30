import { Module } from '@nestjs/common';
import { NotifikasiController } from './notifikasi.controller';

@Module({
  controllers: [NotifikasiController]
})
export class NotifikasiModule {}
