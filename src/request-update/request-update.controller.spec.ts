import { Test, TestingModule } from '@nestjs/testing';
import { RequestUpdateController } from './request-update.controller';

describe('RequestUpdateController', () => {
  let controller: RequestUpdateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestUpdateController],
    }).compile();

    controller = module.get<RequestUpdateController>(RequestUpdateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
