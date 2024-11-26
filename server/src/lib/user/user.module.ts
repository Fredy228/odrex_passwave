import { MiddlewareConsumer, Module } from '@nestjs/common';

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
    consumer.apply(ProtectAuthMiddleware).forRoutes(UserController);
  }
}
