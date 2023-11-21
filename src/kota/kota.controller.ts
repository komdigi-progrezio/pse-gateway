import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('api/kota')
export class KotaController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_MASTER_DATA_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Get()
  async getAlldata() {
    const data = 'all';
    return this.client.send('findAllKota', data);
  }

  @Get('/filter')
  async filter(@Query() request: any) {
    // return request;
    return this.client.send('filterAllKota', request);
  }

  @Get('/:id')
  async show(@Param('id') id: number) {
    return this.client.send('findOneKota', id);
  }

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async store(@Body() request: any) {
    return this.client.send('createKota', request);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeKota', id);
  }
  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Param('id') id: number, @Body() data: any) {
    data.id = id;
    return this.client.send('updateKota', data);
  }
}
