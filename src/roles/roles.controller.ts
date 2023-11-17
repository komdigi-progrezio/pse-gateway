import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Client, Transport, ClientProxy } from '@nestjs/microservices';

@Controller('api/roles')
export class RolesController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_USER_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Get('/filter')
  async getAllRoles(@Query() request: any) {
    return this.client.send('findAllRoles', request);
  }

  @Get('/:id')
  async findOneRole(@Param() id: number) {
    return this.client.send('findOneRole', id);
  }

  @Post()
  async store(@Body() body: any) {
    return this.client.send('createRole', body);
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() data: any) {
    data.id = id;
    return this.client.send('updateRole', data);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeRole', id);
  }
}
