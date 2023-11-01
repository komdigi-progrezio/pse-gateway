import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Body,
  Delete,
} from '@nestjs/common';
import { Client, Transport, ClientProxy } from '@nestjs/microservices';

@Controller('api/users')
export class UsersController {
  @Client({ transport: Transport.TCP, options: { port: 3001 } })
  private readonly client: ClientProxy;

  @Get('/get/authenticated')
  async authenti() {
    return this.client.send('authUser', 'all');
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
