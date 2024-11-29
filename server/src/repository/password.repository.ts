import { DataSource, ILike, Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';

import { Password } from '../entity/password.entity';
import { CustomException } from '../services/custom-exception';
import { QuerySearchDto } from '../dto/query-search.dto';

@Injectable()
export class PasswordRepository extends Repository<Password> {
  constructor(private dataSource: DataSource) {
    super(Password, dataSource.createEntityManager());
  }

  async getByPrivilege(
    { range, sort, filter }: QuerySearchDto,
    deviceId: number,
    where?: Record<string, any>,
  ) {
    const [passwords, total] = await this.findAndCount({
      where: {
        ...where,
        device: {
          id: deviceId,
        },
        ...{
          name: filter.name && ILike('%' + filter.name + '%'),
          entry: filter.entry && ILike('%' + filter.entry + '%'),
        },
      },
      order: {
        [sort[0]]: sort[1],
      },
      take: range[1] - range[0] + 1,
      skip: range[0] - 1,
      relations: {
        privileges: where && true,
      },
    });

    return { data: passwords, total };
  }

  async getById(id: number): Promise<Password> {
    const password = await this.findOne({
      where: {
        id,
      },
    });

    if (!password)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Not found password with ID "${id}"`,
      );

    return password;
  }
}
