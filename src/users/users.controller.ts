import { Controller, Get, Param, Query } from '@nestjs/common';
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

  @Get('/:id')
  async viewData(@Param('id') id: number, @Query() request: any) {
    return this.client.send('findOneUser', id);
  }
}
