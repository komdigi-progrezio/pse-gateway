import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RolesController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ProvinsiModule } from './provinsi/provinsi.module';
import { KotaModule } from './kota/kota.module';
import { PublicModule } from './public/public.module';
import { ParconfigModule } from './parconfig/parconfig.module';
import { ParinstansiController } from './parinstansi/parinstansi.controller';
import { ApiModule } from './api/api.module';
import { ParinstansiModule } from './parinstansi/parinstansi.module';
import { ParsatuankerjaModule } from './parsatuankerja/parsatuankerja.module';
import { SystemsModule } from './systems/systems.module';
import { RequestUpdateModule } from './request-update/request-update.module';
import { JwtModule } from '@nestjs/jwt';
import { SpecialFunctionsModule } from './special-functions/special-functions.module';

@Module({
  imports: [
    UsersModule,
    RolesModule,
    PermissionsModule,
    ProvinsiModule,
    KotaModule,
    PublicModule,
    ParconfigModule,
    ApiModule,
    ParinstansiModule,
    ParsatuankerjaModule,
    SystemsModule,
    RequestUpdateModule,
    JwtModule.register({
      global: true,
    }),
    SpecialFunctionsModule,
  ],
  controllers: [ParinstansiController],
})
export class AppModule {}
