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
} from '@nestjs/common';
import { Client, Transport, ClientProxy } from '@nestjs/microservices';
import axios from 'axios';

@Controller('api/users')
export class UsersController {
  constructor(private jwtService: JwtService) {}

  @Client({ transport: Transport.TCP, options: { port: 3001 } })
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

      return this.client.send('authUser', email);
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

    console.log(data);

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
  async updateProfile(@Param('id') id: number, @Body() data: any) {
    data.id = id;
    return this.client.send('updateProfile', data);
  }
  @Patch('/approved/account/change')
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
  async store(@Body() body: any) {
    return this.client.send('createUser', body);
  }

  @Post('/logout')
  async logout(@Query() data: any) {
    const logout = await axios.post(
      `${process.env.KEYCLOACK_DOMAIN}/realms/SPBE/protocol/openid-connect/logout`,
    );

    return data;
  }

  @Post('/notification-token')
  async notifToken(@Body() data: any) {
    return this.client.send('notifToken', data);
  }

  @Post('/:id')
  async update(@Param('id') id: number, @Body() body: any) {
    body.id = id;

    return this.client.send('updateUser', body);
  }
  @Post('/parent/account')
  async storeParent(@Param('id') id: number, @Body() body: any) {
    body.id = id;

    return this.client.send('storeParent', body);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeUser', id);
  }
}
