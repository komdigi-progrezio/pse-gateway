import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Delete,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('api/parconfig')
export class ParconfigController {
  @Client({ transport: Transport.TCP, options: { port: 3002 } })
  private readonly client: ClientProxy;

  @Get()
  async findAllParconfig() {
    return this.client.send('findAllParconfig', 'all');
  }
  @Get('/filter')
  async filterAllParConfig(@Query() request: any) {
    return this.client.send('filterAllParConfig', request);
  }
  @Get('/category')
  async categoryAllParConfig(@Query() request: any) {
    return this.client.send('categoryAllParConfig', request);
  }
  @Get('/agency/group')
  async Agencyparconfig() {
    return this.client.send('Agencyparconfig', 'all');
  }
  @Get('/groupby/category')
  async parConfigbyCategory() {
    return this.client.send('parConfigbyCategory', 'all');
  }
  @Post()
  async createParconfig(@Body() data: any) {
    // return data;
    return this.client.send('createParconfig', data);
  }
  @Post('/:id')
  async update(@Param('id') id: number, @Body() request: any) {
    request.id = id;

    return this.client.send('updateParconfig', request);
  }
  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeParconfig', id);
  }
}
