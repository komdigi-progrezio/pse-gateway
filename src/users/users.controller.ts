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
  Inject, Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Client, Transport, ClientProxy } from '@nestjs/microservices';
import axios from 'axios';
import * as querystring from 'querystring';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('api/users')
@UseInterceptors(CacheInterceptor)
export class UsersController {

  constructor(private jwtService: JwtService, @Inject(CACHE_MANAGER) private cacheService: Cache) {}

  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_USER_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Get('/get/authenticated')
  async authenti(@Req() request: any) {
    try {
      const headers = request.headers;

      const token = headers.authorization?.split(' ')[1];
      if (!token) {
        return { message: 'Unauthorized' };
      }

      const decoded = await this.jwtService.decode(token);
      const email = decoded.email;
      const responseCached = await this.getCachedData(token, email);

      return responseCached;
    } catch (error) {
      return {
        status: 403,
        message:
          'Akun Anda Belum Aktif. Silahkan Tunggu Admin Untuk Menverifikasi Data Anda',
        error,
      };
    }
  }

  @Get('/filter')
  async getAdminData(@Query() request: any) {
    let data = request;
    data.roles = 'admin';

    return this.client.send('findAllUsersFilter', data);
  }

  @Get('/filter/official')
  async getData(@Query() request: any) {
    // return request;
    const data = request;
    return this.client.send('findAllUsersFilter', data);
  }
  @Get('/filter/officiallog')
  async getDataLog(@Query() request: any) {
    // return request;
    const data = request;
    return this.client.send('findAllUsers', data);
  }
  @Get('/change')
  async changeUser(@Query() request: any) {
    // return request;
    const data = request;
    return this.client.send('findChangeUsersFilter', data);
  }
  @Get('/parent/account')
  async parent(@Query() request: any) {
    // return request;
    const data = request;
    return this.client.send('parentUserFilter', data);
  }

  @Get('/new/manager/:id')
  async newManager(@Param('id') id: number) {
    return this.client.send('newManager', id);
  }

  @Patch('/:id/profile')
  @UseInterceptors(NoFilesInterceptor())
  async updateProfile(@Param('id') id: number, @Body() data: any) {
    data.id = id;
    return this.client.send('updateProfile', data);
  }
  @Patch('/approved/account/change')
  @UseInterceptors(NoFilesInterceptor())
  async approvedAccountChange(@Body() data: any) {
    return this.client.send('approvedAccountChange', data);
  }

  @Patch('/:status/:id')
  async enableUsers(@Param('id') id: number, @Param('status') status: string) {
    const request = {
      status,
      id,
    };
    if (status === 'enable' || status === 'disable') {
      return this.client.send('changeStatusUser', request);
    }
  }

  @Get('/:id')
  async viewData(@Param('id') id: number, @Query() request: any) {
    return this.client.send('findOneUser', id);
  }

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async store(@Body() body: any) {
    return this.client.send('createUser', body);
  }

  @Post('/logout')
  @UseInterceptors(NoFilesInterceptor())
  async logout(@Body() data: any) {
    // return data;

    try {
      const payload = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: data.refresh_token,
      };

      const logout = await axios.post(
        `${process.env.KEYCLOACK_DOMAIN}/realms/SPBE/protocol/openid-connect/logout`,
        querystring.stringify(payload), // Mengonversi payload ke format x-www-form-urlencoded
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return {
        status: 200,
        message: 'Logged out successfully',
      };
    } catch (error) {
      return {
        status: 500,
        message: error,
      };
    }
  }

  @Post('/notification-token')
  @UseInterceptors(NoFilesInterceptor())
  async notifToken(@Body() data: any) {
    return this.client.send('notifToken', data);
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Param('id') id: number, @Body() body: any) {
    body.id = id;

    return this.client.send('updateUser', body);
  }
  @Post('/parent/account')
  @UseInterceptors(NoFilesInterceptor())
  async storeParent(@Param('id') id: number, @Body() body: any) {
    body.id = id;

    return this.client.send('storeParent', body);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeUser', id);
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
