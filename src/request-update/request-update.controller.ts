import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import {
  Controller,
  Get,
  Query,
  Post,
  UseInterceptors,
  Body,
  Param,
  Patch,
  Req,
} from '@nestjs/common';
import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { getCachedData } from 'src/utils/getCachedData';
import { firstValueFrom } from 'rxjs';

@Controller('api/request-update')
export class RequestUpdateController {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_CORE_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_NOTIFICATION_SERVICE_PORT },
  })
  private readonly clientNotification: ClientProxy;

  @Get('/filter')
  async getFilter(@Query() data: any, @Req() request: any) {
    const headers = request.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);
    const responseCached = await cacheData.account(token);
    // console.log(responseCached);

    const account_id = responseCached?.data || null;

    data.accountData = account_id;

    return this.client.send('findAllRequestUpdate', data);
  }
  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() body: any, @Req() request: any) {
    const headers = request.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);
    const responseCached = await cacheData.account(token);
    // console.log(responseCached);

    const account_id = responseCached?.data.id || null;

    body.account_id = account_id;
    // Lakukan sesuatu dengan files
    const resp = await firstValueFrom(
      this.client.send('createRequestUpdate', body),
    );

    if (resp.status !== undefined && resp.status == 200) {
      const request = {
        id: resp.id,
        user_id: account_id,
        sis_profil_id: body.sis_profil_id,
        reason: body.reason,
      };
      firstValueFrom(
        this.clientNotification.send('systemRequestUpdate', request),
      );
    }

    return resp;
  }

  @Patch('/approved/:id')
  async approve(@Param('id') id: number) {
    return this.client.send('approveUpdateRequestUpdate', id);
  }
  @Patch('/finished/:id')
  async finished(@Param('id') id: number) {
    return this.client.send('finishedRequestUpdate', id);
  }
}
