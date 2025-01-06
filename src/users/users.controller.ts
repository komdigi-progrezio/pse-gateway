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
import { multerOptions } from './config/users.config.upload';
import { Request, Response, response } from 'express';
import { ClientNotificationSend } from 'src/utils/clientNotificationSend';
import { saveHost, savePort } from 'src/utils/app';

@Controller('api/users')
@UseInterceptors(CacheInterceptor)
export class UsersController {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  @Client({
    transport: Transport.TCP,
    options: {
      host: saveHost(process.env.PSE_USER_SERVICE_HOST),
      port: savePort(process.env.PSE_USER_SERVICE_PORT),
    },
  })
  private readonly client: ClientProxy;

  @Client({
    transport: Transport.TCP,
    options: {
      host: saveHost(process.env.PSE_NOTIFICATION_SERVICE_HOST),
      port: savePort(process.env.PSE_NOTIFICATION_SERVICE_PORT),
    },
  })
  private readonly notificationClient: ClientProxy;

  @Get('/get/profil')
  async getProfil(@Req() request: any) {
    const headers = request.headers;

    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);
    const responseCached = await cacheData.account(token);

    const account_id = responseCached?.data?.id || null;

    return this.client.send('getProfilUser', account_id);
  }

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
  async changeUser(@Query() data: any, @Req() request: any) {
    // return request;

    const headers = request.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);
    const responseCached = await cacheData.account(token);
    // console.log(responseCached);

    data.account_id = responseCached?.data?.id || null;

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
  async updateUser(
    @Param('id') id: number,
    @Body() data: any,
    @Req() request: any,
  ) {
    data.id = id;

    const headers = request.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);
    const responseCached = await cacheData.account(token);

    const emailAccount = responseCached?.data?.email || null;

    await cacheData.clearCacheData(emailAccount);

    // Memeriksa status cache setelah penghapusan

    // Jika cache sudah dihapus, kirim permintaan updateProfile
    const result = await this.client.send('updateProfile', data).toPromise();
    return result;
  }

  @Post('/:id/profile')
  @UseInterceptors(NoFilesInterceptor())
  async updateProfile(
    @Param('id') id: number,
    @Body() data: any,
    @Req() request: any,
    @Res() res: Response,
  ) {
    data.id = id;

    const resp = await firstValueFrom(this.client.send('updateProfile', data));

    const headers = request.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);
    const responseCached = await cacheData.account(token);

    const emailAccount = responseCached?.data?.email || null;

    await cacheData.clearCacheData(emailAccount);

    res.status(200).send(resp);
  }
  @Patch('/:id/profile')
  @UseInterceptors(FileInterceptor('dokumen'))
  async updatePatchProfile(
    @Param('id') id: number,
    @Body() data: any,
    @Req() request: any,
    @Res() res: Response,
    @UploadedFile() file: any,
  ) {
    data.id = id;
    data.file = file;
    const resp = await firstValueFrom(this.client.send('updateProfile', data));

    const headers = request.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);
    const responseCached = await cacheData.account(token);

    const emailAccount = responseCached?.data?.username || null;

    await cacheData.clearCacheData(emailAccount);

    res.status(200).send(resp);
  }
  @Patch('/approved/account/change')
  @UseInterceptors(NoFilesInterceptor())
  async approvedAccountChange(@Body() data: any, @Req() req: any) {
    const clientNotification = new ClientNotificationSend();
    const headers = req.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const status = 'enable';
    const id = data.new_id;
    const user = await firstValueFrom(this.client.send('findOneUser', id));
    const keycloakId = await this.enable(user.data, token);

    const request = {
      status,
      id,
      keycloakId,
    };

    const resp = await firstValueFrom(
      this.client.send('changeStatusUser', request),
    );
    if (resp.status !== undefined && resp.status == 200) {
      // send email notification
      clientNotification.send('pejabatPendaftarAktivasi', user.data.username);
    }

    const res = await firstValueFrom(
      this.client.send('approvedAccountChange', data),
    );

    if (data.old_id !== null) {
      const oldUser = await firstValueFrom(
        this.client.send('findOneUser', data.old_id),
      );

      clientNotification.send('userDisableAccountSubstitution', oldUser.data);
    }

    const userEnableRequest = {
      user: user.data,
      password: user.data.username,
    };

    clientNotification.send('userEnableAccountSubstitution', userEnableRequest);

    return res;
  }

  @Patch('/:status/:id')
  async enableUsers(
    @Param('id') id: number,
    @Param('status') status: string,
    @Req() req: any,
  ) {
    const headers = req.headers;
    const alasan = req.body.alasan;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    if (status === 'enable' || status === 'disable') {
      const user = await firstValueFrom(this.client.send('findOneUser', id));
      let keycloakId: string;
      if (status === 'enable') {
        keycloakId = await this.enable(user.data, token);
      }

      const request = {
        status,
        id,
        keycloakId,
        alasan,
      };

      let userRejectData = {
        user: user.data,
        alasan: alasan,
      };

      const resp = await firstValueFrom(
        this.client.send('changeStatusUser', request),
      );
      if (resp.status !== undefined && resp.status == 200) {
        // send email notification
        if (status === 'enable') {
          await firstValueFrom(
            this.notificationClient.send(
              'pejabatPendaftarAktivasi',
              user.data.username,
            ),
          );
        } else if (status === 'disable') {
          if ((alasan && alasan.trim() !== '') || alasan !== undefined) {
            await firstValueFrom(
              this.notificationClient.send(
                'userRejectRegistration',
                userRejectData,
              ),
            );
          } else {
            await firstValueFrom(
              this.notificationClient.send(
                'userDisableAccountSubstitution',
                user.data,
              ),
            );
          }
        }
      }

      return resp;
    }
  }
  @Get('')
  async allUserData(@Query() request: any) {
    return this.client.send('dropdownUser', request);
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
        client_id: process.env.CLIENT_ID || 'pse',
        client_secret: process.env.CLIENT_SECRET || '8fdc050a-3828-4568-818b-59ab07774e39',
        refresh_token: data.refresh_token,
      };
      
      const decoded = await this.jwtService.decode(data.token);
      const email = decoded.email;

      await this.client.send('outUser', email).toPromise();

      const keycloakDomain = process.env.KEYCLOACK_DOMAIN || 'https://sso-dev.layanan.go.id/auth';
      const logout = await axios.post(
        `${keycloakDomain}/realms/SPBE/protocol/openid-connect/logout`,
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

  @Post('/get-otp')
  async userByUsername(@Query() request: any) {
    console.log('GETOTPreq-log === ', request)

    const { recaptcha } = request.body

    if (!recaptcha) {
      return { 
        success: false, 
        message: "reCAPTCHA tidak valid!" 
      }
    }
  
    const secretKey = "6LdkfoMqAAAAADgBLa27_UjuBaNdcBK6AIR36pIJ"
    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptcha}`
  
    try {
      const response = await axios.post(
        verificationUrl,
        new URLSearchParams({
          secret: secretKey,
          response: recaptcha,
        }).toString(),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
  
      const data = response.data

      const responseOTP = data && await firstValueFrom(this.client.send('getUserByUsername', request));
      console.log('GETOTP-log === ', responseOTP)
      if (responseOTP) {
        await firstValueFrom(
          this.notificationClient.send('userGetOtp', responseOTP),
        );
      }
  
      return {
        status: 200,
        message: 'Verifikasi berhasil',
        response: responseOTP,
      };
    } catch (error) {
      throw error
    }
  }

  @Post('/parent/account')
  @UseInterceptors(FileInterceptor('dokumen'))
  async storeParent(
    @Body() body: any,
    @Req() request: any,
    @UploadedFile() file: any,
  ) {
    // console.log('asd');
    const headers = request.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);
    const responseCached = await cacheData.account(token);

    const account_id = responseCached?.data?.id || null;

    file.body = body;
    file.body.account_id = account_id;

    const resp = await firstValueFrom(this.client.send('storeParent', file));
    if (resp.id !== undefined && resp.id != 0) {
      const user = await firstValueFrom(
        this.client.send('findOneUser', resp.id),
      );
      // send email notification
      await firstValueFrom(
        this.notificationClient.send('pendaftaranSubPejabat', user.data),
      );
      await firstValueFrom(
        this.notificationClient.send('userRegistration', user.data),
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
      const keycloakDomain = process.env.KEYCLOACK_DOMAIN || 'https://sso-dev.layanan.go.id/auth';
      const response = await axios.get(
        `${keycloakDomain}/admin/realms/SPBE/users`,
        config,
      );
      const userData = response?.data;
      console.log(JSON.stringify(response?.data))
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
      const keycloakDomain = process.env.KEYCLOACK_DOMAIN || 'https://sso-dev.layanan.go.id/auth';
      const response = await axios.post(
        `${keycloakDomain}/admin/realms/SPBE/users`,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  private async enable(user: any, token: any): Promise<string> {
    let keycloakId: string;
    console.log("First Await")
    const existUser = await this.getUserByEmail(user.username, token);
    
    if (!existUser) {
      const data = {
        firstName: user.nama,
        email: user.username,
        enabled: true,
        username: user.username,
        credentials: [
          {
            type: 'password',
            value: user.username,
            temporary: true,
          },
        ],
      };
      if (user.is_admin) {
        data['groups'] = ['Admin'];
      }
      console.log("Second Await")
      const newUserResp = await this.createUser(data, token);
      console.log("Tird Await")

      const existUser = await this.getUserByEmail(user.username, token);
      keycloakId = existUser.id;
    } else {
      keycloakId = existUser.id;
    }
    return keycloakId;
  }

}
