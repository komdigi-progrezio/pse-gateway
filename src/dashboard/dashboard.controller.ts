import { Controller, Get, Query } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@Controller('api/dashboard')
export class DashboardController {
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
}
