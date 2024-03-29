import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { Cache } from 'cache-manager';
import { getCachedData } from 'src/utils/getCachedData';
import { saveHost, savePort } from 'src/utils/app';

@Controller('api/organizers')
export class OrganizersController {
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

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() body: any) {
    return this.client.send('createOrganizer', body);
  }

  @Get('/list/tree-view/structure/:id')
  async organizationalStructure(
    @Param('id') id: any,
    @Query() query: any,
    @Req() request: any,
  ) {
    const headers = request.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);
    const responseCached = await cacheData.account(token);

    const payload = { id: id, user_id: responseCached.data.id, query: query };
    return this.client.send('organizationalStructure', payload);
  }
}
