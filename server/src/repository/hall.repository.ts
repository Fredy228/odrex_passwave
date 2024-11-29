import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, ILike, In, Repository } from 'typeorm';

import { Hall } from '../entity/hall.entity';
import { Privilege } from '../entity/privilege.entity';
import { QuerySearchDto } from '../dto/query-search.dto';
import { CustomException } from '../services/custom-exception';

@Injectable()
export class HallRepository extends Repository<Hall> {
  constructor(private dataSource: DataSource) {
    super(Hall, dataSource.createEntityManager());
  }

  async getByPrivilege(
    { range, sort, filter }: QuerySearchDto,
    companyId: number,
    where?: Record<string, any>,
  ) {
    const [halls, total] = await this.findAndCount({
      where: {
        ...where,
        company: {
          id: companyId,
        },
        name: filter.name && ILike('%' + filter.name + '%'),
      },
      order: {
        [sort[0]]: sort[1],
      },
      take: range[1] - range[0] + 1,
      skip: range[0] - 1,
    });

    return { data: halls, total };
  }

  async getById(id: number) {
    const hall = await this.findOne({
      where: {
        id,
      },
    });

    if (!hall)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Not found hall with ID "${id}"`,
      );

    return hall;
  }
}
