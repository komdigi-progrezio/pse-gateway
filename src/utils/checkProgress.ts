import {
  Client,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { saveHost, savePort } from 'src/utils/app';

export class checkProgress {
  constructor() {
    this.notifClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: saveHost(process.env.PSE_NOTIFICATION_SERVICE_HOST),
        port: savePort(process.env.PSE_NOTIFICATION_SERVICE_PORT),
      },
    });
  }
  private readonly notifClient: ClientProxy;

  async sendMail(sis_profil_id: any) {
    await this.notifClient
      .send('checkProgressSystem', sis_profil_id)
      .toPromise();
  }
}
