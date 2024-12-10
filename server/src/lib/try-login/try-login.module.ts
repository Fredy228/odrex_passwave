import { MiddlewareConsumer, Module } from '@nestjs/common';

import { TryLoginService } from './try-login.service';
import { TryLoginController } from './try-login.controller';
import { TryLoginCronService } from './try-login.cron.service';
import { TryLoginRepository } from '../../repository/try-login.repository';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { UserRepository } from '../../repository/user.repository';

@Module({
  providers: [
    TryLoginService,
    TryLoginCronService,
    TryLoginRepository,
    UserRepository,
  ],
  controllers: [TryLoginController],
})
export class TryLoginModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(TryLoginController);
  }
}
