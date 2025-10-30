import { Test, TestingModule } from '@nestjs/testing';
import { BiayaController } from './biaya.controller';

describe('BiayaController', () => {
  let controller: BiayaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BiayaController],
    }).compile();

    controller = module.get<BiayaController>(BiayaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
