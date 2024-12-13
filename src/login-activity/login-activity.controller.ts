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

@Controller('api/login-activity')
@UseInterceptors(CacheInterceptor)
export class LoginActivityController {
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

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async createLogActivity(@Body() body: any) {
    const generatedOtp = await firstValueFrom(this.client.send('createLogin', body));

    console.log('logGenOTP === ',generatedOtp)
    console.log('logGenBody === ',body)
    if(generatedOtp){
      let response = {
        username: body.username,
        otpCode: generatedOtp
      }
      await firstValueFrom(this.notificationClient.send('userGetOtp', response));
      return { 
        status: 200,
      };
    } else {
      return { 
        status: 500,
        message: 'Internal Server Error, Please try again!' 
      };
    }
  }

  @Post('/get-access-token')
  @UseInterceptors(NoFilesInterceptor())
  async getAccToken(@Body() data: any) {
    const url = 'https://api-splpdev.layanan.go.id/api-sso-dev/1.0/realms/SPBE/protocol/openid-connect/token';

    const params = new URLSearchParams();
    params.append('client_id', 'testing-sso');
    params.append('client_secret', 'c0baeb95-a154-4225-a2fc-cfaaf3d52075');
    params.append('grant_type', 'password');
    params.append('username', data.username);
    params.append('password', data.password);

    console.log('cekResponseData === ',data)

    try {
      // Melakukan request POST ke API
      const response = await axios.post(url, params.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      console.log('cekResponseSPLP === ',response)

      const generatedOtp = await firstValueFrom(this.client.send('createLogin', data));

      console.log('cekResponsegeneratedOtp === ',generatedOtp)

      if(generatedOtp){

        let responseParam = {
          username: data.username,
          otpCode: generatedOtp
        }

        await firstValueFrom(this.notificationClient.send('userGetOtp', responseParam));

        return {
          status: 200,
          message: 'Silahkan masukkan OTP yang Anda terima melalui email',
          data: response.data,
        }
      }else{
        return {
          status: 500,
          message: 'Silahkan coba kembali',
        }
      }
      
    } catch (error) {
      return {
        status: '500',
        message: 'Silahkan periksa kembali username dan password',
      };
    }
  }

  @Post('/otp-verify')
  @UseInterceptors(NoFilesInterceptor())
  async verifyOtp(@Body() data: any) {
    return this.client.send('verifyOtp', data);
  }
}