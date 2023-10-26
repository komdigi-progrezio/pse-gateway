import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { RolesController } from './roles/roles.controller';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [UsersModule, RolesModule],
})
export class AppModule {}
