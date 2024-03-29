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
import { Response } from 'express';
import { checkProgress } from 'src/utils/checkProgress';
import { saveHost, savePort } from 'src/utils/app';

@Controller('api/security')
export class SecurityController {
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
  async create(@Body() data: any, @Res() res: Response) {
    const createSecure = await this.client
      .send('createSecurity', data)
      .toPromise();

    const progress = new checkProgress();

    await progress.sendMail(data.sis_profil_id);

    res.send(createSecure);
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Param('id') id: number, @Body() data: any) {
    data.id = id;
    return this.client.send('updateSecurity', data);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeSecurity', id);
  }
}
