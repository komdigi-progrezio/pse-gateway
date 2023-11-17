import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
  NoFilesInterceptor,
} from '@nestjs/platform-express';

@Controller('api/scope')
export class ScopeController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_CORE_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Post()
  async create(@Body() body: any) {
    // Lakukan sesuatu dengan files
    return this.client.send('createScope', body);
  }
  @Delete('/:id')
  async destryoy(@Param('id') id: number) {
    return this.client.send('removeScope', id);
  }
}
