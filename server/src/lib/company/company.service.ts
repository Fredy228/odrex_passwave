import { HttpStatus, Injectable } from '@nestjs/common';

import { CompanyRepository } from '../../repository/company.repository';
import { CompanyCreateDto } from './dto/company.create.dto';
import { Company } from '../../entity/company.entity';
import { CustomException } from '../../services/custom-exception';
import { User } from '../../entity/user.entity';
import { RoleEnum } from '../../enums/role.enum';
import { PrivilegeRepository } from '../../repository/privilege.repository';
import { QuerySearchDto } from '../../dto/query-search.dto';
import { ILike } from 'typeorm';
import { CompanyUpdateDto } from './dto/company.update.dto';
import { Privilege } from '../../entity/privilege.entity';

@Injectable()
export class CompanyService {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly privilegeRepository: PrivilegeRepository,
  ) {}

  async create(body: CompanyCreateDto): Promise<Company> {
    const newCompany = this.companyRepository.create({
      ...body,
    });

    await this.companyRepository.save(newCompany);

    return newCompany;
  }

  async getById(companyId: number) {
    return this.companyRepository.getById(companyId);
  }

  async getAll(
    user: User,
    { sort = ['id', 'DESC'], range = [1, 15], filter = {} }: QuerySearchDto,
  ): Promise<{ data: Company[]; total: number }> {
    // if (user.role === RoleEnum.ADMIN) {
    //   const [companies, total] = await this.companyRepository.findAndCount({
    //     where: {
    //       name: filter.name && ILike('%' + filter.name + '%'),
    //     },
    //     order: {
    //       [sort[0]]: sort[1],
    //     },
    //     take: range[1] - range[0] + 1,
    //     skip: range[0] - 1,
    //   });
    //   return { data: companies, total };
    // }
    //
    // const privileges = await this.privilegeRepository.find({
    //   where: {
    //     group: {
    //       user,
    //     },
    //   },
    // });
    // if (!privileges.length) return { data: [], total: 0 };

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

    return await this.companyRepository.getByPrivilege(
      {
        sort,
        filter,
        range,
      },
      privileges || undefined,
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
