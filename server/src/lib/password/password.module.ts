import { MiddlewareConsumer, Module } from '@nestjs/common';

import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { PrivilegeRepository } from '../../repository/privilege.repository';
import { UserRepository } from '../../repository/user.repository';
import { PasswordRepository } from '../../repository/password.repository';
import { FileModule } from '../../services/file/file.module';
import { CryptoDataModule } from '../../services/crypto-data/crypto-data.module';
import { DeviceRepository } from '../../repository/device.repository';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';

@Module({
  imports: [FileModule, CryptoDataModule],
  providers: [
    PasswordService,
    PasswordRepository,
    PrivilegeRepository,
    DeviceRepository,
    UserRepository,
  ],
  controllers: [PasswordController],
})
export class PasswordModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(PasswordController);
  }
}
