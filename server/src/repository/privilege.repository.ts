import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { Privilege } from '../entity/privilege.entity';
import { Permit } from '../enums/permit.enum';
import { RoleEnum } from '../enums/role.enum';
import { CustomException } from '../services/custom-exception';
import { User } from '../entity/user.entity';

@Injectable()
export class PrivilegeRepository extends Repository<Privilege> {
  constructor(private dataSource: DataSource) {
    super(Privilege, dataSource.createEntityManager());
  }

  async checkIsEditPass(user: User, passId: number) {
    if (user.role === RoleEnum.ADMIN) return;

    const privilege = await this.findOne({
      where: {
        group: {
          user: {
            id: user.id,
          },
        },
        password: {
          id: passId,
        },
      },
    });
    if (privilege?.access === Permit.EDIT) return;

    throw new CustomException(
      HttpStatus.FORBIDDEN,
      "You don't have editing privileges",
    );
  }
}
