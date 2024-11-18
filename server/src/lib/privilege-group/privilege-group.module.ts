import { MiddlewareConsumer, Module } from '@nestjs/common';

import { PrivilegeGroupService } from './privilege-group.service';
import { PrivilegeGroupController } from './privilege-group.controller';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { UserRepository } from '../../repository/user.repository';
import { PrivilegeGroupRepository } from '../../repository/privilege-group.repository';

@Module({
  providers: [PrivilegeGroupService, UserRepository, PrivilegeGroupRepository],
  controllers: [PrivilegeGroupController],
})
export class PrivilegeGroupModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(PrivilegeGroupController);
  }
}
