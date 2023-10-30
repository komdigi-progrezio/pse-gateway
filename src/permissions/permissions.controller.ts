import { Controller, Get, Param, Query } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('api/permissions')
export class PermissionsController {
  @Client({ transport: Transport.TCP, options: { port: 3001 } })
  private readonly client: ClientProxy;

  @Get()
  async findAllPermissions() {
    return this.client.send('findAllPermissions', 'all');
  }

  @Get('/filter')
  async filterPermissions(@Query() request: any) {
    return this.client.send('filterPermissions', request);
  }

  @Get('/:id')
  async show(@Param('id') id: number) {
    return this.client.send('findOnePermission', id);
  }
}
