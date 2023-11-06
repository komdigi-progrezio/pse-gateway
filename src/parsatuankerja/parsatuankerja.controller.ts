import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('api/parsatuankerja')
export class ParsatuankerjaController {
  @Client({ transport: Transport.TCP, options: { port: 3002 } })
  private readonly client: ClientProxy;

  @Get('/filter')
  async showwData(@Query() request: any) {
    return this.client.send('filterAllParsatuankerja', request);
  }

  @Get('/:id/parinstansi')
  async filterPerAgency(@Param('id') id: number) {
    return this.client.send('filterPerAgency', id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.client.send('createParsatuankerja', data);
  }
}
