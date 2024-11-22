import { DataSource, ILike, IsNull, Not, Or, Repository } from 'typeorm';
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
      if (!key.startsWith('not_')) return;
      const newKey = key.replace('not_', '');

      if (typeof filter[key] === 'object') {
        const subObject = Object.entries(filter[key])[0];
        if (subObject) {
          filter[newKey] = {
            [subObject[0]]: Or(Not(subObject[1]), IsNull()),
          };
        }
      } else {
        filter[newKey] = Not(filter[key]);
      }
      delete filter[key];
    });
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

    return user;
  }
}
