import {
  Controller,
  Get,
  Query,
  Param,
  Post,
  Body,
  Delete,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { saveHost, savePort } from 'src/utils/app';

@Controller('api/parinstansi')
export class ParinstansiController {
  @Client({
    transport: Transport.TCP,
    options: {
      host: saveHost(process.env.PSE_MASTERDATA_SERVICE_HOST),
      port: savePort(process.env.PSE_MASTERDATA_SERVICE_PORT),
    },
  })
  private readonly client: ClientProxy;

  @Get()
  async findaAll() {
    return this.client.send('findAllParinstansi', 'all');
  }
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return this.client.send('findOneParinstansi', id);
  }
  @Get('/list/tree-view')
  async listTreeView(@Query() request: any) {
    return this.client.send('listTreeView', request);
  }
  @Get('/list/new-tree-view')
  async listNewTreeView(@Query() request: any) {
    return this.client.send('listNewTreeView', request);
  }
  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() data: any) {
    return this.client.send('createParinstansi', data);
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Param('id') id: number, @Body() data: any) {
    data.id = id;
    return this.client.send('updateParinstansi', data);
  }

  @Get('/filter/approved')
  async getDataApproved(@Query() request: any) {
    return this.client.send('getDataApproved', request);
  }
  @Get('/not/approved')
  async getDataNot(@Query() request: any) {
    return this.client.send('getDataNot', request);
  }

  @Patch('/approved/:id')
  async approvedParinstansi(@Param('id') id: number) {
    return this.client.send('approvedParinstansi', id);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeParinstansi', id);
  }
}
