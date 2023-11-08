import { Test, TestingModule } from '@nestjs/testing';
import { ParsatuankerjaController } from './parsatuankerja.controller';

describe('ParsatuankerjaController', () => {
  let controller: ParsatuankerjaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParsatuankerjaController],
    }).compile();

    controller = module.get<ParsatuankerjaController>(ParsatuankerjaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
