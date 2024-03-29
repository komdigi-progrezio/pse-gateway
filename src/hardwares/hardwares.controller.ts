import {
  Body,
  Controller,
  Param,
  Post,
  Delete,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { checkProgress } from 'src/utils/checkProgress';
import { saveHost, savePort } from 'src/utils/app';

@Controller('api/hardwares')
export class HardwaresController {
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
  async create(@Body() body: any, @Res() res: Response) {
    const createHardware = await this.client
      .send('createHardware', body)
      .toPromise();

    const progress = new checkProgress();

    await progress.sendMail(body.sis_profil_id);

    res.send(createHardware);
  }
  @Post('/networks')
  @UseInterceptors(NoFilesInterceptor())
  async createNetwork(@Body() body: any) {
    return this.client.send('createNetwork', body);
  }
  @Post('/peripherals')
  @UseInterceptors(NoFilesInterceptor())
  async createperipherals(@Body() body: any) {
    return this.client.send('createPeripheral', body);
  }

  @Delete('/networks/:id')
  async destroyNetworks(@Param('id') id: number) {
    return this.client.send('removeNetwork', id);
  }
  @Delete('/peripherals/:id')
  async destroyPeripheral(@Param('id') id: number) {
    return this.client.send('removePeripheral', id);
  }
  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeHardware', id);
  }

  @Post('/networks/:id')
  @UseInterceptors(NoFilesInterceptor())
  async updateNetwork(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateNetwork', body);
  }
  @Post('/peripherals/:id')
  @UseInterceptors(NoFilesInterceptor())
  async updatePeripheral(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updatePeripheral', body);
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateHardware', body);
  }
}
