import { Module } from '@nestjs/common';
import { ScopeController } from './scope.controller';

@Module({
  controllers: [ScopeController]
})
export class ScopeModule {}
