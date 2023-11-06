import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('api/parinstansi')
export class ParinstansiController {
  @Client({ transport: Transport.TCP, options: { port: 3002 } })
  private readonly client: ClientProxy;

  @Get()
  async findaAll() {
    return this.client.send('findAllParinstansi', 'all');
  }
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return this.client.send('findOneParinstansi', id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.client.send('createParinstansi', data);
  }

  @Get('/filter/approved')
  async getDataApproved(@Query() request: any) {
    return this.client.send('getDataApproved', request);
  }
  @Get('/not/approved')
  async getDataNot(@Query() request: any) {
    return this.client.send('getDataNot', request);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeParinstansi', id);
  }
}
