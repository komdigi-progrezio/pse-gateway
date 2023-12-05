import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  UseInterceptors,
  Req,
  Body,
  Patch,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { getCachedData } from 'src/utils/getCachedData';
import { firstValueFrom } from 'rxjs';

@Controller('api/systems')
export class SystemsController {
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

  @Get()
  async findAll() {
    return this.client.send('findAllSystems', 'all');
  }

  @Get('/me/approved')
  async approved(@Req() request: any) {
    const headers = request.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);

    const decoded = await cacheData.getDecodedToken(token);

    const responseCached = await cacheData.account(token, decoded.email);

    const account_id = responseCached?.data?.id || null;

    return this.client.send('meApprovedSystem', account_id);
  }

  @Get('/repository')
  async repositoryAll(@Query() request: any) {
    return this.client.send('repositorySystem', request);
  }
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return this.client.send('findOneSystem', id);
  }

  @Get('/filter/approved')
  async filerApprove(@Query() request: any) {
    return this.client.send('filterApproveSystem', request);
  }
  @Get('/filter/disapproved')
  async filerDisApprove(@Query() request: any) {
    return this.client.send('filterDisApproveSystem', request);
  }

  @Get('/:id/edit')
  async findEdit(@Param('id') id: number) {
    return this.client.send('findEditSystem', id);
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Body() body: any, @Param('id') id: number) {
    body.id = id;
    const resp = await firstValueFrom(this.client.send('updateSystem', body));
    
    if (resp.status !== undefined && resp.status == 200) {
      const system = await firstValueFrom(this.client.send('findOneSystem', id))
      await firstValueFrom(this.clientNotification.send('pendaftaranSeBaru', system.data))
      await firstValueFrom(this.clientNotification.send('systemRegistration', system.data))
    }
    return resp
  }

  @Patch('/approved/:id')
  @UseInterceptors(NoFilesInterceptor())
  async approve(@Param('id') id: number, @Body() body: any) {
    // return id;
    const resp = await firstValueFrom(this.client.send('approveSystem', id));

    if (resp.status !== undefined && resp.status == 200) {
      const system = await firstValueFrom(this.client.send('findOneSystem', id))
      await firstValueFrom(this.clientNotification.send('systemRegistrationApproved', system.data))      
    }
    
    return resp
  }
}
