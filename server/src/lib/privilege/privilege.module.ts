import { MiddlewareConsumer, Module } from '@nestjs/common';

import { PrivilegeService } from './privilege.service';
import { PrivilegeController } from './privilege.controller';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { UserRepository } from '../../repository/user.repository';
import { PrivilegeGroupRepository } from '../../repository/privilege-group.repository';
import { PrivilegeRepository } from '../../repository/privilege.repository';
import { CompanyRepository } from '../../repository/company.repository';
import { HallRepository } from '../../repository/hall.repository';
import { DeviceRepository } from '../../repository/device.repository';
import { PasswordRepository } from '../../repository/password.repository';

@Module({
  providers: [
    PrivilegeService,
    UserRepository,
    PrivilegeGroupRepository,
    PrivilegeRepository,
    CompanyRepository,
    HallRepository,
    DeviceRepository,
    PasswordRepository,
  ],
  controllers: [PrivilegeController],
})
export class PrivilegeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(PrivilegeController);
  }
}
