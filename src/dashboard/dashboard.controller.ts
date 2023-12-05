import { Controller, Get, Inject, Query, Res } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { DashboardService } from './dashboard.service';
import { getCachedData } from 'src/utils/getCachedData';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('api/dashboard')
export class DashboardController {
  constructor(
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly dashboardService: DashboardService,
  ) {}
  @Client({
    transport: Transport.TCP,
    options: { port: +process.env.PSE_CORE_SERVICE_PORT },
  })
  private readonly client: ClientProxy;

  @Get('/widget')
  async widget() {
    return this.client.send('cardWidgetDashboard', 'all');
  }

  @Get('/chart/system/electronic')
  async chartSystemElectronic(@Query() request: any) {
    const data: any = {};

    const headers = request.headers;
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return { message: 'Unauthorized' };
    }

    const cacheData = new getCachedData(this.jwtService, this.cacheService);

    const decoded = await cacheData.getDecodedToken(token);

    const responseCached = await cacheData.account(token, decoded.email);

    data.user = responseCached?.data;

    request.user = data.user;

    return this.client.send('chartSystemElectronicDashboard', request);
  }
  @Get('/chart/request/update')
  async chartRequestUpdate(@Query() request: any) {
    return this.client.send('chartRequestUpdateDashboard', request);
  }
  @Get('/chart/system/downloadelectronic')
  async downloadSystemElectronic(@Query() request: any) {
    const data = await this.client
      .send('downloadSystemElectronicDashboard', request)
      .toPromise();

    return this.dashboardService.downloadSystemElectronic(data);
  }
}
