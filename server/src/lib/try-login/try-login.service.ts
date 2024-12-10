import { Injectable } from '@nestjs/common';
import { Between, ILike, MoreThan, Not } from 'typeorm';

import { QuerySearchDto } from '../../dto/query-search.dto';
import { TryLoginRepository } from '../../repository/try-login.repository';
import { TryLogin } from '../../entity/try-login.entity';
import * as process from 'process';

@Injectable()
export class TryLoginService {
  private readonly DURING_TIME_CHECK_TRY: number;

  constructor(private readonly tryLoginRepository: TryLoginRepository) {
    this.DURING_TIME_CHECK_TRY =
      Number(process.env.DURING_TIME_CHECK_TRY) || 3600000;
  }

  async getAll({
    sort = ['id', 'DESC'],
    range = [1, 15],
    filter = {},
  }: QuerySearchDto): Promise<{
    data: TryLogin[];
    total: number;
  }> {
    let createAtFilter = undefined;
    if (
      Array.isArray(filter.createAt) &&
      filter.createAt.length === 2 &&
      filter.createAt.every((i) => Number(i))
    ) {
      const timeFrom = new Date(Date.now() - filter.createAt[0]);
      const timeTo = new Date(Date.now() - filter.createAt[1]);

      createAtFilter = Between(timeFrom, timeTo);
    }

    const [history, total] = await this.tryLoginRepository.findAndCount({
      where: {
        ipAddress: filter.ipAddress && ILike('%' + filter.ipAddress + '%'),
        email: filter.email && ILike('%' + filter.email + '%'),
        createAt: createAtFilter,
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

  async getBlockedIp(filter: Record<string, any>) {
    const timeAgo = new Date(Date.now() - this.DURING_TIME_CHECK_TRY);

    const listBlocked = await this.tryLoginRepository.find({
      where: {
        createAt: MoreThan(timeAgo),
        ipAddress: filter?.ipAddress
          ? ILike('%' + filter.ipAddress + '%')
          : Not('unknown'),
      },
      select: {
        id: true,
        ipAddress: true,
        deviceModel: true,
        createAt: true,
      },
      order: {
        createAt: 'DESC',
      },
    });

    const ipCount = listBlocked.reduce((acc, item) => {
      acc[item.ipAddress] = (acc[item.ipAddress] || 0) + 1;
      return acc;
    }, {});

    const filteredList = listBlocked.filter(
      (item) => ipCount[item.ipAddress] > 4,
    );

    const uniqueList = filteredList.filter(
      (item, index, self) =>
        self.findIndex((obj) => obj.ipAddress === item.ipAddress) === index,
    );

    return {
      data: uniqueList,
      total: uniqueList.length,
    };
  }

  async unblock(ip: string) {
    const ips = await this.tryLoginRepository.find({
      where: {
        ipAddress: ip,
      },
      select: {
        id: true,
        ipAddress: true,
      },
    });

    await this.tryLoginRepository.delete(ips.map((i) => i.id));
  }
}
