import { Injectable } from '@nestjs/common';
import { PrivilegeGroupRepository } from '../../repository/privilege-group.repository';
import { PrivilegeGroupCreateDto } from './dto/privilege-group.create.dto';
import { GroupType } from '../../enums/group.enum';
import { PrivilegeGroup } from '../../entity/privilege-group.entity';
import { QuerySearchDto } from '../../dto/query-search.dto';
import { PrivilegeGroupUpdateDto } from './dto/privilege-group.update.dto';
import { UserRepository } from '../../repository/user.repository';
import { GroupUserRepository } from '../../repository/group-user.repository';

@Injectable()
export class PrivilegeGroupService {
  constructor(
    private readonly privilegeGroupRepository: PrivilegeGroupRepository,
    private readonly userRepository: UserRepository,
    private readonly groupUserRepository: GroupUserRepository,
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

  async userAddOrRemove(
    idUser: number,
    idGroup: number,
    action: 'add' | 'remove',
  ) {
    const [group, user] = await Promise.all([
      this.privilegeGroupRepository.getById(idGroup),
      this.userRepository.getById(idUser),
    ]);
    console.log('group', group.id);
    console.log('user', user.id);
    // const group = await this.privilegeGroupRepository.getById(idGroup);
    // const user = await this.userRepository.getById(idUser);
    const group_user = await this.groupUserRepository.findOne({
      where: {
        userId: user.id,
        groupId: group.id,
      },
    });
    if (action === 'add') {
      if (group_user) return;
      await this.groupUserRepository.save(
        this.groupUserRepository.create({
          user,
          group,
        }),
      );
    }
    if (action === 'remove') {
      if (!group_user) return;
      await this.groupUserRepository.delete(group_user);
    }
    await this.privilegeGroupRepository.save(group);
    return;
  }
}
