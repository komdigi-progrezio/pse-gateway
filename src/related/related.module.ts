import { Module } from '@nestjs/common';
import { RelatedController } from './related.controller';

@Module({
  controllers: [RelatedController]
})
export class RelatedModule {}
