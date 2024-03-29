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
import { saveHost, savePort } from 'src/utils/app';

@Controller('api/related')
export class RelatedController {
  @Client({
    transport: Transport.TCP,
    options: {
      host: saveHost(process.env.PSE_CORE_SERVICE_HOST),
      port: savePort(process.env.PSE_CORE_SERVICE_PORT),
    },
  })
  private readonly client: ClientProxy;

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() body: any) {
    return this.client.send('createRelated', body);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeRelated', id);
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateRelated', body);
  }
}
