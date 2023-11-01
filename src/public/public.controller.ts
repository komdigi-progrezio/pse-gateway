import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('api/public')
export class PublicController {
  @Client({ transport: Transport.TCP, options: { port: 3002 } })
  private readonly client: ClientProxy;

  @Get('/agency/group')
  async publicparconfig() {
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
  //   @Get('/parinstansi/filter')
  //   async filterPublickotaPerProvince(@Param('id') id: number) {
  //     return this.client.send('filterPublickotaPerProvince', id);
  //   }

  @Post('/pejabat')
  async storePejabat(@Body() data: any) {
    return this.client.send('storePejabatPublic', data);
  }

  @Post('/provinsi')
  async storePublicPropinsi(@Body() data: any) {
    return this.client.send('storePublicPropinsi', data);
  }
}
