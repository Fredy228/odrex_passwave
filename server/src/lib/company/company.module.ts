import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { UserRepository } from '../../repository/user.repository';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { CompanyRepository } from '../../repository/company.repository';
import { PrivilegeRepository } from '../../repository/privilege.repository';
import { GroupUserRepository } from '../../repository/group-user.repository';

@Module({
  providers: [
    CompanyService,
    UserRepository,
    CompanyRepository,
    PrivilegeRepository,
    GroupUserRepository,
  ],
  controllers: [CompanyController],
})
export class CompanyModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(CompanyController);
  }
}
