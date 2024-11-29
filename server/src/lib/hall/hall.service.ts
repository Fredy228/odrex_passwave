import { HttpStatus, Injectable } from '@nestjs/common';

import { HallRepository } from '../../repository/hall.repository';
import { HallCreateDto } from './dto/hall.create.dto';
import { CompanyRepository } from '../../repository/company.repository';
import { CustomException } from '../../services/custom-exception';
import { Hall } from '../../entity/hall.entity';
import { User } from '../../entity/user.entity';
import { QuerySearchDto } from '../../dto/query-search.dto';
import { RoleEnum } from '../../enums/role.enum';
import { PrivilegeRepository } from '../../repository/privilege.repository';
import { HallUpdateDto } from './dto/hall.update.dto';
import { Privilege } from '../../entity/privilege.entity';
import { EPrivilegeList } from '../../enums/privilege.enum';
import { GroupUserRepository } from '../../repository/group-user.repository';
import { In, IsNull, Not } from 'typeorm';

@Injectable()
export class HallService {
  constructor(
    private readonly hallRepository: HallRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly privilegeRepository: PrivilegeRepository,
    private readonly groupUserRepository: GroupUserRepository,
  ) {}

  async create(companyId: number, body: HallCreateDto): Promise<Hall> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });
    if (!company)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Not found company with ID "${companyId}"`,
      );

    const newHall = this.hallRepository.create({
      ...body,
      company,
    });

    await this.hallRepository.save(newHall);

    return newHall;
  }

  async getAll(
    user: User,
    { sort = ['id', 'DESC'], range = [1, 15], filter = {} }: QuerySearchDto,
    companyId: number,
  ): Promise<{ data: Hall[]; total: number }> {
    let where = undefined;
    if (user.role !== RoleEnum.ADMIN) {
      const groupUsers = await this.groupUserRepository.findBy({
        userId: user.id,
      });
      const privileges = await this.privilegeRepository.findBy({
        hallId: Not(IsNull()),
        group: {
          id: In(groupUsers.map((i) => i.groupId)),
        },
      });
      where = {
        id: In(privileges.map((i) => i.hallId)),
      };
    }

    return await this.hallRepository.getByPrivilege(
      {
        sort,
        filter,
        range,
      },
      companyId,
      where,
    );
  }

  async getById(user: User, hallId: number): Promise<Hall> {
    if (user.role === RoleEnum.ADMIN)
      return this.hallRepository.getById(hallId);

    const groupUser = await this.groupUserRepository.findOneBy({
      user: {
        id: user.id,
      },
      group: {
        privileges: {
          hall: {
            id: hallId,
          },
        },
      },
    });

    if (!groupUser)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Not found hall with ID ${hallId}`,
      );
    return this.hallRepository.getById(hallId);
  }

  async update(hallId: number, body: Partial<HallUpdateDto>) {
    const hall = await this.hallRepository.getById(hallId);

    await this.hallRepository.update(hall.id, body);

    return Object.assign(hall, body);
  }

  async delete(hallId: number): Promise<Hall> {
    const hall = await this.hallRepository.findOne({
      where: { id: hallId },
    });

    if (!hall)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Not found hall with ID "${hallId}"`,
      );

    await this.hallRepository.delete(hall.id);

    return hall;
  }
}
