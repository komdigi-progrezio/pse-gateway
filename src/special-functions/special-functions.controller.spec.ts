import { Test, TestingModule } from '@nestjs/testing';
import { SpecialFunctionsController } from './special-functions.controller';

describe('SpecialFunctionsController', () => {
  let controller: SpecialFunctionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpecialFunctionsController],
    }).compile();

    controller = module.get<SpecialFunctionsController>(SpecialFunctionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
