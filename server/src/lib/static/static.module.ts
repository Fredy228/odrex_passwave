import { MiddlewareConsumer, Module } from '@nestjs/common';

import { StaticController } from './static.controller';
import { PrivilegeRepository } from '../../repository/privilege.repository';
import { UserRepository } from '../../repository/user.repository';
import { ProtectStaticMiddleware } from '../../middlewares/protect-static.middleware';
import { StaticService } from './static.service';
import { PasswordRepository } from '../../repository/password.repository';

@Module({
  controllers: [StaticController],
  providers: [
    PrivilegeRepository,
    UserRepository,
    StaticService,
    PasswordRepository,
  ],
})
export class StaticModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectStaticMiddleware).forRoutes(StaticController);
  }
}
