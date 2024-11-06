import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from '../../repository/user.repository';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { FileModule } from '../../services/file/file.module';

@Module({
  imports: [FileModule],
  providers: [UserService, UserRepository],
  controllers: [UserController],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(
      {
        path: '/user',
        method: RequestMethod.POST,
      },
      {
        path: '/user',
        method: RequestMethod.GET,
      },
      {
        path: '/user/me',
        method: RequestMethod.GET,
      },
      {
        path: '/user/:user_id',
        method: RequestMethod.PATCH,
      },
      {
        path: '/user/:user_id',
        method: RequestMethod.DELETE,
      },
    );
  }
}
