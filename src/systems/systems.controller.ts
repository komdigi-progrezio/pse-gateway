import { Controller, Get, Param, Query } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('api/systems')
export class SystemsController {
  @Client({ transport: Transport.TCP, options: { port: 3003 } })
  private readonly client: ClientProxy;

  @Get()
  async findAll() {
    return this.client.send('findAllSystems', 'all');
  }

  @Get('/me/approved')
  async approved() {
    return [];
  }

  @Get('/repository')
  async repositoryAll(@Query() request: any) {
    return this.client.send('repositorySystem', request);
  }
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return this.client.send('findOneSystem', id);
  }

  @Get('/filter/approved')
  async filerApprove(@Query() request: any) {
    return this.client.send('filterApproveSystem', request);
  }
  @Get('/filter/disapproved')
  async filerDisApprove(@Query() request: any) {
    return this.client.send('filterDisApproveSystem', request);
  }
}
