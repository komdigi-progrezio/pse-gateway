import { Module } from '@nestjs/common';
import { ExpertsRequiredController } from './experts-required.controller';

@Module({
  controllers: [ExpertsRequiredController]
})
export class ExpertsRequiredModule {}
