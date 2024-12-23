import { JwtService } from '@nestjs/jwt';
import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Body,
  Delete,
  Req,
  UseInterceptors,
  Inject,
  Injectable,
  Res,
  UploadedFile,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Client, Transport, ClientProxy } from '@nestjs/microservices';
import axios, { AxiosRequestConfig } from 'axios';
import * as querystring from 'querystring';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { getCachedData } from 'src/utils/getCachedData';
import { firstValueFrom, take } from 'rxjs';
import { Request, Response, response } from 'express';
import { ClientNotificationSend } from 'src/utils/clientNotificationSend';
import { saveHost, savePort } from 'src/utils/app';

@Controller('api/reason-log')
@UseInterceptors(CacheInterceptor)
export class ReasonLogController {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  @Client({
    transport: Transport.TCP,
    options: {
      host: saveHost(process.env.PSE_CORE_SERVICE_HOST),
      port: savePort(process.env.PSE_CORE_SERVICE_PORT),
    },
  })
  private readonly client: ClientProxy;

  @Get('/user-list')
  async reasonLogList(@Req() request: any) {
    const headers = request.headers;
    const token = headers.authorization?.split(' ')[1];
    
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);
    const responseCached = await cacheData.account(token);
    const account_id = responseCached?.data?.id || null;

    return this.client.send('reasonLogUserList', account_id);
  }

  @Post('/send-reason')
  @UseInterceptors(NoFilesInterceptor())
  async sendReason(@Body() data: any) {
    console.log('logSendReason === ', data)
    return this.client.send('sendReason', data)
  }
}