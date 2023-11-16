import { Module } from '@nestjs/common';
import { LegalBasisController } from './legal-basis.controller';

@Module({
  controllers: [LegalBasisController]
})
export class LegalBasisModule {}
