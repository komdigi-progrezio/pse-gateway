import {
  Controller,
  Get,
  Query,
  Post,
  UseInterceptors,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('api/request-update')
export class RequestUpdateController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_CORE_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Get('/filter')
  async getFilter(@Query() request: any) {
    return this.client.send('findAllRequestUpdate', request);
  }
  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() body: any) {
    // Lakukan sesuatu dengan files
    return this.client.send('createRequestUpdate', body);
  }

  @Patch('/approved/:id')
  async approve(@Param('id') id: number) {
    return this.client.send('approveUpdateRequestUpdate', id);
  }
  @Patch('/finished/:id')
  async finished(@Param('id') id: number) {
    return this.client.send('finishedRequestUpdate', id);
  }
}
