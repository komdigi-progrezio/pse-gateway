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
  Delete,
} from '@nestjs/common';
import { Cache } from 'cache-manager';

import { Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { getCachedData } from 'src/utils/getCachedData';
import { firstValueFrom } from 'rxjs';
import { ClientNotificationSend } from 'src/utils/clientNotificationSend';

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
    const responseCached = await cacheData.account(token);
    // console.log(responseCached);

    const account_id = responseCached?.data?.id || null;

    return this.client.send('meApprovedSystem', account_id);
  }

  @Get('/repository')
  async repositoryAll(@Query() request: any) {
    return this.client.send('repositorySystem', request);
  }
  @Get('/general')
  async generalSystem(@Query() request: any) {
    return this.client.send('generalSystem', request);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return this.client.send('findOneSystem', id);
  }

  @Get('/filter/approved')
  async filerApprove(@Query() request: any, @Req() req: any) {
    const headers = req.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);
    const responseCached = await cacheData.account(token);

    const account = responseCached?.data || null;

    request.account = account;

    return this.client.send('filterApproveSystem', request);
  }
  @Get('/filter/disapproved')
  async filerDisApprove(@Query() request: any,@Req() req: any) {
    const headers = req.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);
    const responseCached = await cacheData.account(token);

    const account = responseCached?.data || null;

    request.account = account;

    return this.client.send('filterDisApproveSystem', request);
  }

  @Get('/:id/edit')
  async findEdit(@Param('id') id: number) {
    return this.client.send('findEditSystem', id);
  }

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Req() request: any, @Body() body: any) {
    const clientNotification = new ClientNotificationSend();
    const headers = request.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);
    const responseCached = await cacheData.account(token);

    const account_id = responseCached?.data?.id || null;

    body.account_id = account_id;
    const resp = await firstValueFrom(this.client.send('createSystem', body));

    if (resp.status !== undefined && resp.status == 200) {
      const system = await firstValueFrom(
        this.client.send('findOneSystem', resp.id),
      );
      clientNotification.send('pendaftaranSeBaru', system.data);
      clientNotification.send('systemRegistration', system.data);
    }

    return resp
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Body() body: any, @Param('id') id: number) {
    body.id = id;
    return await firstValueFrom(this.client.send('updateSystem', body));
  }

  @Patch('/approved/publish/:id')
  @UseInterceptors(NoFilesInterceptor())
  async approvePublish(@Param('id') id: number) {
    const clientNotification = new ClientNotificationSend();
    const resp = await firstValueFrom(this.client.send(
      'approvePublishSystem',
      id,
    ));

    if (resp.status !== undefined && resp.status == 200) {
      const system = await firstValueFrom(this.client.send('findOneSystem', id));
      clientNotification.send('systemRegistrationInitial', system.data);
    }
    
    return resp;
  }

  @Patch('/approved/:id')
  @UseInterceptors(NoFilesInterceptor())
  async approve(@Param('id') id: number, @Body() body: any) {
    const clientNotification = new ClientNotificationSend();
    const resp = await firstValueFrom(this.client.send('approveSystem', id));

    if (resp.status !== undefined && resp.status == 200) {
      const system = await firstValueFrom(
        this.client.send('findOneSystem', id),
      );
      clientNotification.send('systemRegistrationApproved', system.data);
    }

    return resp;
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeSystem', id);
  }

  @Patch('/:id/locked')
  @UseInterceptors(NoFilesInterceptor())
  async lockedSystem(@Param('id') id: number) {
    return this.client.send('lockedSystem', id);
  }
}
