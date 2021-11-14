import { Module } from '@nestjs/common';
import { WebPushService } from './web-push.service';
import { WebPushController } from './web-push.controller';

@Module({
  providers: [WebPushService],
  controllers: [WebPushController]
})
export class WebPushModule {}
