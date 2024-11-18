import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Permit } from '../enums/permit.enum';
import { Password } from './password.entity';
import { Device } from './device.entity';
import { Hall } from './hall.entity';
import { Company } from './company.entity';
import { PrivilegeGroup } from './privilege-group.entity';

@Entity({ name: 'privilege' })
export class Privilege {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: Permit,
    default: Permit.READ,
    nullable: false,
  })
  access: Permit;

  @Column({ nullable: true })
  groupId: number;
  @ManyToOne(() => PrivilegeGroup, (group) => group.privileges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'groupId' })
  group: PrivilegeGroup;

  @Column({ nullable: true })
  companyId: number;
  @ManyToOne(() => Company, (company) => company.privileges, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @ManyToOne(() => Hall, (hall) => hall.privileges, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  hall: Hall;

  @ManyToOne(() => Device, (device) => device.privileges, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  device: Device;

  @ManyToOne(() => Password, (pass) => pass.privileges, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  password: Password;
}
