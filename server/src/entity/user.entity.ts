import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { JsonTransformer } from '@anchan828/typeorm-transformers';

import { UserDevices } from './user-devices.entity';
import { RoleEnum } from '../enums/role.enum';
import { UserPhoneType } from '../types/user.type';
import { GroupUser } from './group-user.entity';

@Entity({ name: 'user' })
@Unique(['email'])
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: false })
  email: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @ApiProperty()
  @Column({
    name: 'avatar_url',
    type: 'varchar',
    length: 500,
    nullable: true,
    default: null,
  })
  avatarUrl: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 500, nullable: false })
  password: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    transformer: new JsonTransformer<UserPhoneType | null>(null),
  })
  phone: UserPhoneType | null;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.USER,
    nullable: false,
  })
  role: RoleEnum;

  @CreateDateColumn({
    name: 'createAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'updateAt',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateAt: Date;

  @OneToMany(() => UserDevices, (device) => device.user)
  devices: UserDevices[];

  @OneToMany(() => GroupUser, (group_user) => group_user.user)
  groups_users: GroupUser[];
}
