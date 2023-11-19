import { Module } from '@nestjs/common';
import { SpecialFunctionsController } from './special-functions.controller';

@Module({
  controllers: [SpecialFunctionsController]
})
export class SpecialFunctionsModule {}
