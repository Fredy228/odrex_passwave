import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { GroupUser } from '../entity/group-user.entity';

@Injectable()
export class GroupUserRepository extends Repository<GroupUser> {
  constructor(private dataSource: DataSource) {
    super(GroupUser, dataSource.createEntityManager());
  }
}
