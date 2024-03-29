import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './config/document.certificate.upload';
import { saveHost, savePort } from 'src/utils/app';
import * as uuid from 'uuid';

@Controller('api/certificate')
export class CertificateController {
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
  async create(@Body() body: any, @UploadedFile() file: any) {
    body.id = uuid.v4();
    file.body = body;

    return this.client.send('createCertificate', file);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeCertificate', id);
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateCertificate', body);
  }
}
