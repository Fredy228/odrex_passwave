import { HttpStatus, Injectable } from '@nestjs/common';

import { CompanyRepository } from '../../repository/company.repository';
import { CompanyCreateDto } from './dto/company.create.dto';
import { Company } from '../../entity/company.entity';
import { User } from '../../entity/user.entity';
import { RoleEnum } from '../../enums/role.enum';
import { PrivilegeRepository } from '../../repository/privilege.repository';
import { QuerySearchDto } from '../../dto/query-search.dto';
import { CompanyUpdateDto } from './dto/company.update.dto';
import { Privilege } from '../../entity/privilege.entity';
import { EPrivilegeList } from '../../enums/privilege.enum';
import { CustomException } from '../../services/custom-exception';
import { GroupUserRepository } from '../../repository/group-user.repository';
import { In, IsNull, Not } from 'typeorm';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly privilegeRepository: PrivilegeRepository,
    private readonly groupUserRepository: GroupUserRepository,
  ) {}

  async create(body: CompanyCreateDto): Promise<Company> {
    const newCompany = this.companyRepository.create({
      ...body,
    });

    await this.companyRepository.save(newCompany);

    return newCompany;
  }

  async getById(user: User, companyId: number) {
    if (user.role === RoleEnum.ADMIN)
      return this.companyRepository.getById(companyId);

    const groupUser = await this.groupUserRepository.findOneBy({
      user: {
        id: user.id,
      },
      group: {
        privileges: {
          company: {
            id: companyId,
          },
        },
      },
    });

    if (!groupUser)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Not found company with ID ${companyId}`,
      );

    return this.companyRepository.getById(companyId);
  }

  async getAll(
    user: User,
    { sort = ['id', 'DESC'], range = [1, 15], filter = {} }: QuerySearchDto,
  ): Promise<{ data: Company[]; total: number }> {
    let where = undefined;
    if (user.role !== RoleEnum.ADMIN) {
      const groupUsers = await this.groupUserRepository.findBy({
        userId: user.id,
      });
      const privileges = await this.privilegeRepository.findBy({
        companyId: Not(IsNull()),
        group: {
          id: In(groupUsers.map((i) => i.groupId)),
        },
      });
      where = {
        id: In(privileges.map((i) => i.companyId)),
      };
    }

    return await this.companyRepository.getByPrivilege(
      {
        sort,
        filter,
        range,
      },
      where,
    );
  }

  async update(
    companyId: number,
    body: Partial<CompanyUpdateDto>,
  ): Promise<Company> {
    const company = await this.companyRepository.getById(companyId);

    await this.companyRepository.update(company.id, body);

    return Object.assign(company, body);
  }

  async delete(companyId: number): Promise<Company> {
    const company = await this.companyRepository.getById(companyId);

    await this.companyRepository.delete(company.id);

    return company;
  }
}
