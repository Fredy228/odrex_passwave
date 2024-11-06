import { HttpStatus, Injectable } from '@nestjs/common';
import { ILike } from 'typeorm';

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

@Injectable()
export class HallService {
  constructor(
    private readonly hallRepository: HallRepository,
    private readonly companyRepository: CompanyRepository,
    private readonly privilegeRepository: PrivilegeRepository,
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
    const privileges: Privilege[] | false =
      Boolean(user.role !== RoleEnum.ADMIN) &&
      (await this.privilegeRepository.find({
        where: {
          group: {
            user,
          },
        },
      }));
    if (privileges?.length === 0) return { data: [], total: 0 };

    return await this.hallRepository.getByPrivilege(
      {
        sort,
        filter,
        range,
      },
      companyId,
      privileges || undefined,
    );
  }

  async getById(hallId: number): Promise<Hall> {
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
