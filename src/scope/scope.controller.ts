import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Res,
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
import { Response } from 'express';

@Controller('api/scope')
export class ScopeController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_CORE_SERVICE_PORT },
  })
  private readonly client: ClientProxy;
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_NOTIFICATION_SERVICE_PORT },
  })
  private readonly notifClient: ClientProxy;

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() body: any, @Res() res: Response) {
    // Lakukan sesuatu dengan files
    const createScope = await this.client.send('createScope', body).toPromise();

    await this.notifClient
      .send('checkProgressSystem', body.sis_profil_id)
      .toPromise();

    res.status(200).send(createScope);
  }
  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateScope', body);
  }

  @Delete('/:id')
  async destryoy(@Param('id') id: number) {
    return this.client.send('removeScope', id);
  }
}
