import { Injectable } from '@nestjs/common';
import { PrivateKey, PublicKey } from './constants';
import { sendNotification, PushSubscription } from 'web-push';

@Injectable()
export class WebPushService {
  constructor() {}
  tokenList: PushSubscription[] = [];

  async TokenRegister(subscription: any): Promise<any> {
    this.tokenList.push(subscription);

    return 'success';
  }

  async Notification(): Promise<any> {
    const options = {
      TTL: 24 * 60 * 60,
      vapidDetails: {
        subject: 'http://localhost:3000',
        publicKey: PublicKey,
        privateKey: PrivateKey,
      },
    };

    const payload = JSON.stringify({
      title: 'Web Notification',
      body: '웹 알림입니다.',
      icon: 'https://ww.namu.la/s/0cc69cc298da69d330b1a720314a35dfb703f5bc166b717ae56d9137cd595c7b7a16d0df94dc3e3bebf7a94162f226187120847147f72beb362db3b31f18da040be9d9f8962249bae35de8dcd977951b6fb2223c7a48257674bccc7110201487',
      tag: 'default tag',
    });

    try {
      await Promise.all(
        this.tokenList.map((t) => sendNotification(t, payload, options)),
      );
    } catch (error) {
      console.error(error);
    }

    return 'success';
  }
}
