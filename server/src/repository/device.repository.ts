import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Device } from '../entity/device.entity';
import { CustomException } from '../services/custom-exception';
import { Privilege } from '../entity/privilege.entity';

@Injectable()
export class DeviceRepository extends Repository<Device> {
  constructor(private dataSource: DataSource) {
    super(Device, dataSource.createEntityManager());
  }

  async getByPrivilege(hallId: number, privileges?: Privilege[]) {
    return await this.find({
      where: {
        privileges,
        hall: {
          id: hallId,
        },
      },
    });
  }

  async getById(id: number): Promise<Device> {
    const device = await this.findOne({
      where: {
        id,
      },
    });

    if (!device)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Not found device with ID "${id}"`,
      );

    return device;
  }
}
