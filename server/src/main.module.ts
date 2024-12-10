import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import databaseConfig from '../data-source';
import { AuthModule } from './lib/auth/auth.module';
import { UserModule } from './lib/user/user.module';
import { CompanyModule } from './lib/company/company.module';
import { HallModule } from './lib/hall/hall.module';
import { DeviceModule } from './lib/device/device.module';
import { PasswordModule } from './lib/password/password.module';
import { StaticModule } from './lib/static/static.module';
import { PrivilegeGroupModule } from './lib/privilege-group/privilege-group.module';
import { PrivilegeModule } from './lib/privilege/privilege.module';
import { TryLoginModule } from './lib/try-login/try-login.module';
import { UserDeviceModule } from './lib/user-device/user-device.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig.options),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE_REFRESH_TOKEN },
    }),
    AuthModule,
    UserModule,
    CompanyModule,
    HallModule,
    DeviceModule,
    PasswordModule,
    StaticModule,
    PrivilegeGroupModule,
    PrivilegeModule,
    TryLoginModule,
    UserDeviceModule,
  ],
  controllers: [],
})
export class MainModule {}
