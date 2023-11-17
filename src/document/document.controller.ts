import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

import { multerOptions } from './config/config.upload';
import * as uuid from 'uuid';

@Controller('api/document')
export class DocumentController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_CORE_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Post()
  uploadFile(@Body() body: any) {
    body.id = uuid.v4();
    return this.client.send('createDocument', body);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeDocument', id);
  }

  @Post('/:id')
  async update(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateDocument', body);
  }
}
