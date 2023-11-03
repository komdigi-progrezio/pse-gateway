import { Controller, Get, Query } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('api/parinstansi')
export class ParinstansiController {
  @Client({ transport: Transport.TCP, options: { port: 3002 } })
  private readonly client: ClientProxy;

  @Get('/filter/approved')
  async getDataApproved(@Query() request: any) {
    return this.client.send('getDataApproved', request);
  }
  @Get('/not/approved')
  async getDataNot(@Query() request: any) {
    return this.client.send('getDataNot', request);
  }
}
