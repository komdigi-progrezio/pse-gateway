import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';

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

  @Post('/pejabat')
  @UseInterceptors(NoFilesInterceptor())
  async storePejabat(@Body() data: any) {
    return this.client.send('storePejabatPublic', data);
  }

  @Post('/provinsi')
  @UseInterceptors(NoFilesInterceptor())
  async storePublicPropinsi(@Body() data: any) {
    return this.client.send('storePublicPropinsi', data);
  }
}
