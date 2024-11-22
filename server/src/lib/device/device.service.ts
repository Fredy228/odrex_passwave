import { Injectable } from '@nestjs/common';

import { DeviceCreateDto } from './dto/device.create.dto';
import { HallRepository } from '../../repository/hall.repository';
import { DeviceRepository } from '../../repository/device.repository';
import { Device } from '../../entity/device.entity';
import { User } from '../../entity/user.entity';
import { RoleEnum } from '../../enums/role.enum';
import { PrivilegeRepository } from '../../repository/privilege.repository';
import { DeviceUpdateDto } from './dto/device.update.dto';
import { GroupUserRepository } from '../../repository/group-user.repository';
import { In } from 'typeorm';

@Injectable()
export class DeviceService {
  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly hallRepository: HallRepository,
    private readonly privilegeRepository: PrivilegeRepository,
    private readonly groupUserRepository: GroupUserRepository,
  ) {}

  async create(hallId: number, body: DeviceCreateDto): Promise<Device> {
    const hall = await this.hallRepository.getById(hallId);

    const newDevice = this.deviceRepository.create({
      ...body,
      hall,
    });

    await this.deviceRepository.save(newDevice);

    return newDevice;
  }

  async getById(id: number): Promise<Device> {
    return this.deviceRepository.getById(id);
  }

  async getAll(user: User, hallId: number): Promise<Device[]> {
    if (user.role !== RoleEnum.ADMIN) {
      const groupUser = await this.groupUserRepository.findBy({
        userId: user.id,
      });
      if (groupUser?.length === 0) return [];
      const privileges = await this.privilegeRepository.findBy({
        hall: {
          id: hallId,
        },
        group: {
          id: In(groupUser.map((i) => i.groupId)),
        },
      });
      if (privileges?.length === 0) return [];
    }

    return this.deviceRepository.getByPrivilege(hallId, undefined);
  }

  async update(
    deviceId: number,
    body: Partial<DeviceUpdateDto>,
  ): Promise<Device> {
    const device = await this.deviceRepository.getById(deviceId);

    await this.deviceRepository.update(device.id, body);

    return Object.assign(device, body);
  }

  async delete(deviceId: number): Promise<Device> {
    const device = await this.deviceRepository.getById(deviceId);

    await this.deviceRepository.delete(device.id);

    return device;
  }
}
