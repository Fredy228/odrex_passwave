import { HttpStatus, Injectable } from '@nestjs/common';
import { EntityManager, In } from 'typeorm';

import { PrivilegeRepository } from '../../repository/privilege.repository';
import { PrivilegeGroupRepository } from '../../repository/privilege-group.repository';
import { UserRepository } from '../../repository/user.repository';
import { QuerySearchDto } from '../../dto/query-search.dto';
import {
  EPrivilegeDirection,
  EPrivilegeList,
  EPrivilegeType,
} from '../../enums/privilege.enum';
import { CustomException } from '../../services/custom-exception';
import { PrivilegeCreateDto } from './dto/privilege.create.dto';
import { GroupType } from '../../enums/group.enum';
import { HallRepository } from '../../repository/hall.repository';
import { CompanyRepository } from '../../repository/company.repository';
import { DeviceRepository } from '../../repository/device.repository';
import { PasswordRepository } from '../../repository/password.repository';
import { Hall } from '../../entity/hall.entity';
import { Company } from '../../entity/company.entity';
import { PrivilegeGroup } from '../../entity/privilege-group.entity';
import { Permit } from '../../enums/permit.enum';
import { Privilege } from '../../entity/privilege.entity';
import { RoleEnum } from '../../enums/role.enum';
import { GroupUserRepository } from '../../repository/group-user.repository';
import { Password } from '../../entity/password.entity';

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
    private readonly entityManager: EntityManager,
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
    direction: EPrivilegeDirection,
    userId: number,
    list: EPrivilegeList,
    id: number,
    { access }: PrivilegeCreateDto,
  ): Promise<void> {
    const user = await this.userRepository.getById(userId);

    const userGroup = await this.groupUserRepository.findOne({
      where: {
        userId: user.id,
        group: {
          type: GroupType.MAIN,
        },
      },
      relations: {
        group: true,
      },
    });

    if (!userGroup) {
      const group = this.privilegeGroupRepository.create({
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

    switch (direction) {
      case EPrivilegeDirection.UP:
        return this.createRecursiveUp(userGroup.group, list, id, access);
      case EPrivilegeDirection.DOWN:
        return this.createRecursiveDown(userGroup.group, list, id, access);
    }
  }

  async createByGroup(
    direction: EPrivilegeDirection,
    groupId: number,
    list: EPrivilegeList,
    id: number,
    { access }: PrivilegeCreateDto,
  ): Promise<void> {
    const group = await this.privilegeGroupRepository.getById(groupId);

    switch (direction) {
      case EPrivilegeDirection.UP:
        return this.createRecursiveUp(group, list, id, access);
      case EPrivilegeDirection.DOWN:
        return this.createRecursiveDown(group, list, id, access);
    }
  }

  async createRecursiveUp(
    group: PrivilegeGroup,
    list: EPrivilegeList,
    id: number,
    access: Permit = Permit.READ,
  ) {
    let hall: Hall | null;
    let company: Company | null;

    return this.entityManager.transaction(async (transaction) => {
      if (list === EPrivilegeList.PASSWORD) {
        const pass = await this.passwordRepository.getById(id);
        const privilege = await this.privilegeRepository.getByGroupTarget(
          group.id,
          EPrivilegeList.PASSWORD,
          pass.id,
        );

        if (privilege && list === EPrivilegeList.PASSWORD) {
          await transaction.update(Privilege, privilege.id, { access });
        }

        if (!privilege) {
          await transaction.save(
            Privilege,
            transaction.create(Privilege, {
              group,
              password: pass,
              access: access,
            }),
          );
        }
        hall = await this.hallRepository.findOneBy({
          devices: { passwords: { id: pass.id } },
        });
      }
      if (list === EPrivilegeList.HALL || hall) {
        if (!hall) hall = await this.hallRepository.getById(id);
        const privilege = await this.privilegeRepository.getByGroupTarget(
          group.id,
          EPrivilegeList.HALL,
          hall.id,
        );
        if (privilege && list === EPrivilegeList.HALL) {
          await transaction.update(Privilege, privilege.id, { access });
        }

        if (!privilege) {
          await transaction.save(
            Privilege,
            transaction.create(Privilege, {
              group,
              hall,
              access: list === EPrivilegeList.HALL ? access : Permit.READ,
            }),
          );
        }
        company = await this.companyRepository.findOneBy({
          halls: { id: hall.id },
        });
      }
      if (list === EPrivilegeList.COMPANY || company) {
        if (!company) company = await this.companyRepository.getById(id);
        const privilege = await this.privilegeRepository.getByGroupTarget(
          group.id,
          EPrivilegeList.COMPANY,
          company.id,
        );
        if (privilege && list === EPrivilegeList.COMPANY) {
          await transaction.update(Privilege, privilege.id, { access });
        }

        if (!privilege) {
          await transaction.save(
            Privilege,
            transaction.create(Privilege, {
              group,
              company,
              access: list === EPrivilegeList.COMPANY ? access : Permit.READ,
            }),
          );
        }
      }
    });
  }

  async createRecursiveDown(
    group: PrivilegeGroup,
    list: EPrivilegeList,
    id: number,
    access: Permit = Permit.READ,
  ) {
    let halls: Hall[] = [];
    let passwords: Password[] = [];

    return this.entityManager.transaction(async (transaction) => {
      if (list === EPrivilegeList.COMPANY) {
        const company = await this.companyRepository.getById(id);
        const privilege = await this.privilegeRepository.getByGroupTarget(
          group.id,
          EPrivilegeList.COMPANY,
          company.id,
        );
        if (!privilege) {
          await transaction.save(
            Privilege,
            transaction.create(Privilege, {
              group,
              company,
              access,
            }),
          );
        } else if (access === Permit.EDIT && privilege.access === Permit.READ) {
          await transaction.update(Privilege, privilege.id, { access });
        }
        halls = await this.hallRepository.findBy({
          company: {
            id: company.id,
          },
        });
      }
      if (list === EPrivilegeList.HALL || halls.length) {
        if (list === EPrivilegeList.HALL)
          halls.push(await this.hallRepository.getById(id));

        const privileges = await this.privilegeRepository.getAllByGroupTarget(
          group.id,
          EPrivilegeList.HALL,
          halls.map((i) => i.id),
        );

        const notExistHalls: Hall[] = [];
        halls.forEach((h) => {
          if (!privileges.find((p) => p.hallId === h.id)) {
            notExistHalls.push(h);
          }
        });
        if (privileges.length && access === Permit.EDIT)
          await transaction.update(
            Privilege,
            privileges.map((i) => i.id),
            {
              access,
            },
          );
        if (notExistHalls.length) {
          await Promise.all(
            notExistHalls.map((i) => {
              return transaction.save(
                transaction.create(Privilege, {
                  group,
                  hall: i,
                  access,
                }),
              );
            }),
          );
        }

        passwords = await this.passwordRepository.findBy({
          device: {
            hall: { id: In(halls.map((i) => i.id)) },
          },
        });
      }
      if (list === EPrivilegeList.PASSWORD || passwords.length) {
        if (list === EPrivilegeList.PASSWORD)
          passwords.push(await this.passwordRepository.getById(id));

        const privileges = await this.privilegeRepository.getAllByGroupTarget(
          group.id,
          EPrivilegeList.PASSWORD,
          passwords.map((i) => i.id),
        );

        const notExistPass: Password[] = [];
        passwords.forEach((pass) => {
          if (!privileges.find((p) => p.passwordId === pass.id)) {
            notExistPass.push(pass);
          }
        });
        if (privileges.length && access === Permit.EDIT)
          await transaction.update(
            Privilege,
            privileges.map((i) => i.id),
            {
              access,
            },
          );

        if (notExistPass.length) {
          await Promise.all(
            notExistPass.map((i) => {
              return transaction.save(
                transaction.create(Privilege, {
                  group,
                  password: i,
                  access,
                }),
              );
            }),
          );
        }
      }
    });
  }
}
