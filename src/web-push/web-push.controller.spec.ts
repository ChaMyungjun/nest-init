import { Test, TestingModule } from '@nestjs/testing';
import { WebPushController } from './web-push.controller';

describe('WebPushController', () => {
  let controller: WebPushController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebPushController],
    }).compile();

    controller = module.get<WebPushController>(WebPushController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
