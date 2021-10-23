import { Injectable } from '@nestjs/common';
import { config, msg } from 'coolsms-node-sdk';

import { writeFile, readdir, appendFile } from 'fs';

@Injectable()
export class SmsService {
  async sendSms(): Promise<any> {
    config.init({
      apiKey: 'NCSPWXTYSRAQYSNA',
      apiSecret: 'AMZPOOLDTZMLYG84UTDOQWXRKYAGA9FA',
    });

    const FileInitialDate = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }-${new Date().getDate()}.txt`;

    const TestData = {
      messages: [{ to: '01054454022', from: '01054454022', text: 'test' }],
    };

    let result = {};

    // 2021-10-23.txt

    readdir('./', (err, list) => {
      if (err) {
        console.log('The file searching error');
        throw err;
      } else {
        if (list.includes(`${FileInitialDate}`)) {
          this.FileUpdate(FileInitialDate);
        } else {
          this.FileCraete(FileInitialDate);
        }
      }
    });

    try {
      result = await msg.send(TestData);
    } catch (err) {
      console.error('Error Status Code: ', err.statusCode);
      console.error('Error Code: ', err.error.errorCode);
      console.error('Error Error Message: ', err.error.errorMessage);
    }

    return result;
  }

  async FileCraete(name: string): Promise<any> {
    writeFile(`${name}`, 'test', (err) => {
      if (err === null) {
        console.log('The file create success');
      } else {
        console.log('The file create fail');
        throw err;
      }
    });
  }

  async FileUpdate(name: String): Promise<any> {
    appendFile(`${name}`, '\n data to append', 'utf8', (err) => {
      if (err) {
        throw err;
      } else {
        console.log('The "data to append" was appended to file!');
      }
    });
  }
}
