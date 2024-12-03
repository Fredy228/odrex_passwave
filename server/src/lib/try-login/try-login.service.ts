import { Injectable } from '@nestjs/common';
import { Between, ILike } from 'typeorm';

import { QuerySearchDto } from '../../dto/query-search.dto';
import { TryLoginRepository } from '../../repository/try-login.repository';
import { TryLogin } from '../../entity/try-login.entity';

@Injectable()
export class TryLoginService {
  constructor(private readonly tryLoginRepository: TryLoginRepository) {}

  async getAll({
    sort = ['id', 'DESC'],
    range = [1, 15],
    filter = {},
  }: QuerySearchDto): Promise<{
    data: TryLogin[];
    total: number;
  }> {
    let createAtFilter;
    if (
      Array.isArray(filter.createAt) &&
      filter.createAt.length === 2 &&
      filter.createAt.every((i) => Number(i))
    ) {
      const timeFrom = new Date(Date.now() - createAtFilter[0]);
      const timeTo = new Date(Date.now() - createAtFilter[1]);

      createAtFilter = Between(timeFrom, timeTo);
    }

    const [history, total] = await this.tryLoginRepository.findAndCount({
      where: {
        ipAddress: filter.ipAddress && ILike('%' + filter.ipAddress + '%'),
        email: filter.email && ILike('%' + filter.email + '%'),
        createAt: createAtFilter || undefined,
      },
      order: {
        [sort[0]]: sort[1],
      },
      take: range[1] - range[0] + 1,
      skip: range[0] - 1,
    });

    return { data: history, total };
  }

  async delete(ids: number[]): Promise<void> {
    await this.tryLoginRepository.delete(ids);
  }
}
