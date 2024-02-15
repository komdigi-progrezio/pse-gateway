import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { checkProgress } from 'src/utils/checkProgress';

@Controller('api/availability-of-experts')
export class AvailabilityOfExpertsController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_CORE_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() body: any, @Res() res: Response) {
    const createAvailabilityOfExpert = await this.client
      .send('createAvailabilityOfExpert', body)
      .toPromise();

    const progress = new checkProgress();

    await progress.sendMail(body.sis_profil_id);

    res.send(createAvailabilityOfExpert);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeAvailabilityOfExpert', id);
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateAvailabilityOfExpert', body);
  }
}
