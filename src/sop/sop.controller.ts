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

@Controller('api/sop')
export class SopController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_CORE_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() body: any, @Res() res: Response) {
    const createSop = await this.client.send('createSop', body).toPromise();

    const progress = new checkProgress();

    await progress.sendMail(body.sis_profil_id);

    res.send(createSop);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeSop', id);
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateSop', body);
  }
}
