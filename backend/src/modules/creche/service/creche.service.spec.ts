import { Test, TestingModule } from '@nestjs/testing';
import { CrecheService } from './creche.service';

describe('CrecheService', () => {
  let service: CrecheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrecheService],
    }).compile();

    service = module.get<CrecheService>(CrecheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
