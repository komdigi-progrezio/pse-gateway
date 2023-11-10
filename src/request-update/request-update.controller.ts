import { Controller, Get, Query } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('api/request-update')
export class RequestUpdateController {
  @Client({ transport: Transport.TCP, options: { port: 3003 } })
  private readonly client: ClientProxy;

  @Get('/filter')
  async getFilter(@Query() request: any) {
    return this.client.send('findAllRequestUpdate', request);
  }
}
