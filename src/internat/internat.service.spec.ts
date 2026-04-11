import { Test, TestingModule } from '@nestjs/testing';
import { InternatService } from './internat.service';

describe('InternatService', () => {
  let service: InternatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InternatService],
    }).compile();

    service = module.get<InternatService>(InternatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
