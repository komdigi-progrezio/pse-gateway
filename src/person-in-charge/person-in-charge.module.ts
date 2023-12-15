import { Module } from '@nestjs/common';
import { PersonInChargeController } from './person-in-charge.controller';

@Module({
  controllers: [PersonInChargeController]
})
export class PersonInChargeModule {}
