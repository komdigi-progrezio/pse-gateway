import { Module } from '@nestjs/common';
import { ParsatuankerjaController } from './parsatuankerja.controller';

@Module({
  controllers: [ParsatuankerjaController]
})
export class ParsatuankerjaModule {}
