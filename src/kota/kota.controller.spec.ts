import { Test, TestingModule } from '@nestjs/testing';
import { KotaController } from './kota.controller';

describe('KotaController', () => {
  let controller: KotaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KotaController],
    }).compile();

    controller = module.get<KotaController>(KotaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
