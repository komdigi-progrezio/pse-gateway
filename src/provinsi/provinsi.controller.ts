import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('api/provinsi')
export class ProvinsiController {
  @Client({ transport: Transport.TCP, options: { port: 3002 } })
  private readonly client: ClientProxy;

  @Get()
  async getAllData() {
    const data = 'daat';
    return this.client.send('findAllProvinsi', data);
  }

  @Get('/filter')
  async filter(@Query() request: any) {
    return this.client.send('filterProvinsi', request);
  }

  @Post()
  async create(@Body() data: any) {
    return this.client.send('createProvinsi', data);
  }
}
