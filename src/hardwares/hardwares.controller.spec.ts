import { Test, TestingModule } from '@nestjs/testing';
import { HardwaresController } from './hardwares.controller';

describe('HardwaresController', () => {
  let controller: HardwaresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HardwaresController],
    }).compile();

    controller = module.get<HardwaresController>(HardwaresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
