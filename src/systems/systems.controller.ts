import {
  Controller,
  Get,
  Param,
  Query,
  Post,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('api/systems')
export class SystemsController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_CORE_SERVICE_PORT },
  })
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

  @Get('/:id/edit')
  async findEdit(@Param('id') id: number) {
    return this.client.send('findEditSystem', id);
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateSystem', body);
  }
}
