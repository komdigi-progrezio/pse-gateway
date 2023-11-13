import { Test, TestingModule } from '@nestjs/testing';
import { TypeOfServicesController } from './type-of-services.controller';

describe('TypeOfServicesController', () => {
  let controller: TypeOfServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeOfServicesController],
    }).compile();

    controller = module.get<TypeOfServicesController>(TypeOfServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
