import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('api/service-users')
export class ServiceUsersController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_CORE_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Post()
  async create(@Body() body: any) {
    return this.client.send('createServiceUser', body);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeServiceUser', id);
  }

  @Post('/:id')
  async update(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateServiceUser', body);
  }
}
