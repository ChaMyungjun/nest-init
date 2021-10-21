import { Injectable } from '@nestjs/common';
import { config, msg } from 'coolsms-node-sdk';

@Injectable()
export class SmsService {
  async sendSms(): Promise<any> {
    config.init({
      apiKey: 'NCSPWXTYSRAQYSNA',
      apiSecret: 'AMZPOOLDTZMLYG84UTDOQWXRKYAGA9FA',
    });

    //example data
    // messages: [
    //     {
    //       to: '01000000001',
    //       from: '029302266',
    //       text: '한글 45자, 영자 90자 이하 입력되면 자동으로 SMS타입의 메시지가 발송됩니다.'
    //     },
    //     {
    //       to: '01000000002',
    //       from: '029302266',
    //       text: '한글 45자, 영자 90자 이상 입력되면 자동으로 LMS타입의 문자메시지가 발송됩니다. 0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    //     }

    //     // ...
    //     // 1만건까지 추가 가능
    //   ]

    const TestData = {
      messages: [{ to: '01054454022', from: '01054454022', text: 'test' }],
    };

    let result = {};

    try {
      result = await msg.send(TestData);
    } catch (err) {
      console.error('Error Status Code: ', err.statusCode);
      console.error('Error Code: ', err.error.errorCode);
      console.error('Error Error Message: ', err.error.errorMessage);
    }

    return result;
  }
}
