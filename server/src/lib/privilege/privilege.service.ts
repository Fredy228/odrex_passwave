import { HttpStatus, Injectable } from '@nestjs/common';
import { In } from 'typeorm';

import { PrivilegeRepository } from '../../repository/privilege.repository';
import { PrivilegeGroupRepository } from '../../repository/privilege-group.repository';
import { UserRepository } from '../../repository/user.repository';
import { QuerySearchDto } from '../../dto/query-search.dto';
import { EPrivilegeList, EPrivilegeType } from '../../enums/privilege.enum';
import { CustomException } from '../../services/custom-exception';
import { PrivilegeCreateDto } from './dto/privilege.create.dto';
import { GroupType } from '../../enums/group.enum';
import { HallRepository } from '../../repository/hall.repository';
import { CompanyRepository } from '../../repository/company.repository';
import { DeviceRepository } from '../../repository/device.repository';
import { PasswordRepository } from '../../repository/password.repository';
import { Hall } from '../../entity/hall.entity';
import { Company } from '../../entity/company.entity';
import { Device } from '../../entity/device.entity';
import { Password } from '../../entity/password.entity';
import { PrivilegeGroup } from '../../entity/privilege-group.entity';
import { Permit } from '../../enums/permit.enum';
import { Privilege } from '../../entity/privilege.entity';
import { RoleEnum } from '../../enums/role.enum';
import { GroupUserRepository } from '../../repository/group-user.repository';

@Injectable()
export class PrivilegeService {
  constructor(
    private readonly privilegeRepository: PrivilegeRepository,
    private readonly privilegeGroupRepository: PrivilegeGroupRepository,
    private readonly userRepository: UserRepository,
    private readonly hallRepository: HallRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly deviceRepository: DeviceRepository,
    private readonly passwordRepository: PasswordRepository,
    private readonly groupUserRepository: GroupUserRepository,
  ) {}

  getAll(
    type: EPrivilegeType,
    list: EPrivilegeList,
    id: number,
    query: QuerySearchDto,
  ) {
    switch (type) {
      case EPrivilegeType.GROUP:
        return this.getAllByGroups(list, id, query);
      case EPrivilegeType.USER:
        return this.getAllByUsers(list, id, query);
      default:
        throw new CustomException(
          HttpStatus.BAD_REQUEST,
          'Wrong type privilege',
        );
    }
  }

  async getAllByUsers(
    list: EPrivilegeList,
    id: number,
    { sort = ['id', 'DESC'], range = [1, 15], filter = {} }: QuerySearchDto,
  ) {
    const { data: users, total } = await this.userRepository.getAllUsers({
      sort,
      range,
      filter: { ...filter, not_role: RoleEnum.ADMIN },
    });

    const groups = await this.privilegeGroupRepository.find({
      where: {
        type: GroupType.MAIN,
        groups_users: {
          user: In(users.map((u) => u.id)),
        },
      },
      relations: {
        groups_users: true,
      },
    });

    const privileges = await this.privilegeRepository.find({
      where: {
        group: {
          id: In(groups.map((i) => i.id)),
        },
        [list]: {
          id,
        },
      },
      select: ['id', 'access', 'groupId'],
    });

    const data = users.map((u) => {
      const result = {
        ...u,
        access: null,
      };
      const findGroup = groups.find((g) => g.groups_users[0]?.userId === u.id);
      if (findGroup) {
        const findPrivilege = privileges.find(
          (p) => p.groupId === findGroup.id,
        );
        if (findPrivilege) result.access = findPrivilege.access;
      }
      return result;
    });

    return { data, total };
  }

  async getAllByGroups(
    list: EPrivilegeList,
    id: number,
    { sort = ['id', 'DESC'], range = [1, 15], filter = {} }: QuerySearchDto,
  ) {
    const { data: groups, total } = await this.privilegeGroupRepository.getAll({
      sort,
      filter: { ...filter, type: GroupType.ADDITIONAL },
      range,
    });

    const privileges = await this.privilegeRepository.find({
      where: {
        group: {
          id: In(groups.map((i) => i.id)),
        },
        [list]: {
          id,
        },
      },
      select: ['id', 'access', 'groupId'],
    });

    const data = groups.map((g) => {
      const result = {
        ...g,
        access: null,
      };
      const findPrivilege = privileges.find((p) => p.groupId === g.id);
      if (findPrivilege) result.access = findPrivilege.access;

      return result;
    });

    return { data, total };
  }

  async createByUser(
    userId: number,
    list: EPrivilegeList,
    id: number,
    { access }: PrivilegeCreateDto,
  ): Promise<Privilege> {
    const user = await this.userRepository.getById(userId);

    let group = await this.privilegeGroupRepository.findOne({
      where: {
        groups_users: {
          userId: user.id,
        },
        type: GroupType.MAIN,
      },
    });
    if (!group) {
      group = this.privilegeGroupRepository.create({
        type: GroupType.MAIN,
        name: 'Personal',
      });
      await this.privilegeGroupRepository.save(group);
      await this.groupUserRepository.save(
        this.groupUserRepository.create({
          user,
          group,
        }),
      );
    }

    return this.create(group, list, id, access);
  }

  async createByGroup(
    groupId: number,
    list: EPrivilegeList,
    id: number,
    { access }: PrivilegeCreateDto,
  ): Promise<Privilege> {
    const group = await this.privilegeGroupRepository.getById(groupId);

    return this.create(group, list, id, access);
  }

  async create(
    group: PrivilegeGroup,
    list: EPrivilegeList,
    id: number,
    access: Permit,
  ): Promise<Privilege> {
    let target: Company | Hall | Device | Password;
    switch (list) {
      case EPrivilegeList.COMPANY:
        target = await this.companyRepository.getById(id);
        break;
      case EPrivilegeList.HALL:
        target = await this.hallRepository.getById(id);
        break;
      case EPrivilegeList.DEVICE:
        target = await this.deviceRepository.getById(id);
        break;
      case EPrivilegeList.PASSWORD:
        target = await this.passwordRepository.getById(id);
        break;
      default:
        throw new CustomException(HttpStatus.BAD_REQUEST, 'Wrong name list');
    }

    const privilege = this.privilegeRepository.create({
      access,
      group,
      [list]: target,
    });
    console.log('privilege', privilege);
    await this.privilegeRepository.save(privilege);

    return privilege;
  }
}
