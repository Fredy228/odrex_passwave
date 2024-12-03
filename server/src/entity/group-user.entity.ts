import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { User } from './user.entity';
import { PrivilegeGroup } from './privilege-group.entity';

@Entity({ name: 'group_user' })
export class GroupUser {
  @PrimaryColumn({
    type: 'integer',
  })
  userId: number;

  @ManyToOne(() => User, (user) => user.groups_users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @PrimaryColumn({
    type: 'integer',
  })
  groupId: number;

  @ManyToOne(() => PrivilegeGroup, (group) => group.groups_users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'groupId' })
  group: PrivilegeGroup;
}
