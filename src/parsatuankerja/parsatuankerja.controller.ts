import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('api/parsatuankerja')
export class ParsatuankerjaController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_MASTER_DATA_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Get('/filter')
  async showwData(@Query() request: any) {
    return this.client.send('filterAllParsatuankerja', request);
  }

  @Get('/list/tree-view')
  async treeView() {
    return [];
  }

  @Get('/:id/parinstansi')
  async filterPerAgency(@Param('id') id: number) {
    return this.client.send('filterPerAgency', id);
  }

  @Get('/:id/parinstansi/dropdown')
  async filterPerAgencyDropdown(@Param('id') id: number) {
    // return 'asd';
    return this.client.send('filterPerAgencyDropdown', id);
  }

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() data: any) {
    return this.client.send('createParsatuankerja', data);
  }
}
