import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

import { User } from '../entity/user.entity';
import { QuerySearchDto } from '../dto/query-search.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getAllUsers({
    sort = ['createAt', 'DESC'],
    range = [1, 15],
    filter = {},
  }: QuerySearchDto) {
    const [users, total] = await this.findAndCount({
      where: filter,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
      order: {
        [sort[0]]: sort[1],
      },
      take: range[1] - range[0] + 1,
      skip: range[0] - 1,
    });

    return { data: users, total };
  }
}
