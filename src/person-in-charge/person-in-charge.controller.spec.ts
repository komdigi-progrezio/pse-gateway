import { Test, TestingModule } from '@nestjs/testing';
import { PersonInChargeController } from './person-in-charge.controller';

describe('PersonInChargeController', () => {
  let controller: PersonInChargeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonInChargeController],
    }).compile();

    controller = module.get<PersonInChargeController>(PersonInChargeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
