import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, ILike, Repository } from 'typeorm';

import { PrivilegeGroup } from '../entity/privilege-group.entity';
import { CustomException } from '../services/custom-exception';
import { QuerySearchDto } from '../dto/query-search.dto';

@Injectable()
export class PrivilegeGroupRepository extends Repository<PrivilegeGroup> {
  constructor(private dataSource: DataSource) {
    super(PrivilegeGroup, dataSource.createEntityManager());
  }

  async getById(
    id: number,
    relations?: Record<string, any>,
  ): Promise<PrivilegeGroup> {
    const group = await this.findOne({
      where: {
        id,
      },
      relations,
    });

    if (!group)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Group with ID "${id} not found"`,
      );

    return group;
  }

  async getAll({ filter, range, sort }: QuerySearchDto): Promise<{
    data: PrivilegeGroup[];
    total: number;
  }> {
    const [groups, total] = await this.findAndCount({
      where: {
        name: filter.name && ILike('%' + filter.name + '%'),
        type: filter.type,
      },
      order: {
        [sort[0]]: sort[1],
      },
      take: range[1] - range[0] + 1,
      skip: range[0] - 1,
    });

    return { data: groups, total };
  }
}
