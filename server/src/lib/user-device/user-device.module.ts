import { MiddlewareConsumer, Module } from '@nestjs/common';

import { UserDeviceService } from './user-device.service';
import { UserDeviceController } from './user-device.controller';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { UserRepository } from '../../repository/user.repository';
import { UserDevicesRepository } from '../../repository/user-devices.repository';

@Module({
  providers: [UserDeviceService, UserRepository, UserDevicesRepository],
  controllers: [UserDeviceController],
})
export class UserDeviceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(UserDeviceController);
  }
}
