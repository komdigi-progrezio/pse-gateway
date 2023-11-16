import { Test, TestingModule } from '@nestjs/testing';
import { LegalBasisController } from './legal-basis.controller';

describe('LegalBasisController', () => {
  let controller: LegalBasisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LegalBasisController],
    }).compile();

    controller = module.get<LegalBasisController>(LegalBasisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
