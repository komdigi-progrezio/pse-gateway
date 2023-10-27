import { Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { Client, Transport, ClientProxy } from '@nestjs/microservices';

@Controller('api/users')
export class UsersController {
  @Client({ transport: Transport.TCP, options: { port: 3001 } })
  private readonly client: ClientProxy;

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
}
