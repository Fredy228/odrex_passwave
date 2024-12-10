import { HttpStatus, Injectable } from '@nestjs/common';

import { UserDevicesRepository } from '../../repository/user-devices.repository';
import { QuerySearchDto } from '../../dto/query-search.dto';
import { ILike } from 'typeorm';
import { CustomException } from '../../services/custom-exception';
import { User } from '../../entity/user.entity';

@Injectable()
export class UserDeviceService {
  constructor(private readonly userDevicesRepository: UserDevicesRepository) {}

  async getAll(
    user: User,
    {
      sort = ['updateAt', 'DESC'],
      range = [1, 15],
      filter = {},
    }: QuerySearchDto,
  ) {
    const [sessions, total] = await this.userDevicesRepository.findAndCount({
      where: {
        user: {
          id: user.id,
        },
        ipAddress: filter.ipAddress && ILike('%' + filter.ipAddress + '%'),
      },
      order: {
        [sort[0]]: sort[1],
      },
      take: range[1] - range[0] + 1,
      skip: range[0] - 1,
      select: {
        id: true,
        ipAddress: true,
        deviceModel: true,
        accessToken: true,
        createAt: true,
        updateAt: true,
      },
    });

    return { data: sessions, total };
  }

  async delete(user: User, id: number) {
    const session = await this.userDevicesRepository.findOneBy({
      id,
      user: {
        id: user.id,
      },
    });
    if (!session)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Not found session ${id}`,
      );

    await this.userDevicesRepository.delete(id);
    return;
  }
}
