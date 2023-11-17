import { Controller, Post } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('api')
export class ApiController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_USER_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Post('/setup/admin/coy')
  async setupAdmin() {
    return this.client.send('setupAdmin', 'all');
  }
}
