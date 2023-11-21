import { JwtService } from '@nestjs/jwt';
import {
  Body,
  Controller,
  Delete,
  Get,
  Req,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
  Inject, 
  Injectable,
} from '@nestjs/common';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Client, Transport, ClientProxy } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('api/roles')
@UseInterceptors(CacheInterceptor)
export class RolesController {

  constructor(private jwtService: JwtService, @Inject(CACHE_MANAGER) private cacheService: Cache) {}

  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_USER_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Get('/filter')
  async getAllRoles(@Query() request: any) {
    return this.client.send('findAllRoles', request);
  }

  @Get('/:id')
  async findOneRole(@Param() id: number) {
    return this.client.send('findOneRole', id);
  }

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async store(@Req() request: any, @Body() body: any) {
    const headers = request.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const decoded = await this.jwtService.decode(token);
    const responseCached = await this.getCachedData(token, decoded.email);

    body.user_id = responseCached?.data?.id || null;
    return this.client.send('createRole', body);
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Param('id') id: number, @Body() data: any) {
    data.id = id;
    return this.client.send('updateRole', data);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeRole', id);
  }

  private async getCachedData(token: string, email: string): Promise<any> {
    let cacheData = await this.cacheService.get(email);
    if(cacheData === undefined){
      const ssoData = await this.fetchDataFromSso(token, email);
      const userData = await this.client.send('authUser', email).toPromise();
      if(userData && ssoData) {
        cacheData = userData || null
        this.cacheData(email, cacheData, ssoData.exp);
      }
    }
    return cacheData; 
  }

  private async fetchDataFromSso(token: string, email: string): Promise<any> {
    const url = `${process.env.KEYCLOACK_DOMAIN}/admin/realms/SPBE/users`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        email: email,
      },
    });

    return response?.data[0] || null;
  }

  async cacheData(email: string, data: any, keycloakExp: number): Promise<void> {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExp = keycloakExp - currentTime;

    await this.cacheService.set(email, data, timeUntilExp);
  }
}
