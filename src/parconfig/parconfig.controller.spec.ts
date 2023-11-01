import { Test, TestingModule } from '@nestjs/testing';
import { ParconfigController } from './parconfig.controller';

describe('ParconfigController', () => {
  let controller: ParconfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParconfigController],
    }).compile();

    controller = module.get<ParconfigController>(ParconfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
