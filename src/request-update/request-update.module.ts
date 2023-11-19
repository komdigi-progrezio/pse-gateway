import { Module } from '@nestjs/common';
import { RequestUpdateController } from './request-update.controller';

@Module({
  controllers: [RequestUpdateController]
})
export class RequestUpdateModule {}
