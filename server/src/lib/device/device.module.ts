import { MiddlewareConsumer, Module } from '@nestjs/common';

import { DeviceService } from './device.service';
import { DeviceController } from './device.controller';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { DeviceRepository } from '../../repository/device.repository';
import { HallRepository } from '../../repository/hall.repository';
import { PrivilegeRepository } from '../../repository/privilege.repository';
import { UserRepository } from '../../repository/user.repository';

@Module({
  providers: [
    DeviceService,
    DeviceRepository,
    HallRepository,
    PrivilegeRepository,
    UserRepository,
  ],
  controllers: [DeviceController],
})
export class DeviceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(DeviceController);
  }
}
