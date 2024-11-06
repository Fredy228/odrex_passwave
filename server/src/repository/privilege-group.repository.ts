import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { PrivilegeGroup } from '../entity/privilege-group.entity';

@Injectable()
export class PrivilegeGroupRepository extends Repository<PrivilegeGroup> {
  constructor(private dataSource: DataSource) {
    super(PrivilegeGroup, dataSource.createEntityManager());
  }
}
