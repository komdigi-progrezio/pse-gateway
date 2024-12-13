import { Module } from '@nestjs/common';
import { LoginActivityController } from './login-activity.controller';

@Module({
  controllers: [LoginActivityController]
})
export class LoginActivityModule {}
