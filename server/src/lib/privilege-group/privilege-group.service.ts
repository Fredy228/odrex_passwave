import { Injectable } from '@nestjs/common';
import { PrivilegeGroupRepository } from '../../repository/privilege-group.repository';
import { PrivilegeGroupCreateDto } from './dto/privilege-group.create.dto';
import { GroupType } from '../../enums/group.enum';
import { PrivilegeGroup } from '../../entity/privilege-group.entity';
import { QuerySearchDto } from '../../dto/query-search.dto';
import { PrivilegeGroupUpdateDto } from './dto/privilege-group.update.dto';

@Injectable()
export class PrivilegeGroupService {
  constructor(
    private readonly privilegeGroupRepository: PrivilegeGroupRepository,
  ) {}

  async create(body: PrivilegeGroupCreateDto): Promise<PrivilegeGroup> {
    const newGroup = this.privilegeGroupRepository.create({
      ...body,
      type: GroupType.ADDITIONAL,
    });
    await this.privilegeGroupRepository.save(newGroup);
    return newGroup;
  }

  async getAll({
    sort = ['id', 'DESC'],
    range = [1, 15],
    filter = {},
  }: QuerySearchDto): Promise<{
    data: PrivilegeGroup[];
    total: number;
  }> {
    return this.privilegeGroupRepository.getAll({ sort, range, filter });
  }

  async update(
    groupId: number,
    body: PrivilegeGroupUpdateDto,
  ): Promise<PrivilegeGroup> {
    const group = await this.privilegeGroupRepository.getById(groupId);

    await this.privilegeGroupRepository.update(group.id, body);

    return Object.assign(group, body);
  }

  async delete(groupId: number): Promise<PrivilegeGroup> {
    const group = await this.privilegeGroupRepository.getById(groupId);

    await this.privilegeGroupRepository.delete(group.id);

    return group;
  }
}
