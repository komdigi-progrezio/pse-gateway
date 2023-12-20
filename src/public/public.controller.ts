import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './config/public.config.upload';
import { Response } from 'express';

@Controller('api/public')
export class PublicController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_MASTER_DATA_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Get('parconfig/agency/group')
  async publicparconfig() {
    const data = 'all';
    return this.client.send('Publicparconfig', data);
  }
  @Get('/agency/group')
  async publicparconfigagency() {
    const data = 'all';
    return this.client.send('Publicparconfig', data);
  }
  @Get('/provinsi')
  async publicProvinsiGet() {
    const data = 'all';
    return this.client.send('publicProvinsiGet', data);
  }
  @Get('/provinsi/:id/kota')
  async filterPublickotaPerProvince(@Param('id') id: number) {
    return this.client.send('filterPublickotaPerProvince', id);
  }
  @Get('/parinstansi/filter')
  async filterParinstansi(@Query() request: any) {
    return this.client.send('filterParinstansi', request);
  }
  @Get('/certificate/:id')
  async sealid(@Param('id') id: number) {
    return this.client.send('sealidPublic', id);
  }

  @Post('/pejabat')
  @UseInterceptors(FileInterceptor('dokumen', multerOptions))
  async storePejabat(@Body() data: any, @Res() res: Response) {
    const response = await this.client
      .send('storePejabatPublic', data)
      .toPromise();

    console.log(response);

    if (response.status === 500) {
      return res.status(502).send(response);
    } else {
      return res.status(201).send(response);
    }
  }

  @Post('/provinsi')
  @UseInterceptors(NoFilesInterceptor())
  async storePublicPropinsi(@Body() data: any) {
    return this.client.send('storePublicPropinsi', data);
  }

  @Post('/parinstansi')
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() data: any) {
    return this.client.send('createParinstansi', data);
  }
}
