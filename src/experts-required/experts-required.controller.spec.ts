import { Test, TestingModule } from '@nestjs/testing';
import { ExpertsRequiredController } from './experts-required.controller';

describe('ExpertsRequiredController', () => {
  let controller: ExpertsRequiredController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpertsRequiredController],
    }).compile();

    controller = module.get<ExpertsRequiredController>(ExpertsRequiredController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
