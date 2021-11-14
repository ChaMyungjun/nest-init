import { Controller, Get, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WebPushService } from './web-push.service';

@Controller('web-push')
@ApiTags('web-push API')
export class WebPushController {
  constructor(private readonly webPushService: WebPushService) {}

  @Get('/register')
  @ApiOperation({
    summary: 'web push 등록',
    description: 'web push subscription',
  })
  async Register(@Request() req): Promise<any> {
    return this.webPushService.TokenRegister(req);
  }

  @Get('/notify')
  @ApiOperation({
    summary: 'web push 내용',
    description: 'web push 전달 내용',
  })
  async Notification(@Request() req): Promise<any> {
    return this.webPushService.Notification();
  }
}
