import { Body, Controller, Param, Post, Delete } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('api/hardwares')
export class HardwaresController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_CORE_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Post()
  async create(@Body() body: any) {
    return this.client.send('createHardware', body);
  }
  @Post('/networks')
  async createNetwork(@Body() body: any) {
    return this.client.send('createNetwork', body);
  }
  @Post('/peripherals')
  async createperipherals(@Body() body: any) {
    return this.client.send('createPeripheral', body);
  }

  @Delete('/networks/:id')
  async destroyNetworks(@Param('id') id: number) {
    return this.client.send('removeNetwork', id);
  }
  @Delete('/peripherals/:id')
  async destroyPeripheral(@Param('id') id: number) {
    return this.client.send('removePeripheral', id);
  }
  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeHardware', id);
  }

  @Post('/networks/:id')
  async updateNetwork(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateNetwork', body);
  }
  @Post('/peripherals/:id')
  async updatePeripheral(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updatePeripheral', body);
  }

  @Post('/:id')
  async update(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateHardware', body);
  }
}
