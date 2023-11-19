import { Module } from '@nestjs/common';
import { TypeOfServicesController } from './type-of-services.controller';

@Module({
  controllers: [TypeOfServicesController]
})
export class TypeOfServicesModule {}
