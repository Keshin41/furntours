import { Test, TestingModule } from '@nestjs/testing';
import { InternatController } from './internat.controller';

describe('InternatController', () => {
  let controller: InternatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InternatController],
    }).compile();

    controller = module.get<InternatController>(InternatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
