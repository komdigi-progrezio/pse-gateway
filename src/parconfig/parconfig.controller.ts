import { Controller, Get, Query } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('api/parconfig')
export class ParconfigController {
  @Client({ transport: Transport.TCP, options: { port: 3002 } })
  private readonly client: ClientProxy;

  @Get()
  async findAllParconfig() {
    return this.client.send('findAllParconfig', 'all');
  }
  @Get('/filter')
  async filterAllParConfig(@Query() request: any) {
    return this.client.send('filterAllParConfig', request);
  }
  @Get('/category')
  async categoryAllParConfig(@Query() request: any) {
    return this.client.send('categoryAllParConfig', request);
  }
}
