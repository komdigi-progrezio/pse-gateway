import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Delete,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('api/provinsi')
export class ProvinsiController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_MASTER_DATA_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Get()
  async getAllData() {
    const data = 'daat';
    return this.client.send('findAllProvinsi', data);
  }

  @Get('/filter')
  async filter(@Query() request: any) {
    return this.client.send('filterProvinsi', request);
  }

  @Get('/:id')
  async show(@Param() data: any) {
    // return data.id;
    return this.client.send('findOneProvinsi', data.id);
  }
  @Get('/:id/kota')
  async filterPerProvince(@Param() data: any) {
    // return data.id;
    return this.client.send('filterPerProvince', data.id);
  }

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() data: any) {
    return this.client.send('createProvinsi', data);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeProvinsi', id);
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Param('id') id: number, @Body() data: any) {
    data.id = id;

    return this.client.send('updateProvinsi', data);
  }
}
