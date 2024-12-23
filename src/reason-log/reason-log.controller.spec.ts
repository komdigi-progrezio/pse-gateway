import { Test, TestingModule } from '@nestjs/testing';
import { ReasonLogController } from './reason-log.controller';

describe('ReasonLogController', () => {
  let controller: ReasonLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReasonLogController],
    }).compile();

    controller = module.get<ReasonLogController>(ReasonLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
