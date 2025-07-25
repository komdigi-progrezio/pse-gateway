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
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { saveHost, savePort } from 'src/utils/app';
import { multerOptions } from './config/document.config.upload';
import * as uuid from 'uuid';
import { readFileSync } from 'fs';

@Controller('api/document')
export class DocumentController {
  @Client({
    transport: Transport.TCP,
    options: {
      host: saveHost(process.env.PSE_CORE_SERVICE_HOST),
      port: savePort(process.env.PSE_CORE_SERVICE_PORT),
    },
  })
  private readonly client: ClientProxy;

  @Post()
  @UseInterceptors(FileInterceptor('dokumen'))
  async uploadFile(@UploadedFile() file: any, @Body() body: any) {
    try {
      body.id = uuid.v4();
      file.body = body;

      const result = await this.client.send('createDocument', file).toPromise();
      return result;
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeDocument', id);
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateDocument', body);
  }
}
