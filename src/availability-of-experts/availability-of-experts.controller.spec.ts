import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilityOfExpertsController } from './availability-of-experts.controller';

describe('AvailabilityOfExpertsController', () => {
  let controller: AvailabilityOfExpertsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailabilityOfExpertsController],
    }).compile();

    controller = module.get<AvailabilityOfExpertsController>(AvailabilityOfExpertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
