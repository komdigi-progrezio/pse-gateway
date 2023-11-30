import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Inject,
  Query,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { Cache } from 'cache-manager';

@Controller('api/notifikasi')
export class NotifikasiController {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_AUDIT_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Get('/complete')
  async getComplete(@Query() request: any) {
    return this.client.send('getComplete', request);
  }

  @Get('/new')
  async getNew(@Query() request: any) {
    return this.client.send('getNew', request);
  }

  @Get('/pergantian')
  async getPergantian(@Query() request: any) {
    return this.client.send('getPergantian', request);
  }

  @Get('/pejabat-baru')
  async getPejabatBaru() {
    return this.client.send('getPejabatBaru', 'getPejabatBaru');
  }

  @Get('/perubahan')
  async getUbahData(@Query() request: any) {
    return this.client.send('getUbahData', request);
  }

}
