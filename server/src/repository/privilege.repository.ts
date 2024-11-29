import { HttpStatus, Injectable } from '@nestjs/common';
import {
  DataSource,
  FindOptionsWhere,
  In,
  IsNull,
  Not,
  Repository,
} from 'typeorm';

import { Privilege } from '../entity/privilege.entity';
import { Permit } from '../enums/permit.enum';
import { RoleEnum } from '../enums/role.enum';
import { CustomException } from '../services/custom-exception';
import { User } from '../entity/user.entity';
import { EPrivilegeList } from '../enums/privilege.enum';
import { GroupUserRepository } from './group-user.repository';

@Injectable()
export class PrivilegeRepository extends Repository<Privilege> {
  constructor(
    private dataSource: DataSource,
    private readonly groupUserRepository: GroupUserRepository,
  ) {
    super(Privilege, dataSource.createEntityManager());
  }

  async checkIsEditPass(user: User, passId: number) {
    if (user.role === RoleEnum.ADMIN) return;

    const groupUser = await this.groupUserRepository.findOneBy({
      userId: user.id,
      group: {
        privileges: {
          access: Permit.EDIT,
          passwordId: passId,
        },
      },
    });

    if (groupUser) return;

    throw new CustomException(
      HttpStatus.FORBIDDEN,
      "You don't have editing privileges",
    );
  }

  async getByUser(user: User, list: EPrivilegeList): Promise<Privilege[]> {
    const groupUser = await this.groupUserRepository.findBy({
      userId: user.id,
    });
    const options: FindOptionsWhere<Privilege> = {
      group: {
        id: In(groupUser.map((i) => i.groupId)),
      },
      [list]: {
        id: Not(IsNull()),
      },
    };

    return this.find({
      where: options,
    });
  }

  async getByGroupTarget(
    groupId: number,
    list: EPrivilegeList,
    id: number,
  ): Promise<Privilege | null> {
    const where: FindOptionsWhere<Privilege> = {
      groupId,
      [list]: {
        id,
      },
    };
    const privilege = await this.findOne({
      where,
    });

    if (!privilege) return null;

    return privilege;
  }

  async getAllByGroupTarget(
    groupId: number,
    list: EPrivilegeList,
    ids: number[],
  ): Promise<Privilege[]> {
    return this.find({
      where: {
        groupId,
        [list]: {
          id: In(ids),
        },
      },
    });
  }
}
