import { Client, ClientProxy, Transport,ClientProxyFactory } from '@nestjs/microservices';
import { Observable, Observer, firstValueFrom } from 'rxjs';
import { saveHost, savePort } from 'src/utils/app';
  
export class ClientNotificationSend {
    constructor(
      ) {
        this.client = ClientProxyFactory.create({
            transport: Transport.TCP,
            options: {
              host: saveHost(process.env.PSE_NOTIFICATION_SERVICE_HOST),
              port: savePort(process.env.PSE_NOTIFICATION_SERVICE_PORT),
            },
        });
      }

      private readonly client: ClientProxy;

    async send(target: any,data: any){
        try{
            const result = await firstValueFrom(
                this.client.send(target, data)
            )

            return result;
        }catch(e){
            console.log(e)

            return e
        }

    }
}