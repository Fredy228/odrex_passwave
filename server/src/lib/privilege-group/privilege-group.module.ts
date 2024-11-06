import { Module } from '@nestjs/common';
import { PrivilegeGroupService } from './privilege-group.service';
import { PrivilegeGroupController } from './privilege-group.controller';

@Module({
  providers: [PrivilegeGroupService],
  controllers: [PrivilegeGroupController]
})
export class PrivilegeGroupModule {}
