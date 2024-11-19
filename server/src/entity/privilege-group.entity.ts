import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Privilege } from './privilege.entity';
import { GroupType } from '../enums/group.enum';
import { GroupUser } from './group-user.entity';

@Entity({ name: 'privilege_group' })
export class PrivilegeGroup {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 250, nullable: false })
  name: string;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: GroupType,
    default: GroupType.MAIN,
    nullable: false,
  })
  type: GroupType;

  @OneToMany(() => Privilege, (privilege) => privilege.group)
  privileges: Privilege[];

  @OneToMany(() => GroupUser, (group_user) => group_user.user)
  groups_users: GroupUser[];
}
