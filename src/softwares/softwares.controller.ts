import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('api/softwares')
export class SoftwaresController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_CORE_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() body: any) {
    return this.client.send('createSoftware', body);
  }

  @Post('/tools')
  @UseInterceptors(NoFilesInterceptor())
  async createNetwork(@Body() body: any) {
    return this.client.send('createSoftwareTool', body);
  }
  @Delete('/tools/:id')
  async destroyNetworks(@Param('id') id: number) {
    return this.client.send('removeSoftwareTool', id);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeSoftware', id);
  }

  @Post('/tools/:id')
  @UseInterceptors(NoFilesInterceptor())
  async updateNetwork(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateSoftwareTool', body);
  }
  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateSoftware', body);
  }
}
