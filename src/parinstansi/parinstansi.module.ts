import { Module } from '@nestjs/common';
import { ParinstansiController } from './parinstansi.controller';

@Module({
  controllers: [ParinstansiController]
})
export class ParinstansiModule {}
