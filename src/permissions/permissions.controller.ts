
import { Body, Controller, Get, Param, Query, Post, UseInterceptors } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { saveHost, savePort } from 'src/utils/app';

@Controller('api/permissions')
export class PermissionsController {
  @Client({
    transport: Transport.TCP,
    options: {
      host: saveHost(process.env.PSE_USER_SERVICE_HOST),
      port: savePort(process.env.PSE_USER_SERVICE_PORT),
    },
  })
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

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Param('id') id: number, @Body() data: any) {
    data.id = id;
    return this.client.send('updatePermission', data);
  }
}
