import { Controller, Get, Query, Res } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { DashboardService } from './dashboard.service';

@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
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
