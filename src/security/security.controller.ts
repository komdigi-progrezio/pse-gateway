import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('api/security')
export class SecurityController {
  @Client({ transport: Transport.TCP, options: { port: 3003 } })
  private readonly client: ClientProxy;

  @Post()
  async create(@Body() data: any) {
    return this.client.send('createSecurity', data);
  }

  @Post('/:id')
  async update(@Param('id') id: number, @Body() data: any) {
    data.id = id;
    return this.client.send('updateSecurity', data);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeSecurity', id);
  }
}
