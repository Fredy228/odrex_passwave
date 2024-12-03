import { HttpStatus, Injectable } from '@nestjs/common';
import { DataSource, ILike, Repository } from 'typeorm';

import { Company } from '../entity/company.entity';
import { QuerySearchDto } from '../dto/query-search.dto';
import { CustomException } from '../services/custom-exception';

@Injectable()
export class CompanyRepository extends Repository<Company> {
  constructor(private dataSource: DataSource) {
    super(Company, dataSource.createEntityManager());
  }

  async getByPrivilege(
    { range, sort, filter }: QuerySearchDto,
    where?: Record<string, any>,
  ) {
    const [companies, total] = await this.findAndCount({
      where: {
        ...where,
        name: filter.name && ILike('%' + filter.name + '%'),
      },
      order: {
        [sort[0]]: sort[1],
      },
      take: range[1] - range[0] + 1,
      skip: range[0] - 1,
    });

    return { data: companies, total };
  }

  async getById(id: number): Promise<Company> {
    const company = await this.findOne({
      where: {
        id,
      },
    });

    if (!company)
      throw new CustomException(
        HttpStatus.NOT_FOUND,
        `Not found company with ID "${id}"`,
      );

    return company;
  }
}
