import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Controller,
  Get,
  Inject,
  Req,
  Query,
  Body,
  Post,
  UseInterceptors,
  Param,
  Delete,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { Cache } from 'cache-manager';
import { error } from 'console';
import { getCachedData } from 'src/utils/getCachedData';
import { ReportService } from './report.service';

@Controller('api/report')
export class ReportController {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    readonly reportService: ReportService,
  ) {}
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_CORE_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Get()
  getAllData() {
    return this.client.send('findAllReport', 'findAllReport');
  }

  @Get('/filter')
  async filter(@Req() request: any, @Query() query: any) {
    try {
      const headers = request.headers;
      const token = headers.authorization?.split(' ')[1];
      if (!token) {
        return { message: 'Unauthorized' };
      }

      const cacheData = new getCachedData(this.jwtService, this.cacheService);
      const responseCached = await cacheData.account(token);

      const data: any = {};
      data.user = responseCached;
      data.request = query;
      return this.client.send('findFilterReport', data);
    } catch (error) {
      return error;
    }
  }

  @Get('/statistics')
  async statistics() {
    const data = await this.client
      .send('statisticsReport', 'Alldata')
      .toPromise();

    return this.reportService.statistic(data);
  }

  @Get('/excel/:id')
  async excel(@Param('id') id: number, @Req() request: any) {
    const data: any = {};
    data.id = id;
    const headers = request.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);

    const responseCached = await cacheData.account(token);

    data.user = responseCached?.data;

    const report = await this.client.send('excelReport', data).toPromise();
    // return await report;

    return await this.reportService.excel(report);
  }

  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return this.client.send('findOneReport', id);
  }

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  async create(@Body() data: any, @Req() request: any) {
    try {
      const headers = request.headers;
      const token = headers.authorization?.split(' ')[1];
      if (!token) {
        return { message: 'Unauthorized' };
      }

      const cacheData = new getCachedData(this.jwtService, this.cacheService);
      const responseCached = await cacheData.account(token);

      data.account_id = responseCached?.data?.id;

      return this.client.send('createReport', data);
    } catch (error) {
      return error;
    }
  }
  @Post('/:id')
  @UseInterceptors(NoFilesInterceptor())
  async update(
    @Param('id') id: number,
    @Body() data: any,
    @Req() request: any,
  ) {
    try {
      const headers = request.headers;
      const token = headers.authorization?.split(' ')[1];
      if (!token) {
        return { message: 'Unauthorized' };
      }

      const cacheData = new getCachedData(this.jwtService, this.cacheService);
      const responseCached = await cacheData.account(token);

      data.account_id = responseCached?.data?.id;
      data.id = id;

      return this.client.send('updateReport', data);
    } catch (error) {
      return error;
    }
  }

  @Delete('/:id')
  async destroy(@Param('id') id: number) {
    return this.client.send('removeReport', id);
  }
}
