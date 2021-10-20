import { SmsService } from './sms.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('api/sms')
@ApiTags('유저 API')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Get()
  @ApiOperation({
    summary: 'sms 전송 API',
    description: '문자 전송을 해주는 API',
  })
  @ApiResponse({ description: '문자 전송을 해주는 API.' })
  async getTest(): Promise<string> {
    return this.smsService.sendSms();
  }
}
