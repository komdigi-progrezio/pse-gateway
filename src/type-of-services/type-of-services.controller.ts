import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';

@Controller('api/type-of-services')
export class TypeOfServicesController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_CORE_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() body: any) {
    return this.client.send('createTypeOfService', body);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeTypeOfService', id);
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Body() body: any, @Param('id') id: number) {
    body.id = id;

    return this.client.send('updateTypeOfService', body);
  }
}
