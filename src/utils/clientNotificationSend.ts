  import { Client, ClientProxy, Transport,ClientProxyFactory } from '@nestjs/microservices';
  import { Observable, Observer, firstValueFrom } from 'rxjs';
  
  export class ClientNotificationSend {
    constructor(
      ) {
        this.client = ClientProxyFactory.create({
            transport: Transport.TCP,
            options: { port: +process.env.PSE_NOTIFICATION_SERVICE_PORT },
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