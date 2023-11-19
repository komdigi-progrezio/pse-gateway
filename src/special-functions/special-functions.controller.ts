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

@Controller('api/special-functions')
export class SpecialFunctionsController {
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_CORE_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() data: any) {
    return this.client.send('createSpecialFunction', data);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeSpecialFunction', id);
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Param('id') id: number, @Body() data: any) {
    data.id = id;
    return this.client.send('updateSpecialFunction', data);
  }
}
