import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { User } from './user.entity';
import { Privilege } from './privilege.entity';
import { GroupType } from '../enums/group.enum';

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

  @ManyToOne(() => User, (user) => user.privilege_groups, {
    onDelete: 'CASCADE',
  })
  user: User;
}
