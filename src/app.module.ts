import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RolesController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [UsersModule, RolesModule, PermissionsModule],
})
export class AppModule {}
