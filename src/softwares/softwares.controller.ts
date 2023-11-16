import { Controller, Post, Body, Delete, Param } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('api/softwares')
export class SoftwaresController {
  @Client({ transport: Transport.TCP, options: { port: 3003 } })
  private readonly client: ClientProxy;

  @Post()
  async create(@Body() body: any) {
    return this.client.send('createSoftware', body);
  }

  @Post('/tools')
  async createNetwork(@Body() body: any) {
    return this.client.send('createSoftwareTool', body);
  }
  @Delete('/tools/:id')
  async destroyNetworks(@Param('id') id: number) {
    return this.client.send('removeSoftwareTool', id);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeSoftware', id);
  }

  @Post('/tools/:id')
  async updateNetwork(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateSoftwareTool', body);
  }
  @Post('/:id')
  async update(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateSoftware', body);
  }
}
