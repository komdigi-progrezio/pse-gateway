import { Module } from '@nestjs/common';
import { AvailabilityOfExpertsController } from './availability-of-experts.controller';

@Module({
  controllers: [AvailabilityOfExpertsController]
})
export class AvailabilityOfExpertsModule {}
