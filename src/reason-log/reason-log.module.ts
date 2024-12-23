import { Module } from '@nestjs/common';
import { ReasonLogController } from './reason-log.controller';

@Module({
  controllers: [ReasonLogController]
})
export class ReasonLogModule {}
