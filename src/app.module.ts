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
import { ScopeModule } from './scope/scope.module';
import { TypeOfServicesModule } from './type-of-services/type-of-services.module';
import { SecurityModule } from './security/security.module';
import { RelatedModule } from './related/related.module';
import { CertificateModule } from './certificate/certificate.module';
import { ServiceUsersModule } from './service-users/service-users.module';
import { HardwaresModule } from './hardwares/hardwares.module';
import { SoftwaresModule } from './softwares/softwares.module';
import { AvailabilityOfExpertsModule } from './availability-of-experts/availability-of-experts.module';
import { ExpertsRequiredModule } from './experts-required/experts-required.module';
import { LegalBasisModule } from './legal-basis/legal-basis.module';
import { SopModule } from './sop/sop.module';
import { HelpDeskModule } from './help-desk/help-desk.module';
import { DocumentModule } from './document/document.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ReportModule } from './report/report.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { StorageModule } from './storage/storage.module';
import { NotifikasiModule } from './notifikasi/notifikasi.module';
import { PersonInChargeModule } from './person-in-charge/person-in-charge.module';
import { OrganizersModule } from './organizers/organizers.module';

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
    CacheModule.register({ 
      isGlobal: true 
    }),
    JwtModule.register({
      global: true,
    }),
    SpecialFunctionsModule,
    ScopeModule,
    TypeOfServicesModule,
    SecurityModule,
    RelatedModule,
    CertificateModule,
    ServiceUsersModule,
    HardwaresModule,
    SoftwaresModule,
    AvailabilityOfExpertsModule,
    ExpertsRequiredModule,
    LegalBasisModule,
    SopModule,
    HelpDeskModule,
    DocumentModule,
    ReportModule,
    DashboardModule,
    StorageModule,
    NotifikasiModule,
    PersonInChargeModule,
    OrganizersModule,
  ],
  controllers: [ParinstansiController],
})
export class AppModule {}
