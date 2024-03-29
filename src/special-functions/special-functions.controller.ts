import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { saveHost, savePort } from 'src/utils/app';
import { Response, response } from 'express';

@Controller('api/special-functions')
export class SpecialFunctionsController {
  @Client({
    transport: Transport.TCP,
    options: {
      host: saveHost(process.env.PSE_CORE_SERVICE_HOST),
      port: savePort(process.env.PSE_CORE_SERVICE_PORT),
    },
  })
  private readonly client: ClientProxy;

  @Client({
    transport: Transport.TCP,
    options: {
      host: saveHost(process.env.PSE_NOTIFICATION_SERVICE_HOST),
      port: savePort(process.env.PSE_NOTIFICATION_SERVICE_PORT),
    },
  })
  private readonly notifClient: ClientProxy;

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() data: any, @Res() res: Response) {
    const createSpecialFunction = await this.client
      .send('createSpecialFunction', data)
      .toPromise();

    await this.notifClient
      .send('checkProgressSystem', data.sis_profil_id)
      .toPromise();

    res.status(200).send(createSpecialFunction);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeSpecialFunction', id);
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Param('id') id: number, @Body() data: any) {
    data.id = id;
    return this.client.send('updateSpecialFunction', data);
  }
}
