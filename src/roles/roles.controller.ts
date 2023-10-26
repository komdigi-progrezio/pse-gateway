import { Controller, Get, Query } from '@nestjs/common';
import { Client, Transport, ClientProxy } from '@nestjs/microservices';

@Controller('api/roles')
export class RolesController {
  @Client({ transport: Transport.TCP, options: { port: 3001 } })
  private readonly client: ClientProxy;

  @Get('/filter')
  async getAllRoles(@Query() request: any) {
    return this.client.send('findAllRoles', request);
  }
}
