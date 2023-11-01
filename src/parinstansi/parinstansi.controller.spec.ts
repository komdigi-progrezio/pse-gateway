import { Test, TestingModule } from '@nestjs/testing';
import { ParinstansiController } from './parinstansi.controller';

describe('ParinstansiController', () => {
  let controller: ParinstansiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParinstansiController],
    }).compile();

    controller = module.get<ParinstansiController>(ParinstansiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
