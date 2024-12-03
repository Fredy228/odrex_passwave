import { DataSource, ILike, In, Not, Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';

import { User } from '../entity/user.entity';
import { QuerySearchDto } from '../dto/query-search.dto';
import { CustomException } from '../services/custom-exception';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getAllUsers(
    { sort = ['id', 'DESC'], range = [1, 15], filter = {} }: QuerySearchDto,
    relations?: Record<string, true>,
  ) {
    Object.keys(filter).forEach((key) => {
      if (['name', 'email'].includes(key)) {
        filter[key] = ILike('%' + filter[key] + '%');
      }

      if (key === 'group_with') {
        filter['groups_users'] = {
          groupId: filter[key],
        };
        delete filter['group_with'];
      }
    });
    if (filter.hasOwnProperty('group_without')) {
      const usersInGroup = await this.find({
        where: {
          groups_users: {
            groupId: filter['group_without'],
          },
        },
        select: { id: true },
      });

      filter['id'] = Not(In(usersInGroup.map((i) => i.id)));
      delete filter['group_without'];
    }
    console.log('filter', filter);
    const [users, total] = await this.findAndCount({
      where: filter,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
      },
      relations,
      order: {
        [sort[0]]: sort[1],
      },
      take: range[1] - range[0] + 1,
      skip: range[0] - 1,
    });

    return { data: users, total };
  }

  async getById(id: number): Promise<User> {
    const user = await this.findOne({
      where: {
        id: id,
      },
    });

    if (!user)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Not found user with ID ${id}`,
      );

    user.password = undefined;

    return user;
  }
}
