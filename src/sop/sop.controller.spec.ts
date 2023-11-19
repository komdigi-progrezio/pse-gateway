import { Test, TestingModule } from '@nestjs/testing';
import { SopController } from './sop.controller';

describe('SopController', () => {
  let controller: SopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SopController],
    }).compile();

    controller = module.get<SopController>(SopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
