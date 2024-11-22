import { Injectable } from '@nestjs/common';

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
    const privileges: Privilege[] | undefined =
      user.role === RoleEnum.ADMIN
        ? undefined
        : await this.privilegeRepository.getByUser(
            user,
            EPrivilegeList.COMPANY,
          );
    console.log('privileges-company', privileges);
    if (privileges?.length === 0) return { data: [], total: 0 };

    return await this.companyRepository.getByPrivilege(
      {
        sort,
        filter,
        range,
      },
      privileges,
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
