import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Controller, Get, Inject, Req, Query } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { Cache } from 'cache-manager';
import { getCachedData } from 'src/utils/getCachedData';

@Controller('api/report')
export class ReportController {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
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

      const decoded = await cacheData.getDecodedToken(token);

      const responseCached = await cacheData.account(token, decoded.email);

      const data: any = {};
      data.user = responseCached;
      data.request = query;
      return this.client.send('findFilterReport', data);
    } catch (error) {
      return error;
    }
  }

  @Get('/statistics')
  statistics() {
    const data = 'statisticReport';
    return this.client.send('statisticsReport', data);
  }
}
