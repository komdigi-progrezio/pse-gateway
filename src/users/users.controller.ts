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
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Client, Transport, ClientProxy } from '@nestjs/microservices';
import axios, { AxiosRequestConfig } from 'axios';
import * as querystring from 'querystring';
import { FileInterceptor, NoFilesInterceptor } from '@nestjs/platform-express';
import { getCachedData } from 'src/utils/getCachedData';
import { firstValueFrom } from 'rxjs';
import { multerOptions } from './config/users.config.upload';

@Controller('api/users')
@UseInterceptors(CacheInterceptor)
export class UsersController {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_USER_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_NOTIFICATION_SERVICE_PORT },
  })
  private readonly notificationClient: ClientProxy;

  @Get('/get/authenticated')
  async authenti(@Req() request: any) {
    try {
      const headers = request.headers;

      const token = headers.authorization?.split(' ')[1];
      if (!token) {
        return { message: 'Unauthorized' };
      }

      const cacheData = new getCachedData(this.jwtService, this.cacheService);
      const responseCached = await cacheData.account(token);

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
  async getDataLog(@Query() data: any, @Req() request: any) {
    // return request;

    const headers = request.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);
    const responseCached = await cacheData.account(token);

    const account_id = responseCached?.data?.id || null;

    data.account_id = account_id;

    return this.client.send('findAllUsersLog', data);
  }
  @Get('/change')
  async changeUser(@Query() request: any) {
    // return request;
    const data = request;
    return this.client.send('findChangeUsersFilter', data);
  }
  @Get('/parent/account')
  async parent(@Query() data: any, @Req() request: any) {
    if (data.parent_id) {
      return this.client.send('parentUserFilter', data);
    } else {
      const headers = request.headers;
      const token = headers.authorization?.split(' ')[1];
      if (!token) {
        return { message: 'Unauthorized' };
      }

      const cacheData = new getCachedData(this.jwtService, this.cacheService);
      const responseCached = await cacheData.account(token);

      const parent_id = responseCached?.data?.id || null;

      data.parent_id = parent_id;

      return this.client.send('parentUserFilter', data);
    }
  }

  @Get('/new/manager/:id')
  async newManager(@Param('id') id: number) {
    return this.client.send('newManager', id);
  }

  @Post('/:id/official')
  @UseInterceptors(NoFilesInterceptor())
  async updateUser(@Param('id') id: number, @Body() data: any) {
    data.id = id;
    return this.client.send('updateProfile', data);
  }

  @Post('/:id/profile')
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
  async enableUsers(
    @Param('id') id: number,
    @Param('status') status: string,
    @Req() req: any,
  ) {
    const headers = req.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    if (status === 'enable' || status === 'disable') {
      const user = await firstValueFrom(this.client.send('findOneUser', id));
      let keycloakId: string;
      if (status === 'enable') {
        const existUser = await this.getUserByEmail(user.data.username, token);
        if (!existUser) {
          const data = {
            firstName: user.data.nama,
            email: user.data.username,
            enabled: true,
            username: user.data.username,
            credentials: [
              {
                type: 'password',
                value: user.data.username,
                temporary: true,
              },
            ],
          };
          if (user.data.is_admin) {
            data['groups'] = ['Admin'];
          }
          const newUserResp = await this.createUser(data, token);
          const existUser = await this.getUserByEmail(
            user.data.username,
            token,
          );
          keycloakId = existUser.id;
        } else {
          keycloakId = existUser.id;
        }
      }

      const request = {
        status,
        id,
        keycloakId,
      };

      const resp = await firstValueFrom(
        this.client.send('changeStatusUser', request),
      );
      if (
        resp.status !== undefined &&
        resp.status == 200 &&
        status === 'enable'
      ) {
        // send email notification
        await firstValueFrom(
          this.notificationClient.send(
            'pejabatPendaftarAktivasi',
            user.data.username,
          ),
        );
      }

      return resp;
    }
  }

  @Get('/dropdown')
  async dropdown(@Query() request: any) {
    return this.client.send('dropdownUser', request);
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
  @UseInterceptors(FileInterceptor('dokumen', multerOptions))
  async storeParent(@Body() body: any, @Req() request: any) {
    // console.log('asd');
    const headers = request.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);
    const responseCached = await cacheData.account(token);

    const account_id = responseCached?.data?.id || null;

    body.account_id = account_id;

    const resp = await firstValueFrom(this.client.send('storeParent', body));
    if (resp.id !== undefined && resp.id != 0) {
      const user = await firstValueFrom(
        this.client.send('findOneUser', resp.id),
      );
      // send email notification
      await firstValueFrom(
        this.notificationClient.send('pendaftaranSubPejabat', user.data),
      );
    }

    delete resp.id;
    return resp;
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeUser', id);
  }

  private async getUserByEmail(
    email: string,
    bearerToken: string,
  ): Promise<any> {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
      params: {
        email: email,
      },
    };

    try {
      const response = await axios.get(
        `${process.env.KEYCLOACK_DOMAIN}/admin/realms/SPBE/users`,
        config,
      );
      const userData = response.data;
      return userData.length > 0 ? userData[0] : null;
    } catch (error) {
      throw error;
    }
  }

  private async createUser(data: any, bearerToken: string): Promise<any> {
    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
    };

    try {
      const response = await axios.post(
        `${process.env.KEYCLOACK_DOMAIN}/admin/realms/SPBE/users`,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
