import { Test, TestingModule } from '@nestjs/testing';
import { ProvinsiController } from './provinsi.controller';

describe('ProvinsiController', () => {
  let controller: ProvinsiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProvinsiController],
    }).compile();

    controller = module.get<ProvinsiController>(ProvinsiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
