import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseInterceptors,
  Delete,
  Inject,
  Req,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { Cache } from 'cache-manager';
import { Response, response } from 'express';
import { getCachedData } from 'src/utils/getCachedData';

@Controller('api/parsatuankerja')
export class ParsatuankerjaController {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) {}

  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_MASTER_DATA_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Get('/filter')
  async showwData(@Query() request: any) {
    return this.client.send('filterAllParsatuankerja', request);
  }

  @Get('/list/tree-view')
  async treeView(@Req() request: any, @Res() res: Response) {
    try {
      const headers = request.headers;
      const token = headers.authorization?.split(' ')[1];
      if (!token) {
        return { message: 'Unauthorized' };
      }

      const cacheData = new getCachedData(this.jwtService, this.cacheService);
      const responseCached = await cacheData.account(token);

      const responseData = await this.client
        .send('treeParsatuankerja', responseCached.data.id)
        .toPromise();

      return res.status(200).send(responseData);
    } catch (error) {
      return res.status(500).send({
        status: 500,
        message: error,
      });
    }
  }

  @Get('/:id/parinstansi')
  async filterPerAgency(@Param('id') id: number) {
    return this.client.send('filterPerAgency', id);
  }

  @Get('/:id/parinstansi/dropdown')
  async filterPerAgencyDropdown(@Param('id') id: number) {
    // return 'asd';
    return this.client.send('filterPerAgencyDropdown', id);
  }
  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() data: any) {
    // return data;
    return this.client.send('createParsatuankerja', data);
  }

  @Post('/organization')
  @UseInterceptors(NoFilesInterceptor())
  async createOrganization(@Body() data: any) {
    return this.client.send('createOrganization', data);
  }

  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(@Param('id') id: number, @Body() data: any) {
    data.id = id;
    return this.client.send('updateParsatuankerja', data);
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeParsatuankerja', id);
  }
}
