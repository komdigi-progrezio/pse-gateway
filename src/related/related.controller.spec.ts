import { Test, TestingModule } from '@nestjs/testing';
import { RelatedController } from './related.controller';

describe('RelatedController', () => {
  let controller: RelatedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelatedController],
    }).compile();

    controller = module.get<RelatedController>(RelatedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
