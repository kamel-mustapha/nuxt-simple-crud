import { Test, TestingModule } from '@nestjs/testing';
import { CrecheController } from './creche.controller';

describe('CrecheController', () => {
  let controller: CrecheController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrecheController],
    }).compile();

    controller = module.get<CrecheController>(CrecheController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
