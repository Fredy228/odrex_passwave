import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ProtectRefreshMiddleware } from '../../middlewares/protect-refresh.middleware';
import { UserAgentMiddleware } from '../../middlewares/user-agent.middleware';
import { UserRepository } from '../../repository/user.repository';
import { UserDevicesRepository } from '../../repository/user-devices.repository';
import { TryLoginRepository } from '../../repository/try-login.repository';
import { MailModule } from '../../services/mail/mail.module';
import { CodeAccessRepository } from '../../repository/code-access.repository';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    UserDevicesRepository,
    TryLoginRepository,
    CodeAccessRepository,
  ],
  exports: [],
  imports: [MailModule],
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectRefreshMiddleware).forRoutes(
      {
        path: '/auth/refresh',
        method: RequestMethod.GET,
      },
      {
        path: '/auth/logout',
        method: RequestMethod.GET,
      },
      {
        path: '/auth/change-pass',
        method: RequestMethod.PATCH,
      },
    );

    consumer.apply(UserAgentMiddleware).forRoutes(
      {
        path: '/auth/register',
        method: RequestMethod.POST,
      },
      {
        path: '/auth/login',
        method: RequestMethod.POST,
      },
      {
        path: '/auth/refresh',
        method: RequestMethod.GET,
      },
    );
  }
}
