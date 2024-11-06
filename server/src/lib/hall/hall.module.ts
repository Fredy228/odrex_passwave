import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';

import { HallService } from './hall.service';
import { HallController } from './hall.controller';
import { HallRepository } from '../../repository/hall.repository';
import { ProtectAuthMiddleware } from '../../middlewares/protect-auth.middleware';
import { PrivilegeRepository } from '../../repository/privilege.repository';
import { CompanyRepository } from '../../repository/company.repository';
import { UserRepository } from '../../repository/user.repository';

@Module({
  providers: [
    UserRepository,
    HallService,
    HallRepository,
    PrivilegeRepository,
    CompanyRepository,
  ],
  controllers: [HallController],
})
export class HallModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProtectAuthMiddleware).forRoutes(HallController);
  }
}
